# -*- coding: utf-8 -*-
"""
prerender.py — bake the JavaScript-built parts of the site into the HTML.

The header, the footer and the 30 mocktail cards are built by JavaScript
(assets/js/shared.js and assets/js/mocktails.js). Google runs that JavaScript;
most AI crawlers (ChatGPT, Claude, Perplexity) and link previews do not, so
they would see pages without navigation, without a footer and without a
single recipe. This script loads every page in a headless browser, lets the
scripts build those parts, and writes the result into the HTML source. The
scripts notice the markup is already there and only wire it up.

It also writes, from the same data in assets/js/config.js and the pages:
  · JSON-LD structured data in each page's <head> (organisation, product with
    price, FAQ, breadcrumbs, the 30 recipes), for Google and AI answers;
  · llms.txt, a plain summary of the site for language models.

Run it after changing any of: the header or footer templates in shared.js,
the recipes in mocktails.js, the price or company details in config.js, or
the FAQ on product.html.

    pip install playwright && playwright install chromium
    python tools/prerender.py          # bake pages, JSON-LD and llms.txt
    python tools/prerender.py --og     # also redraw the share image

Baked blocks sit between <!-- prerender:… --> markers. Do not edit inside
them by hand: the next run overwrites them.
"""
import functools
import http.server
import json
import pathlib
import re
import sys
import threading

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sys.exit("playwright is not installed.\n"
             "  pip install playwright && playwright install chromium")

ROOT = pathlib.Path(__file__).resolve().parent.parent
PORT = 8798
NOTE = 'gebakken door tools/prerender.py, niet met de hand aanpassen'

# Pages that are meant to be found. The rest are noindex and get no JSON-LD.
INDEXABLE = {
    'index.html': None,
    'product.html': 'Het experiment',
    'mocktails.html': 'Mocktailrecepten',
    'contact.html': 'Contact',
    'algemene-voorwaarden.html': 'Algemene voorwaarden',
    'privacybeleid.html': 'Privacybeleid',
    'cookiebeleid.html': 'Cookiebeleid',
}

OG_IMAGE = 'assets/img/brand/og-image.png'


# ─── Blocks ──────────────────────────────────────────────────────────────

def block_re(name):
    return re.compile(r'<!-- prerender:%s[^>]*-->[\s\S]*?<!-- /prerender:%s -->' % (name, name))


def unbake(html):
    """The page as it was before baking: placeholders, no JSON-LD."""
    html = block_re('header').sub('<div data-site-header></div>', html)
    html = block_re('footer').sub('<div data-site-footer></div>', html)
    html = block_re('mocktails').sub('<!-- prerender:mocktails --><!-- /prerender:mocktails -->', html)
    html = re.sub(r'\n[ \t]*<!-- prerender:jsonld[^>]*-->[\s\S]*?<!-- /prerender:jsonld -->', '', html)
    return html


# Line breaks go only next to block-level tags, where whitespace never
# renders, so the baked markup looks exactly like the injected markup.
BREAK_OPEN = ('header', 'footer', 'nav', 'div', 'article', 'aside', 'ul', 'ol', 'details', 'p', 'h3')
BREAK_CLOSE = ('header', 'footer', 'nav', 'div', 'article', 'aside', 'ul', 'ol', 'details')
TAG = re.compile(r'<(/?)([a-z0-9]+)\b[^>]*>')


def tidy(markup, indent):
    out, depth, pos = [], 0, 0
    for m in TAG.finditer(markup):
        closing, name = m.group(1) == '/', m.group(2)
        if closing and name in BREAK_OPEN:
            depth -= 1
        breaks = (name in BREAK_CLOSE) if closing else (name in BREAK_OPEN)
        out.append(markup[pos:m.start()])
        if breaks and m.start() > 0:
            out.append('\n' + indent + '\t' * depth)
        out.append(m.group(0))
        pos = m.end()
        if not closing and name in BREAK_OPEN:
            depth += 1
    out.append(markup[pos:])
    return ''.join(out)


def bake_placeholder(html, name, markup):
    m = re.search(r'^([ \t]*)<div data-site-%s></div>' % name, html, re.M)
    if not m:
        return html
    indent = m.group(1)
    block = '<!-- prerender:%s · %s -->\n%s%s\n%s<!-- /prerender:%s -->' % (
        name, NOTE, indent, tidy(markup, indent), indent, name)
    return html[:m.start()] + indent + block + html[m.end():]


def bake_mocktails(html, markup):
    m = re.search(r'^([ \t]*)<!-- prerender:mocktails --><!-- /prerender:mocktails -->', html, re.M)
    if not m:
        return html
    indent = m.group(1)
    block = '<!-- prerender:mocktails · %s -->\n%s%s\n%s<!-- /prerender:mocktails -->' % (
        NOTE, indent, tidy(markup, indent), indent)
    return html[:m.start()] + indent + block + html[m.end():]


def bake_jsonld(html, graph):
    data = json.dumps({'@context': 'https://schema.org', '@graph': graph},
                      ensure_ascii=False, indent='\t')
    data = data.replace('</', '<\\/')  # never close the <script> early
    data = data.replace('\n', '\n\t\t')
    block = ('\n\t\t<!-- prerender:jsonld · %s -->\n\t\t<script type="application/ld+json">\n\t\t%s\n'
             '\t\t</script>\n\t\t<!-- /prerender:jsonld -->' % (NOTE, data))
    return html.replace('\n\t</head>', block + '\n\t</head>', 1)


# ─── Structured data ─────────────────────────────────────────────────────

def absolute(site, path=''):
    return site['url'].rstrip('/') + '/' + path


def organisation(site):
    org_id = absolute(site) + '#organisatie'
    street, _, place = site['company']['address'].partition(', ')
    postcode, _, city = place.partition(' ')
    org = {
        '@type': 'Organization',
        '@id': org_id,
        'name': site['name'],
        'legalName': site['company']['name'],
        'url': absolute(site),
        'slogan': site['tagline'],
        'logo': {
            '@type': 'ImageObject',
            'url': absolute(site, 'assets/img/brand/icon-512.png'),
            'width': 512,
            'height': 512,
        },
        'image': absolute(site, OG_IMAGE),
        'email': site['email'],
        'vatID': site['company']['vat'],
        'address': {
            '@type': 'PostalAddress',
            'streetAddress': street,
            'postalCode': postcode,
            'addressLocality': city,
            'addressCountry': 'BE',
        },
        'contactPoint': {
            '@type': 'ContactPoint',
            'contactType': 'customer support',
            'email': site['email'],
            'url': absolute(site, 'contact.html'),
            'availableLanguage': 'nl',
        },
    }
    same_as = [url for url in site.get('social', {}).values() if url]
    if same_as:
        org['sameAs'] = same_as
    return org


def website(site):
    return {
        '@type': 'WebSite',
        '@id': absolute(site) + '#website',
        'url': absolute(site),
        'name': site['name'],
        'description': site['tagline'],
        'inLanguage': 'nl-BE',
        'publisher': {'@id': absolute(site) + '#organisatie'},
    }


def graph_for(name, facts):
    site, page = facts['site'], facts['page']
    org_ref = {'@id': absolute(site) + '#organisatie'}
    url = page['canonical']
    webpage = {
        '@type': 'WebPage',
        '@id': url + '#pagina',
        'url': url,
        'name': page['title'],
        'description': page['description'],
        'inLanguage': 'nl-BE',
        'isPartOf': {'@id': absolute(site) + '#website'},
        'primaryImageOfPage': {'@type': 'ImageObject', 'url': absolute(site, OG_IMAGE)},
    }
    graph = [organisation(site), website(site), webpage]

    crumb = INDEXABLE[name]
    if crumb:
        webpage['breadcrumb'] = {
            '@type': 'BreadcrumbList',
            'itemListElement': [
                {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': absolute(site)},
                {'@type': 'ListItem', 'position': 2, 'name': crumb, 'item': url},
            ],
        }

    if name == 'index.html':
        webpage['about'] = {'@id': absolute(site, 'product.html') + '#product'}

    if name == 'contact.html':
        webpage['@type'] = 'ContactPage'

    if name == 'product.html':
        product = facts['product']
        item = {
            '@type': 'Product',
            '@id': url + '#product',
            'name': product['name'],
            'description': page['description'],
            'sku': product['id'],
            'category': 'Digitaal werkboek',
            'image': [absolute(site, OG_IMAGE), absolute(site, 'assets/img/brand/icon-512.png')],
            'brand': {'@type': 'Brand', 'name': site['name']},
            'manufacturer': org_ref,
            'url': url,
        }
        if product.get('priceConfirmed') and product.get('paymentLink') and product.get('priceCents'):
            item['offers'] = {
                '@type': 'Offer',
                'url': url,
                'price': '%.2f' % (product['priceCents'] / 100),
                'priceCurrency': product['currency'].upper(),
                'availability': 'https://schema.org/InStock',
                'itemCondition': 'https://schema.org/NewCondition',
                'seller': org_ref,
                # A digital file, mailed right after payment (terms §4): no
                # shipping cost, no handling or transit time.
                'shippingDetails': {
                    '@type': 'OfferShippingDetails',
                    'shippingRate': {'@type': 'MonetaryAmount', 'value': 0,
                                     'currency': product['currency'].upper()},
                    'shippingDestination': {'@type': 'DefinedRegion', 'addressCountry': 'BE'},
                    'deliveryTime': {
                        '@type': 'ShippingDeliveryTime',
                        'handlingTime': {'@type': 'QuantitativeValue', 'minValue': 0,
                                         'maxValue': 0, 'unitCode': 'DAY'},
                        'transitTime': {'@type': 'QuantitativeValue', 'minValue': 0,
                                        'maxValue': 0, 'unitCode': 'DAY'},
                    },
                },
                # Digital content: the right of withdrawal ends once delivery
                # starts with the buyer's consent (terms §5).
                'hasMerchantReturnPolicy': {
                    '@type': 'MerchantReturnPolicy',
                    'applicableCountry': 'BE',
                    'returnPolicyCategory': 'https://schema.org/MerchantReturnNotPermitted',
                    'merchantReturnLink': absolute(site, 'algemene-voorwaarden.html#herroepingsrecht'),
                },
            }
        graph.append(item)
        webpage['about'] = {'@id': url + '#product'}
        if facts['faq']:
            webpage['@type'] = ['WebPage', 'FAQPage']
            webpage['mainEntity'] = [
                {
                    '@type': 'Question',
                    'name': q,
                    'acceptedAnswer': {'@type': 'Answer', 'text': a},
                }
                for q, a in facts['faq']
            ]

    if name == 'mocktails.html' and facts['mocktails']:
        webpage['@type'] = 'CollectionPage'
        webpage['mainEntity'] = {
            '@type': 'ItemList',
            'name': 'Alcoholvrije mocktailrecepten',
            'numberOfItems': len(facts['mocktails']),
            'itemListElement': [
                {
                    '@type': 'ListItem',
                    'position': i + 1,
                    'url': url + '#' + m['slug'],
                    'item': recipe(site, url, m, org_ref),
                }
                for i, m in enumerate(facts['mocktails'])
            ],
        }

    return graph


def recipe(site, page_url, m, org_ref):
    item = {
        '@type': 'Recipe',
        '@id': page_url + '#' + m['slug'],
        'url': page_url + '#' + m['slug'],
        'name': m['name'],
        'description': m['tagline'],
        'author': org_ref,
        'recipeCategory': 'Mocktail',
        'keywords': 'mocktail, alcoholvrij, 0% alcohol, ' + m['category'].lower(),
        'prepTime': 'PT%dM' % m['minutes'],
        'totalTime': 'PT%dM' % m['minutes'],
        'recipeYield': '1 glas',
        'recipeIngredient': m['ingredients'],
        'recipeInstructions': [
            {'@type': 'HowToStep', 'text': s, 'url': '%s#%s-stap-%d' % (page_url, m['slug'], i + 1)}
            for i, s in enumerate(m['steps'])
        ],
    }
    if m.get('image'):
        item['image'] = absolute(site, m['image'])
    return item


# ─── llms.txt ────────────────────────────────────────────────────────────

def llms_txt(facts):
    site, product = facts['site'], facts['product']
    price = ('€ %s' % ('%.2f' % (product['priceCents'] / 100)).replace('.', ',')
             if product.get('priceConfirmed') else 'nog niet vastgelegd')
    lines = [
        '# %s' % site['name'],
        '',
        '> %s' % facts['home_description'],
        '',
        '0% Experiment is een Nederlandstalig (Belgisch) digitaal werkboek. Je zet alcohol 30 dagen',
        'op pauze en onderzoekt, met elke dag één vraag, een inzicht en een kleine opdracht, wat dat',
        'met je slaap, energie, hoofd, sociale leven en gewoontes doet. Het is geen programma om te',
        'stoppen met drinken en geen challenge: wie toch drinkt, heeft niets verpest maar iets ontdekt.',
        '',
        '- Product: %s (%s)' % (product['name'], product['subtitle']),
        '- Prijs: %s, eenmalig, incl. btw' % price,
        '- Inbegrepen: %s' % ', '.join(f[0].lower() + f[1:] for f in product['features']),
        '- Verkoper: %s, %s, België (btw %s)' % (
            site['company']['name'], site['company']['address'], site['company']['vat']),
        '- Contact: %s' % site['email'],
        '- Let op: %s' % facts['disclaimer'],
        '',
        '## Pagina\'s',
        '',
        '- [Het experiment](%s): wat er in het werkboek zit, hoe de 30 dagen zijn opgebouwd, prijs en veelgestelde vragen' % absolute(site, 'product.html'),
        '- [Mocktailrecepten](%s): %d alcoholvrije recepten met ingrediënten en bereiding' % (
            absolute(site, 'mocktails.html'), len(facts['mocktails'])),
        '- [Contact](%s): vragen over het werkboek, een bestelling of adverteren' % absolute(site, 'contact.html'),
        '',
        '## Veelgestelde vragen',
        '',
    ]
    for q, a in facts['faq']:
        lines.append('- **%s** %s' % (q, a))
    lines += [
        '',
        '## Juridisch',
        '',
        '- [Algemene voorwaarden](%s)' % absolute(site, 'algemene-voorwaarden.html'),
        '- [Privacybeleid](%s)' % absolute(site, 'privacybeleid.html'),
        '- [Cookiebeleid](%s)' % absolute(site, 'cookiebeleid.html'),
        '',
    ]
    return '\n'.join(lines)


# ─── Browser ─────────────────────────────────────────────────────────────

class Handler(http.server.SimpleHTTPRequestHandler):
    """Serves every page un-baked, so the scripts render fresh markup."""

    def log_message(self, *args):
        pass

    def do_GET(self):
        path = self.path.split('?')[0].lstrip('/') or 'index.html'
        if path.endswith('.html') and (ROOT / path).is_file():
            body = unbake((ROOT / path).read_text(encoding='utf-8')).encode('utf-8')
            self.send_response(200)
            self.send_header('content-type', 'text/html; charset=utf-8')
            self.send_header('content-length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()


READ = """() => {
    const text = (el) => el ? el.textContent.replace(/\\s+/g, ' ').trim() : '';
    const header = document.querySelector('header.header');
    const footer = document.querySelector('footer.footer');
    const grid = document.querySelector('[data-mocktail-grid]');
    return {
        header: header ? header.outerHTML : null,
        footer: footer ? footer.outerHTML : null,
        grid: grid && grid.querySelector('.mock') ? grid.innerHTML : null,
        site: window.SITE,
        product: window.PRODUCT,
        disclaimer: window.DISCLAIMER,
        mocktails: window.MOCKTAILS || null,
        faq: Array.from(document.querySelectorAll('.acc__item')).map((item) =>
            [text(item.querySelector('.acc__trigger')), text(item.querySelector('.acc__panel'))]),
        page: {
            title: document.title,
            description: (document.querySelector('meta[name=description]') || {}).content || '',
            canonical: (document.querySelector('link[rel=canonical]') || {}).href || '',
        },
    };
}"""


def main():
    redraw_og = '--og' in sys.argv
    handler = functools.partial(Handler, directory=str(ROOT))
    server = http.server.ThreadingHTTPServer(('127.0.0.1', PORT), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = 'http://127.0.0.1:%d/' % PORT

    pages = sorted(p.name for p in ROOT.glob('*.html'))
    read = {}

    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(viewport={'width': 1280, 'height': 900})
        errors = []
        for name in pages:
            page = ctx.new_page()
            page.on('pageerror', lambda e, name=name: errors.append('%s: %s' % (name, e)))
            page.goto(base + name, wait_until='load')
            page.wait_for_timeout(150)
            read[name] = page.evaluate(READ)
            page.close()

        if redraw_og:
            page = browser.new_page(viewport={'width': 1200, 'height': 630})
            page.goto(base + 'tools/og-image.html', wait_until='load')
            page.evaluate('document.fonts.ready')
            page.wait_for_timeout(300)
            page.screenshot(path=str(ROOT / OG_IMAGE))
            page.close()
            print('drew      %s' % OG_IMAGE)
        browser.close()
    server.shutdown()

    if errors:
        sys.exit('JavaScript errors while rendering, nothing written:\n  ' + '\n  '.join(errors))

    shared = {
        'faq': read['product.html']['faq'],
        'mocktails': read['mocktails.html']['mocktails'] or [],
        'home_description': read['index.html']['page']['description'],
    }

    for name in pages:
        r = read[name]
        path = ROOT / name
        before = path.read_text(encoding='utf-8')
        html = unbake(before)
        if r['header']:
            html = bake_placeholder(html, 'header', r['header'])
        if r['footer']:
            html = bake_placeholder(html, 'footer', r['footer'])
        if r['grid']:
            html = bake_mocktails(html, r['grid'])
        if name in INDEXABLE:
            facts = dict(shared, site=r['site'], product=r['product'], page=r['page'])
            html = bake_jsonld(html, graph_for(name, facts))
        if html != before:
            path.write_text(html, encoding='utf-8', newline='\n')
            print('baked     %s' % name)
        else:
            print('unchanged %s' % name)

    home = read['index.html']
    llms = llms_txt(dict(shared, site=home['site'], product=home['product'], disclaimer=home['disclaimer']))
    (ROOT / 'llms.txt').write_text(llms, encoding='utf-8', newline='\n')
    print('wrote     llms.txt')


if __name__ == '__main__':
    main()

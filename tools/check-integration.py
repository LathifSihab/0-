# -*- coding: utf-8 -*-
"""
check-integration.py — drive the real pages against fake providers.

The four things this site hands to someone else (Stripe, the file host, the
form service, the mailing list) cannot be unit-tested: they live in other
people's dashboards. What *can* be tested is everything on this side of the
wire — that a filled-in config reaches the buttons, that the forms send what
a provider expects, and that an unconfigured site says so instead of lying.

This serves the site on a local port, swaps assets/js/config.js for a filled-in
version per check, points the forms at a mock endpoint, and drives it all in
a headless browser. Nothing here touches your real assets/js/config.js.

    pip install playwright && playwright install chromium
    python tools/check-integration.py

Exit code 0 means every check passed.
"""
import json
import threading
import http.server
import functools
import pathlib
import sys

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sys.exit("playwright is not installed.\n"
             "  pip install playwright && playwright install chromium")

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONFIG = ROOT / 'assets' / 'js' / 'config.js'
PORT = 8799

received = []


class Handler(http.server.SimpleHTTPRequestHandler):
    """Serves the site, and stands in for Formspree, Brevo and friends."""

    def log_message(self, *args):
        pass

    def do_POST(self):
        length = int(self.headers.get('content-length', 0))
        body = self.rfile.read(length).decode('utf-8', 'replace')
        received.append((self.path, self.headers.get('content-type'), body))

        if self.path.startswith('/mock/fail'):
            payload = json.dumps({"errors": [{"message": "Dat adres staat al op de lijst."}]}).encode()
            self.send_response(422)
        else:
            payload = json.dumps({"ok": True}).encode()
            self.send_response(200)

        self.send_header('content-type', 'application/json')
        self.send_header('access-control-allow-origin', '*')
        self.send_header('content-length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


server = http.server.ThreadingHTTPServer(('127.0.0.1', PORT), functools.partial(Handler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % PORT

results = []


def check(name, ok, detail=''):
    results.append((ok, name))
    print(('PASS  ' if ok else 'FAIL  ') + name + (('  -- ' + str(detail)) if detail else ''))


def configured(page, extra):
    """Serve assets/js/config.js with `extra` appended, as if those values were set."""
    source = CONFIG.read_text(encoding='utf-8')
    page.route('**/js/config.js', lambda route: route.fulfill(
        status=200,
        content_type='application/javascript; charset=utf-8',
        body=source + '\n' + extra))


SOLD = ("window.PRODUCT.paymentLink='https://buy.stripe.com/test_abc123';"
        "window.PRODUCT.priceCents=2700;window.PRODUCT.priceConfirmed=true;")

with sync_playwright() as p:
    browser = p.chromium.launch()
    ctx = browser.new_context(viewport={'width': 1280, 'height': 900})
    ctx.add_init_script("try{localStorage.setItem('0pct-cookie-consent','{}')}catch(e){}")

    # 1 - Checkout ---------------------------------------------------------
    page = ctx.new_page()
    configured(page, SOLD)
    page.goto(BASE + 'product.html')
    page.wait_for_timeout(600)
    hrefs = page.eval_on_selector_all('[data-buy]', "e=>e.map(x=>x.getAttribute('href'))")
    check('buy buttons point at the Payment Link',
          hrefs == ['https://buy.stripe.com/test_abc123'] * len(hrefs) and len(hrefs) > 0, hrefs)
    check('no demo panel once it is really for sale',
          page.eval_on_selector_all('.buy__demo', 'e=>e.length') == 0)
    check('price renders as euros',
          '27,00' in page.eval_on_selector('[data-price]', 'e=>e.textContent'))
    page.close()

    # 2 - Delivery ---------------------------------------------------------
    page = ctx.new_page()
    configured(page, SOLD + "window.DELIVERY={mode:'download',url:'https://files.example/werkboek.pdf'};")
    page.goto(BASE + 'bevestiging.html?session_id=cs_test_a1b2c3')
    page.wait_for_timeout(600)
    check('download button appears in download mode',
          page.eval_on_selector('[data-download] a', "e=>e.getAttribute('href')") == 'https://files.example/werkboek.pdf')
    check('order reference shows the Stripe session id',
          page.eval_on_selector('[data-order-ref]', 'e=>e.textContent') == 'cs_test_a1b2c3')
    page.close()

    page = ctx.new_page()
    configured(page, SOLD)
    page.goto(BASE + 'bevestiging.html?session_id=cs_test_x')
    page.wait_for_timeout(600)
    check('email mode points at the inbox instead',
          'mailbox' in page.eval_on_selector('[data-download]', 'e=>e.textContent'))
    page.close()

    # A context of its own: a cached config.js from the checks above would
    # switch demo mode off for the wrong reason.
    demo_ctx = browser.new_context(viewport={'width': 1280, 'height': 900})
    page = demo_ctx.new_page()
    page.goto(BASE + 'bevestiging.html')
    page.wait_for_timeout(600)
    slots = page.eval_on_selector_all('[data-download]', 'e=>e.length')
    check('demo panel fills every delivery slot',
          page.eval_on_selector_all('[data-download] .buy__demo', 'e=>e.length') == slots)
    check('demo confirmation says nothing was paid',
          'Er is niets betaald' in page.eval_on_selector('[data-download]', 'e=>e.textContent'))
    page.close()
    demo_ctx.close()

    # 3 - Contact form -----------------------------------------------------
    page = ctx.new_page()
    configured(page, "window.ENDPOINTS.contact='/mock/contact';")
    page.goto(BASE + 'contact.html')
    page.wait_for_timeout(600)
    check('no "not connected" notice once configured',
          page.eval_on_selector('[data-contact-notice]', 'e=>e.hidden') is True)
    page.fill('#naam', 'Testpersoon')
    page.fill('#email', 'test@voorbeeld.be')
    page.fill('#bericht', 'Werkt dit formulier?')
    page.click('button[type=submit]')
    page.wait_for_timeout(700)
    sent = [r for r in received if r[0] == '/mock/contact']
    check('contact posts form-encoded fields',
          bool(sent) and 'bericht=Werkt+dit+formulier' in sent[0][2], sent[:1])
    check('contact shows the sent panel',
          page.eval_on_selector('[data-contact-sent]', 'e=>e.hidden') is False)
    page.close()

    page = ctx.new_page()
    configured(page, "window.ENDPOINTS.contact='/mock/fail';")
    page.goto(BASE + 'contact.html')
    page.wait_for_timeout(600)
    page.fill('#naam', 'Testpersoon')
    page.fill('#email', 'test@voorbeeld.be')
    page.fill('#bericht', 'Hallo')
    page.click('button[type=submit]')
    page.wait_for_timeout(700)
    check("the provider's own error reaches the visitor",
          page.eval_on_selector('.form__error', 'e=>e.textContent') == 'Dat adres staat al op de lijst.')
    page.close()

    # 4 - Newsletter, direct ------------------------------------------------
    page = ctx.new_page()
    configured(page, "window.ENDPOINTS.newsletter='/mock/news';")
    page.goto(BASE + 'index.html')
    page.wait_for_timeout(600)
    page.fill('#news-email', 'lijst@voorbeeld.be')
    page.click('.news__form button[type=submit]')
    page.wait_for_timeout(700)
    news = [r for r in received if r[0] == '/mock/news']
    check('newsletter posts the address',
          bool(news) and 'email=lijst%40voorbeeld.be' in news[0][2], news[:1])
    check('thank-you mentions the confirmation mail',
          'bevestigingsmail' in page.eval_on_selector('[data-newsletter-done]', 'e=>e.textContent'))
    page.close()

    # 5 - Newsletter, hidden-iframe (Brevo / Mailchimp) ---------------------
    page = ctx.new_page()
    configured(page, "window.ENDPOINTS.newsletter='/mock/brevo';"
                     "window.NEWSLETTER={mode:'form',emailField:'EMAIL',"
                     "hiddenFields:{locale:'nl',b_123_456:''}};")
    page.goto(BASE + 'index.html')
    page.wait_for_timeout(600)
    page.fill('#news-email', 'iframe@voorbeeld.be')
    page.click('.news__form button[type=submit]')
    page.wait_for_timeout(1000)
    brevo = [r for r in received if r[0] == '/mock/brevo']
    check('form mode reaches the provider through the hidden iframe',
          bool(brevo) and 'EMAIL=iframe%40voorbeeld.be' in brevo[0][2] and 'locale=nl' in brevo[0][2],
          brevo[:1])
    check('form mode still thanks the visitor',
          page.eval_on_selector('[data-newsletter-done]', 'e=>e.hidden') is False)
    page.close()

    # 6 - Nothing throws, anywhere -----------------------------------------
    for name in ['index.html', 'product.html', 'mocktails.html', 'contact.html',
                 'bevestiging.html', 'algemene-voorwaarden.html', 'privacybeleid.html',
                 'cookiebeleid.html', 'styleguide.html']:
        page = ctx.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        page.goto(BASE + name)
        page.wait_for_timeout(600)
        check('%s loads without errors' % name, not errors, errors)
        page.close()

    browser.close()

server.shutdown()
passed = sum(1 for ok, _ in results if ok)
print('\n%d/%d checks passed' % (passed, len(results)))
sys.exit(0 if passed == len(results) else 1)

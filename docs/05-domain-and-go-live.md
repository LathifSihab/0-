# 5 · The domain, and the moment of going live

**Why this is yours:** buying a domain needs a card, and DNS changes need
access to the registrar account.

**Time:** 30 minutes, plus up to 24 hours of waiting for DNS.

## Where things stand right now

The site is live at **https://0-project.netlify.app**, and every page currently
declares that as its canonical URL.

It also carries `X-Robots-Tag: noindex, nofollow` on every response, set in the
`_headers` file at the root. That is on purpose: a preview URL that Google
indexes will compete with your real domain later, and cleaning that up is
worse than preventing it.

Before this was set up, the pages pointed their canonical tags at
`www.0procentexperiment.be`, which does not resolve at all. Google would have
found a live site pointing at a dead address, and the social previews used an
image URL that 404s. That is fixed, but it is also temporary — the Netlify URL
is not where this site should end up.

## Steps

### a. Buy the domain

`0procentexperiment.be` if it is still free — a `.be` runs about €10–15 a year
at a Belgian registrar (Combell, Openprovider, Gandi). Check it first:
[dnsbelgium.be](https://www.dnsbelgium.be/en/whois).

- [ ] Domain bought
- [ ] Decide `www.` or bare — the site currently assumes `www.`

### b. Point Netlify at it

1. Netlify → your site → **Domain management** → **Add a domain**
2. Enter the domain and follow their DNS instructions — either change the
   nameservers at your registrar to Netlify's, or add the records they give you
3. Wait for DNS to propagate. Netlify issues the HTTPS certificate by itself
   once it resolves

- [ ] `https://your-domain/` serves the site
- [ ] `http://` redirects to `https://`
- [ ] The bare domain and the `www.` one both work, one redirecting to the other

### c. Point the site back at itself

Every canonical tag, `og:url` and `og:image`, plus `sitemap.xml`, `robots.txt`
and `SITE.url` in `js/config.js`, currently say `0-project.netlify.app`. They
all have to become the real domain. It is a find-and-replace across ten files —
tell me the domain and I will do it in one pass.

- [ ] `grep -rn "0-project.netlify.app" *.html *.xml *.txt js/` comes back empty

### d. Update the Stripe redirect

The Payment Link's confirmation redirect still points at the Netlify URL. In
the Stripe dashboard, edit the link and change it to:

```
https://your-domain/bevestiging.html?session_id={CHECKOUT_SESSION_ID}
```

- [ ] Done for the **live** payment link, not just the test one

### e. Let the search engines in

This is the actual switch. In `_headers` at the site root, delete the
`X-Robots-Tag` line:

```
/*
  X-Robots-Tag: noindex, nofollow      ← delete this line
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

Deploy, then confirm it is gone:

```bash
curl -sI https://your-domain/ | grep -i x-robots
```

Nothing should come back.

- [ ] `noindex` header removed and deployed
- [ ] `https://your-domain/robots.txt` names the right sitemap
- [ ] Sitemap submitted in [Google Search Console](https://search.google.com/search-console)

### f. Keep the Netlify URL out of the index

Once the real domain is live, the `.netlify.app` address still answers. Either
leave it alone (the canonicals now point elsewhere, which is usually enough) or
redirect it to the real domain in Netlify's domain settings.

- [ ] Decided which

## The order that matters

Do **e** last. Everything else can be wrong and fixed quietly; letting Google
in before the canonicals are right is the one step that leaves a mess behind.

## Worth checking once live

- [ ] Paste the homepage URL into a Slack or WhatsApp message — the preview
      card should show the logo, not a broken image
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) on the homepage
- [ ] The 404 page: visit `https://your-domain/nonsense` and confirm you get
      the branded one, not Netlify's default with their advertisement on it

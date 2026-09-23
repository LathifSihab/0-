# 0% Experiment — static site

Plain HTML, CSS and JavaScript. No build step, no `npm install`, no framework.
Open a file, edit it, refresh the browser.

## Running it

Any static file server works. From this folder:

```bash
python -m http.server 8080      # then open http://localhost:8080
```

or

```bash
npx serve .
```

You can also double-click `index.html` — everything uses relative paths, so it
works straight off the disk. The only thing that will not work that way is a
form POST, which needs a real origin.

## Deploying it

Upload the folder. There is no build step, so any static host will do.

It currently lives on Netlify at **https://0-project.netlify.app**, in preview
mode:

- `_headers` sends `X-Robots-Tag: noindex, nofollow` on every response, so the
  preview URL stays out of Google while the pages name a domain that is not
  live yet. **Delete that line when the real domain goes up** — see
  [docs/05-domain-and-go-live.md](docs/05-domain-and-go-live.md).
- `_redirects` returns a 404 for `/tools/*`. Those files ship with the folder
  but are scaffolding, not site.
- `404.html` is Netlify's error page for anything unknown.

## What is where

```
index.html                  Home
product.html                Het experiment (the sales page)
mocktails.html              30 recipes + advertiser slots
contact.html                Contact form
bevestiging.html            Post-purchase confirmation (noindex)
styleguide.html             Design system reference (noindex)
algemene-voorwaarden.html   \
privacybeleid.html           |  Legal
cookiebeleid.html           /

assets/css/
  main.css        Entry point. Every page links this.
  fonts.css       Self-hosted Sora + Inter
  tokens.css      Design tokens — colour, type, space. Start here.
  base.css        Element defaults
  utilities.css   .t-* .o-* .c-* .u-* classes
  components.css  Header, footer, cards, accordion, banner…
  motion.css      Page-entrance animation (.u-enter) — CSS only
  page-*.css      Styles used by exactly one page

assets/js/
  config.js       ⚙️ Everything you are likely to change. Start here.
  shared.js       Header, footer, cookie banner, accordion, buy buttons
  mocktails.js    Recipe data + grid rendering + filters
  contact.js      Contact form
  bevestiging.js  Confirmation page

docs/
  README.md            The steps only you can do — index and running order
  01-stripe.md           02-delivery.md        |
  03-contact-form.md    |  One file per open item: what to click,
  04-newsletter.md      |  what it produces, how to check it
  05-domain-and-go-live.md
  06-legal-and-content.md

_headers  _redirects  404.html   Netlify: noindex, /tools/* off, error page

tools/
  go-live.ps1          Windows: runs the wizard under Git Bash. Start here.
  go-live.sh           The wizard itself — a walkthrough of everything below
  set-config.mjs       Writes one value into assets/js/config.js (used by go-live.sh)
  check-integration.py Drives the real pages against fake providers

fonts/  assets/img/brand/  favicon.png  apple-touch-icon.png  robots.txt  sitemap.xml
```

`tools/` is for you, not for the server — there is no need to upload it.

The header and footer are not copy-pasted into all nine pages. They are built
once in `assets/js/shared.js` and injected into the `<div data-site-header>` and
`<div data-site-footer>` placeholders. Change a nav link there and it changes
everywhere.

## Before you go live

**The steps only you can do — accounts, dashboards, the domain, the legal
review — are written up one per file in [`docs/`](docs/README.md).** Start
there; it says what to click and what each step produces.

Everything below is in **`assets/js/config.js`**, with a comment explaining each one.

**The short way — run the wizard:**

```powershell
# Windows, PowerShell
.	ools\go-live.ps1
```

```bash
# macOS, Linux, or a Git Bash window
bash tools/go-live.sh
```

On Windows, typing `bash` in PowerShell reaches the WSL stub in WindowsApps
rather than Git Bash, and on a machine without a working WSL distro that fails
with `getpwuid(0) failed 2`, which tells you nothing. `go-live.ps1` finds the
Git Bash that came with Git for Windows and hands the script to that.

Six stages: the price, the Stripe Payment Link, how the workbook reaches the
buyer, the contact form, the newsletter, and switching demo mode off. It opens
each dashboard for you, tells you exactly what to click, checks what you paste
and writes it into `assets/js/config.js` itself. Ctrl-C any time — it remembers your
answers in `tools/launch-answers.env` and picks up where you left off.

The rest of this section is the same ground at walking pace, for when you want
to know why a step exists or you would rather edit the config by hand.

Afterwards, or any time you change a value:

```bash
python tools/check-integration.py
```

That serves the site locally, points the forms at a mock provider and drives
every page in a headless browser — 25 checks covering the buy buttons, both
delivery modes, both newsletter modes, the contact form and its error path.
It never touches your real `assets/js/config.js`. It needs Playwright once:
`pip install playwright && playwright install chromium`.

### 1. Sell the workbook — `PRODUCT.paymentLink`

This site has no server, which means it cannot create Stripe checkout sessions
itself: that needs a secret key, and anything in these files is readable by
anyone who views source. So Stripe hosts the checkout instead.

1. Stripe dashboard → **Product catalogue** → your product → **Create payment link**
2. Switch on **Stripe Tax** so EU VAT is charged correctly, and enable invoices
   under **Invoicing** if you want buyers to get one automatically
3. Under **After the payment** → **Confirmation page**, choose *Redirect
   customers to your website* and paste:
   `https://www.0procentexperiment.be/bevestiging.html?session_id={CHECKOUT_SESSION_ID}`
   Stripe swaps in the real session id, and the confirmation page shows it as
   the order reference.
4. Paste the `https://buy.stripe.com/…` URL into `PRODUCT.paymentLink`

Also set `priceCents` and flip `priceConfirmed` to `true`. Until both a price
and a link exist, nothing can be sold — so a €0,00 sale cannot happen by
accident. What the buy buttons show in the meantime depends on `DEMO`:

| `DEMO.enabled` | Buy button | Price tag |
| --- | --- | --- |
| `true` (default) | walks to `DEMO.target`, under a marked **Demo** panel | “Prijs volgt” |
| `false` | disabled, with a red note naming the config key to fill in | “Prijs nog te bepalen” + the key to set |

Demo mode is for showing the site to someone; switch it off while building, so
the page keeps telling you what is still missing. The developer hint is logged
to the console either way. Both texts live in `DEMO` in `assets/js/config.js`.

Stripe handles the card, EU VAT, the receipt and the invoice.

### 2. Get the workbook to the buyer — `DELIVERY`

**Stripe does not deliver files.** There is no setting that attaches a PDF to a
product and mails it after payment; Stripe sends the receipt and the invoice,
and fulfilment is yours. An earlier version of this README said otherwise — it
was wrong, and worth catching before launch day rather than after it.

On a static site there are three honest options:

| | How | `DELIVERY.mode` | Gated? |
| --- | --- | --- | --- |
| **A. Fulfilment partner** *(recommended)* | A Stripe app or Zapier zap listens for `checkout.session.completed` and mails a unique, expiring link to the address that paid | `email` | Yes |
| **B. Unguessable URL** | PDF on a private bucket (R2, Bunny, S3) under a long random path; the confirmation page shows a download button | `download` + `url` | No — anyone given the URL can download it |
| **C. By hand** | Stripe notifies you per sale; you mail the file yourself | `email` | Yes, but it does not scale past the first week |

Option B is a decision, not an accident: a static page cannot check who paid,
because the check would run in the browser where anyone can skip it. For a
low-price workbook that may well be a fair trade — just make it knowingly.

The confirmation page adapts to whichever you pick, and in demo mode it says
plainly that nothing was paid instead of promising a mail that is not coming.

### 3. The forms — `ENDPOINTS` and `NEWSLETTER`

A static site cannot send mail, so both forms POST to a service instead.

**Contact** — Formspree, Basin and Formspark all accept exactly what the form
sends (ordinary form-encoded fields, `Accept: application/json`) and all have a
free tier. Paste the endpoint into `ENDPOINTS.contact`, point the service at
your own inbox, and turn its spam filter on; the form already carries a
honeypot field. If the service rejects a submission, its own message is what
the visitor sees.

**Newsletter** — providers come in two camps, and `NEWSLETTER.mode` picks the
one you are dealing with:

| Mode | For | How it behaves |
| --- | --- | --- |
| `json` | Formspree, Basin, Kit (ConvertKit) | Normal cross-origin POST; the page can report a real error back to the visitor |
| `form` | Brevo (`sibforms.com`), Mailchimp (`list-manage.com`) | These refuse cross-origin fetches, so the page posts into a hidden iframe. It cannot read the answer, so it thanks the visitor as soon as the browser has sent it |

Set `emailField` to whatever the provider calls the field — `email` for
Formspree and Basin, `email_address` for Kit, `EMAIL` for Brevo and Mailchimp —
and copy any extra hidden inputs from the provider's embed code into
`hiddenFields` (Mailchimp's anti-bot `b_xxx_yyy`, Brevo's `locale`). A CORS
error in the browser console means that provider belongs in `form` mode.

**Turn on double opt-in at the provider.** Belgium is in the EU, and the
confirmation mail is what makes the consent provable. The thank-you text on the
site already tells people to go and open that mail.

Until an endpoint is set, each form shows a clearly-marked notice with a mailto
fallback rather than silently swallowing messages.

### 4. The details

- `SITE.company` — legal name, address, VAT number. These appear in the legal
  pages. They are `TODO —` placeholders right now.
- `SITE.email` — the mailbox still has to be created.
- `SITE.url` — the production domain. Also update it in `sitemap.xml`, the
  `<link rel="canonical">` and `og:url` tags in each page's `<head>`, and
  `robots.txt`.
- Legal text — all three pages are working drafts and say so on the page. Have
  a lawyer read them.
- `DELIVERY` — decide between the three options in §2 before launch day. The
  default (`email`) assumes something or someone actually sends that mail.

### 5. The recipes

`assets/js/mocktails.js` holds the thirty recipes as a plain array — five per
smaakprofiel, matching the six filter buttons on the page. Photography lives in
`mocktails/<slug>.jpg` (4:3, 1000×750); each record points at its own file.

The photos are public domain (CC0/PDM), sourced through Openverse, so they
carry no attribution obligation. `assets/img/mocktails/credits.json` records the origin,
creator and licence of every image — keep it in step if you swap one out. A
card still falls back to a branded tile if `image` is empty, so a missing file
degrades quietly rather than breaking the grid.

## Notes

**Fonts are self-hosted**, in `assets/fonts/`. That is deliberate: the privacy policy
promises we only share data with parties needed to run the site, and loading
Google Fonts would hand every visitor's IP address to Google. Only the latin
and latin-ext subsets are bundled — enough for Dutch.

**The cookie banner** stores the choice in `localStorage` under
`0pct-cookie-consent` and does nothing else. If you add analytics, hook it to
`choice === 'all'` — there is a TODO marking the spot in `assets/js/shared.js`.

**JavaScript is required** for the header, footer, cookie banner, the recipe
grid and the buy buttons. Everything else — all the copy, the headings, the
FAQ answers, the legal text, the links inside the content — is real HTML, so
it reads fine without JS and search engines see it. The FAQ answers are visible
rather than collapsed when JS is off, which is the right fallback.

**Adding a page**: copy the closest existing page, change the `<head>`, keep
the `data-site-header` / `data-site-footer` placeholders, and add a `<url>` to
`sitemap.xml`. If it needs its own styles, make a `assets/css/page-<name>.css` and
link it after `main.css`.

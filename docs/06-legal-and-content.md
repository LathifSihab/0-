# 6 · Legal details and real content

**Why this is yours:** company details are facts about your business, a legal
review needs a lawyer, and the recipes are the product.

## a. Company details — ten minutes, and they are public right now

`js/config.js` still says:

```js
company: {
	name: 'TODO — juridische naam',
	address: 'TODO — adres',
	vat: 'TODO — BTW-nummer'
}
```

Those three strings are printed on the live terms, privacy and cookie pages, so
anyone reading them today sees `TODO — juridische naam`. Belgian law wants a
seller's legal name, registered address and VAT number visible on the site, so
this is both embarrassing and required.

- [ ] `SITE.company.name` — the legal entity, as registered
- [ ] `SITE.company.address` — the registered address
- [ ] `SITE.company.vat` — `BE 0123.456.789`
- [ ] `SITE.email` — `info@0procentexperiment.be` has to be a mailbox that
      exists, and that you read. It is on the contact page, in the footer, in
      the legal pages, and it is the fallback whenever a form is down.

## b. The legal pages — before you take a single euro

All three are working drafts, and each says so in a yellow box on the page. The
box goes away when you delete it; the risk does not.

A lawyer should read them, but there are specifics worth raising yourself,
because a generic template will not cover them:

- **The right of withdrawal.** EU consumers normally get 14 days to change
  their mind. Digital content delivered immediately is an exception — but only
  if the buyer explicitly agreed to immediate delivery and acknowledged losing
  the withdrawal right. That consent has to be captured at checkout. Ask
  whether your Stripe setup does that, and what needs adding if not.
- **Who processes what.** The privacy policy has to name Stripe (payments), the
  form service (contact messages) and the newsletter provider by name, say what
  each stores and for how long, and explain how someone gets their data
  deleted. Fill these in after [03](03-contact-form.md) and
  [04-newsletter.md](04-newsletter.md), when you know who you picked.
- **The health disclaimer.** The site already carries one, in `DISCLAIMER` in
  `js/config.js` and in the footer of every page: this is education and
  reflection, not medical advice, and anyone dependent on alcohol should see a
  doctor. Have the lawyer confirm the wording is strong enough for a product
  about drinking, because withdrawal can genuinely be dangerous.
- **Cookies.** The banner currently sets one key in `localStorage` and loads no
  trackers at all. If you add analytics later, the cookie policy and the banner
  both have to change — and the banner has to actually gate the script, which
  today it does not, because there is nothing to gate.

- [ ] Lawyer has read all three pages
- [ ] The `legal__todo` boxes are deleted from the HTML
- [ ] `Laatst bijgewerkt: TODO — datum` replaced with a real date on each page

## c. The mocktails — 30 recepten

`js/mocktails.js` holds thirty real, workable recipes, five per smaakprofiel,
each with its own photo in `mocktails/`.

The photography is public domain (CC0/PDM) via Openverse, so nothing needs an
attribution line on the page; `mocktails/credits.json` keeps the provenance
per image. Two things are still worth a human pass:

- [ ] Someone actually makes a handful of them and checks the quantities
- [ ] The photo on each card matches the drink it sits above closely enough —
      they are stock, not a shoot, so a few are suggestive rather than exact

## d. The workbook itself

The PDF is not in this repo. Wherever it ends up living, that choice is
[02-delivery.md](02-delivery.md).

- [ ] The final PDF exists, proofread, with the right price and dates in it
- [ ] It opens on a phone — most buyers will try that first

## e. Copy check before launch

- [ ] Read every page out loud once. The brand voice is short sentences and
      real questions; the placeholder copy mostly is, but the seams show.
- [ ] `PRODUCT.footnote` says "Nieuwsgierigheid inbegrepen." — still true at
      the price you picked?
- [ ] The confirmation page promises how the workbook arrives. Make sure it
      matches what you actually set up in [02](02-delivery.md).

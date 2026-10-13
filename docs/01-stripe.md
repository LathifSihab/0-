# 1 · Stripe: the payment link

**Why this is yours:** it needs a Stripe account tied to your business, your
bank details and your VAT registration. Nobody can create it on your behalf.

**Time:** about an hour the first time, most of it identity verification.

## What you need before you start

- A Stripe account with the business details filled in and a bank account
  attached ([dashboard.stripe.com](https://dashboard.stripe.com))
- Your VAT number, and your decision on the price including VAT
- The final domain, if you have it — see [05-domain-and-go-live.md](05-domain-and-go-live.md)

## Why a payment link and not a checkout button

This site has no server. Creating a Stripe Checkout session needs a secret key,
and a secret key in these files is readable by anyone who opens View Source. A
Payment Link moves the whole checkout onto Stripe's own pages, which is the
right answer for a static site: they take the card, apply VAT, send the receipt
and the invoice, and hand the customer back to you afterwards.

## Steps

### a. Turn on Stripe Tax

Belgian digital products carry 21% VAT, and the rate changes with where the
buyer lives. Stripe works it out if you let it.

1. Go to **Settings → Tax** ([dashboard.stripe.com/settings/tax](https://dashboard.stripe.com/settings/tax))
2. Set your origin address
3. Register Belgium, and any other country where you expect to owe VAT

### b. Build the link in TEST mode

Keep the test-mode toggle on. Test and live links are separate objects — the
one you make now will not work for real money, which is exactly what you want
while you are still checking things.

1. Go to [dashboard.stripe.com/test/payment-links/create](https://dashboard.stripe.com/test/payment-links/create)
2. Add the product: name it, set the price you decided, **one-time payment**
3. Open the **After the payment** section
4. Under **Confirmation page**, choose to redirect customers to your website
5. Paste this as the redirect URL, including the part in braces:

   ```
   https://0-project.netlify.app/bevestiging.html?session_id={CHECKOUT_SESSION_ID}
   ```

   Swap the domain once you have the real one. Stripe replaces
   `{CHECKOUT_SESSION_ID}` with the real session id, and the confirmation page
   shows it as an order reference a buyer can quote in an email.

6. Still on the same form, set up the invoice and the consent (below)
7. Create the link and copy the `https://buy.stripe.com/…` URL

#### Invoice, business buyers and the right of withdrawal

The mock checkout (`mock-checkout.html`, local only) shows what these produce:
its confirmation page renders a preview of the invoice with every field below.

- **Post-payment invoice:** under *After the payment*, tick **Create an
  invoice PDF**. Stripe then mails a numbered invoice (unbroken sequence, which
  Belgian VAT law requires) next to the receipt. Stripe charges a small fee per
  invoice for this; check the current rate on its pricing page.
- **Business buyers:** tick **Allow business customers to provide tax IDs** and
  **Collect customers' addresses → billing**. A Belgian company buying the
  workbook is owed an invoice with its VAT number on it.
- **Seller details on the invoice:** Settings → Business → Public details, and
  Settings → Invoice template. Legal name, address and VAT number go there
  (the same values as `SITE.company` in `assets/js/config.js`).
- **Consent to immediate delivery:** tick **Require customers to accept your
  terms of service** and use custom text along the lines of *"Ik vraag om het
  werkboek meteen te leveren en weet dat ik daardoor mijn herroepingsrecht
  verlies."* Without that explicit consent the buyer keeps 14 days to withdraw,
  even after downloading (WER art. VI.53, 13°). Also put the same sentence in
  the invoice template's footer, because the law wants that confirmation on a
  durable medium, and the mailed invoice is one.

**Test mode does not email anything.** Receipts and invoices only go out
automatically in live mode. In test mode you find them on the payment in the
dashboard (Payments → the payment → Receipt / Invoice).

### c. Put it in the site

Run the wizard (stages 1 and 2) or edit `js/config.js` by hand:

```js
window.PRODUCT = {
	priceCents: 2700,          // your price, in cents
	priceConfirmed: true,      // both are needed before anything can be sold
	paymentLink: 'https://buy.stripe.com/…'
};
```

Until both a price and a link exist, every buy button stays in demo mode. That
is deliberate: a €0,00 sale cannot happen by accident.

### d. Buy your own workbook

Card `4242 4242 4242 4242`, any future expiry, any CVC. Then check:

- [ ] You land back on `bevestiging.html` with an order reference visible
- [ ] The payment shows up in the Stripe dashboard
- [ ] The receipt arrives in your inbox
- [ ] The workbook reaches you — see [02-delivery.md](02-delivery.md)

### e. Redo it in live mode

Switch the test toggle off, repeat step b in live mode, and replace
`paymentLink` with the live URL. **This is the step people forget.** A test
link on a live site takes fake money and delivers nothing.

- [ ] `paymentLink` is a live link, not `buy.stripe.com/test_…`

## What it produces

| Value | Goes to |
| --- | --- |
| Price in cents | `PRODUCT.priceCents` + `PRODUCT.priceConfirmed` |
| `https://buy.stripe.com/…` | `PRODUCT.paymentLink` |

## What Stripe does not do

It does not deliver the workbook. See [02-delivery.md](02-delivery.md) — that
one has a decision in it that is genuinely yours.

# 2 · Getting the workbook to the buyer

**Why this is yours:** it is a trade-off between effort and control, and only
you can say which side you want to be on. There is no technically correct
answer here, just consequences.

**Time:** 20 minutes for option B, an hour or two for option A.

## Read this first

**Stripe does not deliver files.** There is no setting that attaches a PDF to a
product and emails it after payment. Stripe sends the receipt and the invoice;
handing over the workbook is yours to arrange. An earlier version of this
project's notes said otherwise — it was wrong, and it is the kind of wrong you
would only discover on your first real sale.

The deeper problem is that a static site cannot check who paid. Any check would
run in the visitor's browser, where anyone can skip it. So the file is either
gated by something outside this site, or it is not really gated at all.

## The three options

### A. A fulfilment partner — gated, recommended

Something watches Stripe for a completed payment and emails a unique, expiring
download link to the address that paid.

- **Zapier** — trigger *New Payment* or *Checkout Session Completed* in Stripe,
  action *Send Outbound Email* with the link. Free tier covers a slow start.
- **SendOwl**, **Lemon Squeezy** and similar — purpose-built for digital goods,
  a monthly fee, less wiring.

Then set `DELIVERY.mode: 'email'` and the confirmation page tells buyers to
check their inbox.

- [ ] Build it, send yourself a test, confirm the mail arrives
- [ ] Check the link expires (or at least that it is unique per buyer)

### B. An unguessable URL — not gated, but honest about it

Put the PDF on a private bucket under a long random path, and let the
confirmation page show a download button.

- Cloudflare R2, Bunny, or S3. Not `/static` on this site, which is guessable.
- Use something like `/x7k2p9f4/0procent-werkboek.pdf` — a name nobody types
  by accident.

Then `DELIVERY.mode: 'download'` and `DELIVERY.url: 'https://…'`.

**What you are accepting:** anyone who is given that URL can download the
workbook without paying. One buyer can share it in a WhatsApp group. For a
low-price workbook that may be a perfectly fair trade — plenty of people sell
this way — but it should be a decision you made, not a thing that happened.

- [ ] The path is random enough that guessing it is hopeless
- [ ] You are at peace with it being shareable

### C. By hand — gated, and fine for a week

Stripe emails you on every sale; you reply with the file attached.

`DELIVERY.mode: 'email'`, no automation behind it. Honest, personal, and it
stops being charming somewhere around the fifteenth sale. Good for a launch
week while you build option A.

- [ ] Turn on Stripe's payment notification emails so you actually notice

## What it produces

| Value | Goes to |
| --- | --- |
| `email` or `download` | `DELIVERY.mode` |
| The file URL (option B only) | `DELIVERY.url` |

The confirmation page adapts: a download button in `download` mode, a "check
your inbox" line in `email` mode, and in demo mode it says plainly that nothing
was paid rather than promising a mail that is not coming.

## Before you rely on it

- [ ] Buy your own workbook with Stripe's test card and receive it the way a
      real buyer would
- [ ] Try the download link in a private window, signed out of everything
- [ ] If you chose A, check what happens on a refund — do you revoke the link?

# What only you can do

Everything in this folder needs a human with an account, a card, a domain or a
legal opinion. No amount of code gets past these — they are accounts in other
people's systems, and decisions that are yours to make.

Each file says what you need, what to click, what value comes out, and where
that value goes. Most of them end in a line you paste into `js/config.js` — or
better, let the wizard do it:

```powershell
.\tools\go-live.ps1        # Windows
```

```bash
bash tools/go-live.sh      # macOS, Linux, Git Bash
```

## Where things stand

The site is live at **https://0-project.netlify.app** in demo mode: every buy
button walks to the confirmation page under a marked "Demo" panel, and both
forms say they are not connected yet. Nothing can take money or lose a message.

| # | Open item | Blocks launch? | Doc |
| --- | --- | --- | --- |
| 1 | Stripe Payment Link + price | Yes | [01-stripe.md](01-stripe.md) |
| 2 | How the workbook reaches the buyer | Yes | [02-delivery.md](02-delivery.md) |
| 3 | Contact form: wired to Netlify Forms, switch on form detection + email notification | Yes | [03-contact-form.md](03-contact-form.md) |
| 4 | Newsletter provider + double opt-in | No, but it collects addresses | [04-newsletter.md](04-newsletter.md) |
| 5 | The real domain, and switching off `noindex` | Yes | [05-domain-and-go-live.md](05-domain-and-go-live.md) |
| 6 | Company details, legal review, recipes, photos | Yes (legal), no (content) | [06-legal-and-content.md](06-legal-and-content.md) |
| 7 | info@ mailbox (domain + Microsoft 365), client-facing guide for Petra | Yes (contact address) | [07-email-for-petra.md](07-email-for-petra.md) |

## The order I would do them in

1. **05 first, partly** — buy the domain and point Netlify at it. Stripe's
   redirect URL and every canonical tag depend on knowing the final address,
   and redoing them later is annoying.
2. **06's company details** — they take ten minutes and the legal pages
   currently show `TODO — juridische naam` to the public.
3. **01 and 02 together** — a payment link is useless until you know how the
   file gets delivered. Do both in Stripe test mode, buy your own workbook
   with a test card, and check that it arrives.
4. **03 and 04** — forms are quick and independent of the rest.
5. **05 the rest** — canonical tags to the real domain, `noindex` off, sitemap
   resubmitted. This is the actual moment of going live.
6. **06's content** — recipes and photography can land after launch.

## After each step

```bash
python tools/check-integration.py
```

37 checks against the real pages, driven in a headless browser with fake
providers standing in for Stripe and the form services. It never touches your
config. It cannot test their end — only a real test purchase does that.

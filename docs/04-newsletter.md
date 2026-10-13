# 4 · The newsletter

**Why this is yours:** it needs an account with a mailing-list provider, and
the GDPR obligations that come with a list of Belgian email addresses are
yours, not the site's.

**Time:** 30 minutes, plus writing the confirmation email.

## Do this before you collect a single address

**Turn on double opt-in.** Every provider has the setting; it is usually one
checkbox in the list or form settings.

Someone types their address, the provider emails them a confirmation link, and
only a click puts them on the list. That click is what makes the consent
provable if anyone ever asks — and it means a typo'd or malicious signup never
becomes your problem. The thank-you text on the site already tells people to go
and open that mail, so if you skip this, the site is lying to them.

- [ ] Double opt-in is on
- [ ] The confirmation email says who you are and what they will get
- [ ] Every campaign has a working unsubscribe link

## Pick a provider

Providers split into two camps, and the choice changes how the page talks to
them. The site supports both; you only have to say which.

| Provider | Mode | What that means |
| --- | --- | --- |
| [Kit](https://kit.com) (ex-ConvertKit) | `json` | The page can show a real error back to the visitor |
| [Formspree](https://formspree.io) / Basin | `json` | Same, but it is a form service, not a mailing list |
| [Brevo](https://brevo.com) | `form` | EU-hosted; the page cannot read the answer |
| [Mailchimp](https://mailchimp.com) | `form` | The page cannot read the answer |

"Cannot read the answer" means the provider refuses cross-origin requests from
a browser, so the page posts into a hidden iframe and thanks the visitor as
soon as the browser has sent it. If the address bounces off their validation,
the visitor is not told. Their confirmation mail is what closes the loop.

Brevo is worth a look for a Belgian audience: EU-hosted, GDPR-shaped, free up
to a few hundred contacts.

## Steps

1. Create the account and the list
2. Turn on double opt-in
3. Build a signup form and open its **HTML embed** code
4. Out of that embed, copy two things:
   - the form's `action` URL — this is the endpoint
   - any hidden `<input>` fields, e.g. Mailchimp's anti-bot `b_xxxxx_yyyyy`
     or Brevo's `locale`. Leave them out and the provider may drop signups.

The wizard (stage 5) asks which provider you picked and fills in the rest.
By hand it looks like this:

```js
window.ENDPOINTS = {
	newsletter: 'https://sibforms.com/serve/…'   // the form's action URL
};

window.NEWSLETTER = {
	mode: 'form',            // 'json' for Kit, Formspree, Basin
	emailField: 'EMAIL',     // 'email_address' for Kit, 'email' for Formspree
	hiddenFields: { locale: 'nl' }
};
```

## What it produces

| Value | Goes to |
| --- | --- |
| The form's action URL | `ENDPOINTS.newsletter` |
| `json` or `form` | `NEWSLETTER.mode` |
| The provider's name for the email field | `NEWSLETTER.emailField` |
| Hidden inputs from the embed | `NEWSLETTER.hiddenFields` |

## Check it works

- [ ] Sign up with a real address of your own
- [ ] The confirmation mail arrives; clicking it adds you to the list
- [ ] The contact shows up in the provider's dashboard as confirmed
- [ ] Sign up again with the same address — it should not create a duplicate
- [ ] If you chose `json` mode, open the browser console during a signup: a
      CORS error there means that provider belongs in `form` mode instead

## Also worth knowing

The privacy policy has to name this provider — where the addresses are stored,
for how long, and how someone gets deleted. That is in
[06-legal-and-content.md](06-legal-and-content.md), and it is not optional once
real addresses start arriving.

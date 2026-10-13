# 3 · The contact form

**Status (2026-10-13):** the code is wired to **Netlify Forms**. Two switches
in the Netlify dashboard are left, and they are yours because they sit in the
account.

**Time:** 10 minutes, plus one deploy.

## How it works

A static page cannot send email, so Netlify does it. At deploy time Netlify
reads `contact.html`, finds the form named `contact` (it carries
`data-netlify="true"`), and from then on accepts posts for it. Every message
is stored under **Forms → contact** in the dashboard and e-mailed to whichever
address you put in the notification below. That is the "straight to her
inbox" part: no extra account, no third party besides the host the site
already runs on.

- The page posts in the background and shows "Bericht verstuurd", so the
  visitor never leaves the site. Without JavaScript the form still posts and
  Netlify shows its own thank-you page.
- Spam: Netlify runs every submission through Akismet, and the form carries a
  honeypot field (`website`) that Netlify drops.
- Subject line in the inbox: `0% Experiment · <onderwerp>`, so a message from
  an advertiser ("Samenwerking of adverteren") stands out.
- If Netlify refuses a post, the visitor sees the reason plus the info@
  address, so nobody gets stuck.
- The privacy policy already names Netlify as the processor for these
  messages (updated 2026-10-13).

## 1. Switch on form detection

Netlify only looks for forms when this is on, and it is off by default on
newer sites.

1. Netlify → the 0procentexperiment site → **Site configuration → Forms**
2. **Enable form detection**
3. Deploy the site again (the deploy after switching it on is the one that
   registers the form)
4. Check: **Forms** in the site menu now lists a form called **contact**

- [ ] Form detection on, site redeployed, `contact` form listed

## 2. Send each message to her inbox

1. **Site configuration → Notifications → Emails and webhooks**
2. Under **Form submission notifications**: **Add notification → Email
   notification**
3. Event: *New form submission* · Email to notify: **info@0procentexperiment.com**
   (or any address she prefers) · Form: **contact**
4. Save

Netlify sets the visitor's address as *Reply-To*, so she can answer with the
reply button. Check that on the first test.

- [ ] Notification set to her address

## Check it works

- [ ] Send a test message through https://0procentexperiment.com/contact.html
- [ ] "Bericht verstuurd" appears on the page
- [ ] It shows up under **Forms → contact** in Netlify
- [ ] The mail arrives in her inbox, with the subject `0% Experiment · …`
- [ ] Reply goes to the visitor's address, not to Netlify
- [ ] Check the spam folder too: the first mails from a new sender sometimes
      land there. Mark it as "not spam" once
- [ ] The ad banners on the mocktail page open the form with "Samenwerking of
      adverteren" already picked

## Limits

Netlify's plans include a monthly allowance of form submissions; a contact form
for one product stays well inside it. Submissions over the limit are not lost
silently, but check the plan page if the site ever gets busy.

## If the site leaves Netlify

Formspree, Basin and Formspark accept exactly the post this form sends. Create
a form there, point it at her inbox, and put its endpoint in
`ENDPOINTS.contact` in `assets/js/config.js` instead of `'/'`.

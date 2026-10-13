# 7 · Setting up info@0procentexperiment.be

*For Petra. As of 28 September 2026.*

At the end of this guide you have a working **info@0procentexperiment.be**
mailbox in Outlook, on a domain registered in your own company's name. Plan for
about an hour, most of it waiting for the domain and DNS to go through.

The order: check the domain is free → buy it → take a Microsoft 365 business
subscription → connect the two → create the mailbox. The same domain will later
carry the website too, so keep the registrar login safe.

**Have ready before you start:**

- Your company details: legal name, address, VAT (btw) number
- A payment card for the registrar and Microsoft
- Your phone, for the verification codes
- An existing personal email address, used as the recovery address

---

## Step 1 · Check the domain is still free (2 minutes)

On 28 September 2026, `0procentexperiment.be` had no DNS records at all, which
usually means nobody has registered it. Confirm it yourself before paying:
`.be` names go first come, first served.

1. Go to [dnsbelgium.be](https://www.dnsbelgium.be/en) (the official .be
   registry) and search **0procentexperiment.be**.
2. **Available:** go to Step 2.
3. **Taken:** check whether you or someone helping you already bought it. If
   so, find the registrar's login (search your mailbox for "0procentexperiment"
   or "DNS Belgium") and skip to Step 3. If a stranger owns it, stop and tell
   us: the website and email address then need a different name.

## Step 2 · Buy the domain (15 minutes)

**Recommendation: OVHcloud.** It sells .be for under €10 a year, renewals
included, and Microsoft publishes a step-by-step guide for connecting OVH
domains to Microsoft 365. Namecheap is fine for .com names, but I could not
confirm it sells .be, and Cloudflare does not.

| Registrar | First year | Renewal per year | Note |
| --- | --- | --- | --- |
| [OVHcloud](https://www.ovhcloud.com/en-ie/domains/tld/be/) | €6.99 excl. VAT | €7.89 excl. VAT | Recommended; Microsoft guide exists |
| [Combell](https://www.combell.com/en/domain-names/be-domain-name) | €9.99 | €46.99 | Belgian, Dutch-speaking support, expensive renewal |

1. Create an OVHcloud account **in the company's name**, with the company's VAT
   number. Whoever is on the account legally owns the domain.
2. Search **0procentexperiment.be** and add it to the basket.
3. Skip every add-on: no hosting, no email package, no website builder.
   Microsoft provides the email and Netlify hosts the website.
4. Pay, then confirm the email DNS Belgium or OVH sends you. The domain is not
   active until you click that link.
5. Turn on **automatic renewal** and **two-factor login** in the account
   settings. A lapsed domain takes the email address down with it.

## Step 3 · Sign up for Microsoft 365 for business (15 minutes)

**Pick Business Basic** unless you want the classic Outlook desktop program.
Basic gives Outlook in the browser and the Outlook phone app; Business Standard
adds the desktop Office apps. One mailbox is enough, so you pay for one user.

| Plan | List price (from 1 July 2026) | Outlook |
| --- | --- | --- |
| Business Basic | $7 per user per month | Browser and phone app |
| Business Standard | $14 per user per month | Browser, phone app and desktop program |

The euro price (excl. VAT) is shown at checkout.

1. Go to [Microsoft 365 for business](https://www.microsoft.com/nl-be/microsoft-365/business)
   and choose the plan. Take the free trial if one is offered.
2. Sign up with your personal email as contact address and your mobile number
   for the code.
3. Enter the company details as they appear in the KBO/BCE register.
4. Microsoft asks for a name like **something.onmicrosoft.com**. Choose it
   carefully, e.g. `0procentexperiment.onmicrosoft.com`: it is permanent and
   shows up on some sign-in screens.
5. When the wizard asks about a domain, choose **I already own a domain** and
   enter `0procentexperiment.be`. That starts Step 4.

## Step 4 · Connect the domain to Microsoft 365 (15 minutes + waiting)

Microsoft shows a few DNS records to copy into OVHcloud. They prove you own the
domain and tell the internet to deliver info@ mail to Microsoft. Keep two tabs
open side by side: the Microsoft 365 admin center and OVHcloud.

1. In the [Microsoft 365 admin center](https://admin.microsoft.com), go to
   **Settings → Domains → Add domain** (the wizard may already have you there)
   and enter **0procentexperiment.be**.
2. Microsoft shows a **TXT record** starting with `MS=ms`. In OVHcloud, open
   your domain → **DNS zone** tab → **Add an entry** → **TXT**, leave the
   sub-domain empty, paste the value, **Next → Confirm**. Back in Microsoft,
   click **Verify**. If it fails, wait 15 minutes and try again.
3. Choose **Exchange and Exchange Online Protection**, and tick **DKIM** under
   *Advanced options*. Add each record Microsoft lists in the same OVHcloud DNS
   zone (table below).
4. Delete any MX record OVHcloud created by default, so mail only goes to
   Microsoft.
5. Click **Continue** in Microsoft. When it says **Domain setup is complete**,
   you are done.

| Type | Name (sub-domain) | Value | What it does |
| --- | --- | --- | --- |
| TXT | *(empty)* | `MS=ms…` (copy from Microsoft) | Proves you own the domain |
| MX | *(empty)* | copy from Microsoft, priority 0 | Delivers info@ mail to Microsoft |
| CNAME | `autodiscover` | `autodiscover.outlook.com.` | Lets Outlook set itself up |
| TXT | *(empty)* | `v=spf1 include:spf.protection.outlook.com -all` | Keeps your mail out of spam |
| CNAME | `selector1._domainkey`, `selector2._domainkey` | copy from Microsoft | DKIM signature, also against spam |

**Two OVHcloud catches:**

- End every MX and CNAME target with a **full stop**, e.g.
  `autodiscover.outlook.com.` Without it OVH glues your domain name onto the end
  and the record breaks.
- If the zone already holds an SPF record (`v=spf1 include:mx.ovh.com…`),
  **replace** its value instead of adding a second one. A domain may have only
  one SPF record.

Only copy the MX and DKIM values from your own Microsoft screen; they are unique
to your account. Microsoft's walkthrough with screenshots:
[Connect your DNS records at OVH to Microsoft 365](https://learn.microsoft.com/en-us/microsoft-365/admin/dns/create-dns-records-at-ovh).

The website's records come later and live in the same DNS zone. We add those
when the site moves to the domain; they do not interfere with email.

## Step 5 · Create info@ and open it in Outlook (10 minutes)

Simplest for a one-person business: your own Microsoft 365 account *becomes*
info@0procentexperiment.be, on the one licence you already pay for.

1. Admin center → **Users → Active users** → click your own name.
2. **Manage username and email** → change the username to **info** and pick
   **@0procentexperiment.be**. Save.
3. Sign out and back in as **info@0procentexperiment.be** (same password).

Then open the mailbox wherever you read mail:

- **Browser:** [outlook.office.com](https://outlook.office.com)
- **Phone:** the Outlook app, sign in with info@0procentexperiment.be
- **Computer (Business Standard):** Outlook → **Add account** →
  info@0procentexperiment.be. The autodiscover record fills in the rest.

**Before you tell anyone the address:**

- [ ] Send a mail from info@ to a Gmail or Hotmail address: it lands in the inbox, not spam
- [ ] Reply back to info@: it arrives within a minute
- [ ] Send us a short "it works" from info@, so we can connect the website's contact form

---

## Open items we still need from you

The website is built and the checkout works in test mode. It cannot sell until
we have these two things.

### 1. Company information

Goes on the terms and privacy pages, on every invoice, and in the Stripe and
Microsoft accounts. The site currently shows "TODO" in its place.

- [ ] Legal name of the company, exactly as registered in the KBO/BCE
- [ ] Registered address
- [ ] Company number and VAT (btw) number, e.g. BE0123.456.789
- [ ] Is the company VAT-registered? This decides whether the 21% VAT we show is right

### 2. Payment method

To take real payments you need an account with a payment provider, in the
company's name. We recommend **Stripe**: the site is already built for it, it
supports Bancontact, and it emails the receipt and invoice. Setup takes about an
hour, mostly identity checks.

- [ ] Choose: **Stripe** (lower fees, your accountant files the VAT) or a
      reseller like **Lemon Squeezy** / **Payhip** (higher fees, they handle EU
      VAT and deliver the file)
- [ ] The price of the workbook, including VAT
- [ ] Create the account at [stripe.com](https://stripe.com) with the company
      details above and the company bank account (IBAN)
- [ ] Invite us to the Stripe account as a developer, so we can build and test
      the payment link. Never send us passwords or card details.
- [ ] How buyers get the workbook: a download link emailed automatically
      (recommended), a download button on the confirmation page, or you
      emailing it yourself for the first sales

---

## Sources

- [OVHcloud: .be domain prices](https://www.ovhcloud.com/en-ie/domains/tld/be/)
- [Combell: .be domain prices](https://www.combell.com/en/domain-names/be-domain-name)
- [Cloudflare Registrar: supported TLDs](https://www.cloudflare.com/tld-policies/) (no .be)
- [Universal.cloud: Microsoft 365 price change July 2026](https://universal.cloud/en/blog/article/microsoft-365-prijsverhoging-juli-2026/)
- [Microsoft Learn: Connect your DNS records at OVH to Microsoft 365](https://learn.microsoft.com/en-us/microsoft-365/admin/dns/create-dns-records-at-ovh)
- [Microsoft Learn: Connect your domain by adding DNS records](https://learn.microsoft.com/en-us/microsoft-365/admin/get-help-with-domains/create-dns-records-at-any-dns-hosting-provider)

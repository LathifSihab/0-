/**
 * 0% EXPERIMENT — site configuration
 * One place for everything that is likely to change before launch.
 *
 * Plain <script>, no modules, no build step: this file defines one global,
 * `SITE`, that every other script and page reads from.
 */
window.SITE = {
	name: '0% Experiment',
	tagline: 'Nieuwsgierig naar jezelf.',
	/** TODO: confirm the production domain before launch. */
	url: 'https://www.0procentexperiment.be',
	locale: 'nl-BE',
	/** TODO: mailbox still has to be created — see content document §5. */
	email: 'info@0procentexperiment.be',
	/** TODO: fill in the legal entity details for the legal pages + invoices. */
	company: {
		name: 'TODO — juridische naam',
		address: 'TODO — adres',
		vat: 'TODO — BTW-nummer'
	},
	social: {
		instagram: '',
		facebook: ''
	}
};

/**
 * The single digital product this shop sells.
 *
 * ⚠️ PRICE IS A PLACEHOLDER — not yet decided.
 * Set `priceCents` and flip `priceConfirmed` to true before going live.
 * The price block renders a visible "prijs nog te bepalen" state while this
 * is false, so a fake price can never ship by accident.
 *
 * ⚠️ `paymentLink` IS EMPTY — nothing can be sold yet.
 * This static site has no server, so it cannot talk to the Stripe API (that
 * needs a secret key, which would be readable by anyone who views source).
 * Instead, create a Payment Link in the Stripe dashboard:
 *
 *   Stripe dashboard → Product catalogue → your product → Create payment link
 *
 * Paste the resulting https://buy.stripe.com/… URL below and every buy button
 * on the site starts working. Stripe hosts the checkout, charges the card,
 * handles EU VAT (switch on Stripe Tax) and sends the receipt and invoice.
 *
 * Then, under **After the payment** → **Confirmation page**, choose
 * "Redirect customers to your website" and paste:
 *
 *   https://www.0procentexperiment.be/bevestiging.html?session_id={CHECKOUT_SESSION_ID}
 *
 * Stripe swaps {CHECKOUT_SESSION_ID} for the real id, and bevestiging.html
 * shows it as the order reference. See DELIVERY below for the one thing
 * Stripe does NOT do: hand over the workbook file.
 */
window.PRODUCT = {
	id: 'werkboek-30-dagen',
	name: '0% Experiment — Digitaal Werkboek',
	subtitle: '30 dagen nieuwsgierig naar jezelf',
	priceCents: 0,
	priceConfirmed: false,
	currency: 'eur',
	/** Stripe Payment Link (https://buy.stripe.com/...). Empty = not for sale. */
	paymentLink: '',
	features: [
		'Digitaal werkboek',
		'30 dagen begeleid experiment',
		'Direct digitaal beschikbaar na aankoop'
	],
	footnote: 'Nieuwsgierigheid inbegrepen.'
};

/**
 * Demo mode — what the buy buttons do while there is no Payment Link.
 *
 * With no `paymentLink` set, the buy buttons have nothing to point at. The
 * default behaviour is a blunt red warning aimed at whoever is building the
 * site ("zet paymentLink in js/config.js") — useful while working, wrong when
 * you are showing the site to someone.
 *
 * With `enabled: true` the buttons get a demo panel instead: a marked
 * placeholder that explains, in the brand's own voice, that the checkout is
 * not open yet. Nothing is charged and nothing is sent.
 *
 * Flip `enabled` to false to get the developer warning back. Either way, as
 * soon as `paymentLink` and the price are filled in, this whole block is
 * ignored and the buttons go to Stripe.
 */
window.DEMO = {
	enabled: true,

	/**
	 * Where the demo button walks to, so the flow can be shown end to end.
	 * Leave empty to keep the button inert — then drop the second half of
	 * `note` as well, because it will no longer be true.
	 */
	target: 'bevestiging.html',

	note: 'Dit is een demoversie van de site. De kassa is nog niet open — deze knop loopt gewoon door naar de bevestigingspagina, er wordt niets betaald en niets verstuurd.',

	/** Stands in for the price tag. Keep it wordy: never show a fake number. */
	price: 'Prijs volgt',
	priceNote: 'Nog niet vastgelegd — dit is een demoversie.'
};

/**
 * Form endpoints.
 *
 * Both forms need somewhere to POST to, because a static site cannot send
 * mail by itself.
 *
 * CONTACT — any form service that accepts JSON and allows cross-origin
 * requests from the browser. All three below do, on their free tier:
 *   · Formspree  — https://formspree.io   (endpoint: https://formspree.io/f/xxxxxxx)
 *   · Basin      — https://usebasin.com   (endpoint: https://usebasin.com/f/xxxxxxx)
 *   · Formspark  — https://formspark.io   (endpoint: https://submit-form.com/xxxxxxx)
 * Point the service at your own inbox and turn its spam filter on; the form
 * already ships a honeypot field of its own.
 *
 * NEWSLETTER — see the NEWSLETTER block below, because mailing-list providers
 * are split into two camps and the one you pick decides how this has to work.
 *
 * Leave a value empty and that form shows a clearly-marked "not configured
 * yet" notice with a mailto fallback, instead of silently swallowing the
 * message the way a dead endpoint would.
 */
window.ENDPOINTS = {
	contact: '',
	newsletter: ''
};

/**
 * How the newsletter form talks to your mailing-list provider.
 *
 * Providers fall into two camps, and a static page has to treat them
 * differently:
 *
 *   mode: 'json'  The provider accepts a cross-origin POST from the browser
 *                 and answers with JSON, so the page can tell you whether it
 *                 worked. Formspree, Basin and Kit (ConvertKit) do this.
 *                 Kit: https://app.kit.com/forms/<form-id>/subscriptions with
 *                 emailField 'email_address'. If the browser console shows a
 *                 CORS error, that provider belongs in 'form' mode instead.
 *
 *   mode: 'form'  The provider only accepts a normal HTML form submission and
 *                 blocks cross-origin fetches. Brevo (sibforms.com) and
 *                 Mailchimp (list-manage.com) work this way. The page then
 *                 posts into a hidden iframe and says thank you without being
 *                 able to confirm — an accepted trade-off, but it does mean a
 *                 typo'd address fails silently on their side, not ours.
 *
 * `emailField` is what the provider calls the e-mail field — 'email' for
 * Formspree and Basin, 'email_address' for Kit, 'EMAIL' for Brevo and
 * Mailchimp. `hiddenFields` is for the extras those embeds carry, such as
 * Mailchimp's anti-bot `b_xxx_yyy` field or Brevo's `locale`. Copy both
 * straight out of the embed code the provider hands you.
 *
 * ⚠️ GDPR: turn on double opt-in at the provider. Belgium is in the EU, the
 * confirmation mail is what makes the consent provable, and every provider
 * above supports it with a checkbox in their settings.
 */
window.NEWSLETTER = {
	mode: 'json',
	emailField: 'email',
	hiddenFields: {}
};

/**
 * How the buyer actually gets the workbook.
 *
 * ⚠️ Read this before launch. Stripe does NOT deliver files. There is no
 * setting in the dashboard that attaches a PDF to a product and emails it
 * after payment — Stripe sends the receipt and the invoice, and that is all.
 * Fulfilment is left to you, and on a static site you have three honest
 * options:
 *
 *   1. A fulfilment partner (recommended). Zapier, SendOwl or a similar
 *      Stripe app listens for `checkout.session.completed` and emails a
 *      unique, expiring download link to the address that paid. This is the
 *      only option where the file stays properly behind the payment, and it
 *      needs no server of yours. Then use mode: 'email' below.
 *
 *   2. An unguessable URL. Put the PDF on a private bucket (Cloudflare R2,
 *      Bunny, S3) under a long random path and show it here after checkout.
 *      Anyone who is given that URL can download the workbook without paying:
 *      a static page cannot check who paid. For a low-price workbook that may
 *      be a fair trade — make it a decision, not an accident. Use mode:
 *      'download' and paste the URL.
 *
 *   3. Send it by hand. mode: 'email', no automation: you get a Stripe
 *      notification per sale and mail the file yourself. Fine for the first
 *      week, painful by the second.
 *
 * mode: 'email'     — the confirmation page points buyers at their inbox.
 * mode: 'download'  — the confirmation page shows a download button.
 */
window.DELIVERY = {
	mode: 'email',
	url: ''
};

window.DISCLAIMER =
	'Het 0% Experiment is bedoeld voor educatie, informatie en persoonlijke reflectie en vervangt geen medisch, psychologisch of therapeutisch advies. Wie afhankelijk is van alcohol, ontwenningsverschijnselen ervaart of medische begeleiding nodig heeft bij het stoppen met alcohol, neemt contact op met een arts of gespecialiseerde hulpverlener.';

/** Format a price in cents as a Belgian-Dutch currency string. */
window.formatPrice = function formatPrice(cents, currency) {
	return new Intl.NumberFormat('nl-BE', {
		style: 'currency',
		currency: (currency || 'eur').toUpperCase()
	}).format(cents / 100);
};

/**
 * Confirmation page.
 *
 * What changed versus the old server version, and why it had to:
 *
 * The SvelteKit version took the `session_id` Stripe put in the return URL,
 * called the Stripe API server-side to check the payment had actually gone
 * through, and only then handed over the workbook. A static site cannot do
 * that — the check would have to run in the browser, where anyone can skip
 * it, and it would need a Stripe secret key that anyone could read.
 *
 * So this page cannot gate anything. It reports what DELIVERY in assets/js/config.js
 * says was arranged, and shows the Stripe session id as an order reference so
 * a buyer has something concrete to quote in a mail. Read the DELIVERY block
 * before launch: Stripe does not deliver files by itself.
 */
(function () {
	'use strict';

	function init() {
		var slots = document.querySelectorAll('[data-download]');
		var params = new URLSearchParams(window.location.search);
		// Stripe fills this in when the Payment Link's confirmation page is set to
		// .../bevestiging.html?session_id={CHECKOUT_SESSION_ID}. Its presence says
		// someone came back from checkout — not that they paid. Only a server can
		// tell you that, so it is used as a reference number and nothing more.
		var sessionId = params.get('session_id');

		Array.prototype.forEach.call(slots, function (slot) {
			slot.innerHTML = deliveryMarkup(slot.dataset.download || 'Download mijn werkboek');
		});

		var ref = document.querySelector('[data-order-ref]');

		if (sessionId && ref) {
			ref.textContent = sessionId;
			ref.closest('[data-order-ref-wrap]').hidden = false;
		}

		if (window.isMockCheckout()) renderMockInvoice(sessionId);
	}

	/**
	 * Preview of the invoice Stripe mails after a real purchase, built from
	 * what the mock checkout handed over. It carries the fields a Belgian
	 * invoice needs (KB nr. 1, art. 5), so it doubles as a checklist of what
	 * the Stripe invoice template must contain. Seller details come from
	 * SITE.company, so unfilled TODOs show up here, where they are obvious.
	 */
	function renderMockInvoice(sessionId) {
		var mount = document.querySelector('[data-invoice]');
		var order;
		try {
			order = JSON.parse(sessionStorage.getItem('0pct-mock-order'));
		} catch (e) {}
		if (!mount || !order || order.sessionId !== sessionId) return;

		var company = window.SITE.company;
		var currency = window.PRODUCT.currency;
		var net = Math.round(order.cents / 1.21);
		var money = function (cents) {
			return esc(window.formatPrice(cents, currency));
		};
		var date = new Date(order.date).toLocaleDateString('nl-BE', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});

		var buyer = [order.company, order.name, order.address, order.vat && 'Btw: ' + order.vat, order.email]
			.filter(Boolean)
			.map(esc)
			.join('<br />');

		mount.innerHTML =
			'<article class="invoice-doc" aria-label="Factuur (test)">' +
			'<p class="invoice-doc__stamp">Test · geen geldige factuur</p>' +
			'<header class="invoice-doc__head">' +
			'<div><p class="invoice-doc__title">Factuur</p>' +
			'<p>Nr. <strong>' + esc(order.invoiceNumber) + '</strong><br />' +
			'Datum: ' + esc(date) + '<br />Leverdatum: ' + esc(date) + '</p></div>' +
			'<div class="invoice-doc__parties">' +
			'<div><p class="invoice-doc__label">Verkoper</p><p>' +
			esc(company.name) + '<br />' + esc(company.address) + '<br />Btw: ' + esc(company.vat) +
			'</p></div>' +
			'<div><p class="invoice-doc__label">Klant</p><p>' + buyer + '</p></div>' +
			'</div></header>' +
			'<table class="invoice-doc__lines"><thead><tr>' +
			'<th>Omschrijving</th><th>Aantal</th><th>Btw</th><th>Bedrag excl. btw</th>' +
			'</tr></thead><tbody><tr>' +
			'<td>' + esc(window.PRODUCT.name) + '</td><td>1</td><td>21%</td><td>' + money(net) + '</td>' +
			'</tr></tbody></table>' +
			'<dl class="invoice-doc__totals">' +
			'<div><dt>Subtotaal excl. btw</dt><dd>' + money(net) + '</dd></div>' +
			'<div><dt>Btw 21%</dt><dd>' + money(order.cents - net) + '</dd></div>' +
			'<div class="invoice-doc__grand"><dt>Totaal betaald</dt><dd>' + money(order.cents) + '</dd></div>' +
			'</dl>' +
			'<p class="invoice-doc__foot">Betaald op ' + esc(date) + ' met ' + esc(order.method) + '. ' +
			'Referentie: ' + esc(order.sessionId) + '.<br />' +
			'Digitale inhoud geleverd op uitdrukkelijk verzoek van de klant, met erkenning dat het ' +
			'herroepingsrecht daardoor vervalt (WER art. VI.53, 13°).</p>' +
			'<button class="c-btn" type="button" data-invoice-print>Opslaan als pdf / afdrukken</button>' +
			'</article>';

		mount.hidden = false;
		mount.querySelector('[data-invoice-print]').addEventListener('click', function () {
			window.print();
		});
	}

	function esc(value) {
		return String(value)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}

	/** What the buyer sees where the download button goes. */
	function deliveryMarkup(label) {
		var delivery = window.DELIVERY || {};
		var demo = window.DEMO && window.DEMO.enabled && !window.PRODUCT.paymentLink;

		// Mock checkout: deliver the way MOCK says, marked so nobody mistakes
		// the sample file for the real workbook.
		if (window.isMockCheckout()) {
			delivery = { mode: window.MOCK.deliveryMode, url: window.MOCK.downloadUrl };
			demo = false;
			return (
				deliveryFor(delivery, label) +
				'<div class="buy__demo" role="note">' +
				'<p class="buy__demo-tag">Test</p>' +
				'<p class="buy__demo-text">Testaankoop via de testkassa. Het bestand is een ' +
				'voorbeeld, niet het echte werkboek.</p>' +
				'</div>'
			);
		}

		// Nothing was actually bought, so promising a mail would be a lie.
		if (demo) {
			return (
				'<div class="buy__demo" role="note">' +
				'<p class="buy__demo-tag">Demo</p>' +
				'<p class="buy__demo-text">Er is niets betaald, dit is de demoversie. ' +
				'Na een echte aankoop staat hier de downloadknop, of de melding dat het ' +
				'werkboek onderweg is naar je mailbox.</p>' +
				'</div>'
			);
		}

		return deliveryFor(delivery, label);
	}

	/** The download button or the inbox line, for a given DELIVERY shape. */
	function deliveryFor(delivery, label) {
		if (delivery.mode === 'download' && delivery.url) {
			return (
				'<a class="c-btn c-btn--primary c-btn--lg" href="' +
				delivery.url.replace(/"/g, '&quot;') +
				'" download>' +
				label +
				'</a>'
			);
		}

		// mode 'email', or 'download' with no URL filled in yet: point at the
		// inbox. Whoever set DELIVERY is the one who made that true.
		return '<p class="download__pending">Je werkboek is onderweg naar je mailbox.</p>';
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();

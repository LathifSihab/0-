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
	}

	/** What the buyer sees where the download button goes. */
	function deliveryMarkup(label) {
		var delivery = window.DELIVERY || {};
		var demo = window.DEMO && window.DEMO.enabled && !window.PRODUCT.paymentLink;

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

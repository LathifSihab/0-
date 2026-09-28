/**
 * Mock checkout (mock-checkout.html).
 *
 * Behaves like a Stripe Payment Link in test mode, closely enough to test
 * everything on this side of the wire: Stripe's test card numbers give the
 * same outcomes, and a successful payment returns to
 * bevestiging.html?session_id=cs_test_mock_… exactly as the real redirect will.
 *
 * Nothing is sent anywhere. The form never leaves the page.
 */
(function () {
	'use strict';

	/** Stripe's test cards and what they do. Anything else is "invalid". */
	var CARDS = {
		'4242424242424242': null,
		'4000000000000002': 'Je kaart is geweigerd. (testkaart: card_declined)',
		'4000000000009995': 'Onvoldoende saldo op je kaart. (testkaart: insufficient_funds)'
	};

	function init() {
		var form = document.querySelector('[data-mock-form]');

		if (!window.isMockCheckout()) {
			document.querySelector('[data-mock-blocked]').hidden = false;
			form.hidden = true;
			return;
		}

		var cents = window.MOCK.priceCents;
		var net = Math.round(cents / 1.21);
		var fmt = function (value) {
			return window.formatPrice(value, window.PRODUCT.currency);
		};

		fill('name', window.PRODUCT.name);
		fill('total', fmt(cents));
		fill('total-line', fmt(cents));
		fill('net', fmt(net));
		fill('vat', fmt(cents - net));

		var submit = document.querySelector('[data-mock-submit]');
		submit.textContent = 'Betaal ' + fmt(cents);

		var card = document.querySelector('[data-mock-card]');
		var bancontact = document.querySelector('[data-mock-bancontact]');
		var error = document.querySelector('[data-mock-error]');

		Array.prototype.forEach.call(form.querySelectorAll('[name="method"]'), function (radio) {
			radio.addEventListener('change', function () {
				card.hidden = form.method.value !== 'card';
				error.hidden = true;
			});
		});

		var business = document.querySelector('[data-mock-business]');
		document.querySelector('[data-mock-business-toggle]').addEventListener('change', function (event) {
			business.hidden = !event.target.checked;
		});

		Array.prototype.forEach.call(form.querySelectorAll('[data-card]'), function (button) {
			button.addEventListener('click', function () {
				form.card.value = button.dataset.card;
				error.hidden = true;
			});
		});

		form.addEventListener('submit', function (event) {
			event.preventDefault();
			error.hidden = true;

			if (!form.email.checkValidity() || !form.email.value) {
				return fail(error, 'Vul een geldig e-mailadres in.');
			}
			if (!form.naam.value.trim()) return fail(error, 'Vul je naam in.');
			if (form.business.checked && !/^[A-Z]{2}[0-9A-Z]{8,12}$/.test(form.btw.value.replace(/[\s.]/g, '').toUpperCase())) {
				return fail(error, 'Dit btw-nummer ziet er niet geldig uit (bv. BE0123456789).');
			}
			if (!form.consent.checked) {
				return fail(error, 'Bevestig de voorwaarden en de directe levering om verder te gaan.');
			}

			if (form.method.value === 'bancontact') {
				form.hidden = true;
				bancontact.hidden = false;
				return;
			}

			var number = form.card.value.replace(/\D/g, '');
			if (!(number in CARDS)) {
				return fail(error, 'Gebruik een van de testkaarten hieronder.');
			}
			if (CARDS[number]) return fail(error, CARDS[number]);

			pay(submit, order(form, cents, 'Visa •••• ' + number.slice(-4)));
		});

		Array.prototype.forEach.call(bancontact.querySelectorAll('[data-bancontact]'), function (button) {
			button.addEventListener('click', function () {
				if (button.dataset.bancontact === 'ok') return pay(button, order(form, cents, 'Bancontact'));
				bancontact.hidden = true;
				form.hidden = false;
				fail(error, 'Bancontact-betaling geweigerd. Probeer opnieuw of kies een andere methode.');
			});
		});
	}

	function fill(key, value) {
		var node = document.querySelector('[data-mock="' + key + '"]');
		if (node) node.textContent = value;
	}

	function fail(node, message) {
		node.textContent = message;
		node.hidden = false;
	}

	/** What Stripe would know after checkout, i.e. what goes on its invoice. */
	function order(form, cents, method) {
		var biz = form.business.checked;
		return {
			email: form.email.value,
			name: form.naam.value.trim(),
			company: biz ? form.bedrijf.value.trim() : '',
			vat: biz ? form.btw.value.replace(/[\s.]/g, '').toUpperCase() : '',
			address: biz ? form.adres.value.trim() : '',
			method: method,
			cents: cents,
			consent: true,
			date: new Date().toISOString()
		};
	}

	/**
	 * Invoices need an unbroken number sequence. Stripe keeps that counter for
	 * real; here a per-browser counter stands in, prefixed TEST so it never
	 * looks like a real invoice number.
	 */
	function nextInvoiceNumber() {
		var n = 1;
		try {
			n = (parseInt(localStorage.getItem('0pct-mock-invoice-seq'), 10) || 0) + 1;
			localStorage.setItem('0pct-mock-invoice-seq', String(n));
		} catch (e) {}
		return 'TEST-' + ('000' + n).slice(-4);
	}

	/** A short pause like a real payment, then Stripe's redirect. */
	function pay(button, details) {
		button.disabled = true;
		button.textContent = 'Bezig met betalen…';
		var id = 'cs_test_mock_' + Math.random().toString(36).slice(2, 12);
		details.sessionId = id;
		details.invoiceNumber = nextInvoiceNumber();
		// The real confirmation page cannot look an order up (no server), so
		// the mock hands it over the only way a static page can.
		try {
			sessionStorage.setItem('0pct-mock-order', JSON.stringify(details));
		} catch (e) {}
		window.setTimeout(function () {
			window.location.href = 'bevestiging.html?session_id=' + id;
		}, 900);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();

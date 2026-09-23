/**
 * Contact form.
 *
 * A static site cannot send mail by itself, so the form POSTs to whatever
 * service is configured in `ENDPOINTS.contact` (js/config.js) — Formspree,
 * Basin and Formspark all take exactly this shape. The validation rules below
 * are the same ones the old server action applied.
 *
 * It sends form-encoded fields rather than JSON, because that is what an
 * ordinary HTML form would have sent and every service accepts it; the Accept
 * header is what makes them answer with JSON instead of redirecting to their
 * own thank-you page. The shared helpers live in js/shared.js (window.FORMS).
 *
 * Note that client-side validation is a convenience, not a guarantee — anyone
 * can POST to the endpoint directly. Every form service worth using does its
 * own validation and spam filtering on their side; the honeypot below is an
 * extra, cheap first line.
 */
(function () {
	'use strict';

	function init() {
		var form = document.querySelector('[data-contact]');
		if (!form) return;

		var sent = document.querySelector('[data-contact-sent]');
		var error = form.querySelector('.form__error');
		var button = form.querySelector('button[type="submit"]');
		var notice = form.querySelector('[data-contact-notice]');

		// No endpoint configured: say so plainly rather than pretending to send.
		if (!window.ENDPOINTS.contact && notice) {
			notice.hidden = false;
		}

		form.addEventListener('submit', function (event) {
			event.preventDefault();

			var data = new FormData(form);
			var naam = String(data.get('naam') || '').trim();
			var email = String(data.get('email') || '').trim();
			var onderwerp = String(data.get('onderwerp') || '').trim();
			var bericht = String(data.get('bericht') || '').trim();
			var honeypot = String(data.get('website') || '').trim();

			// A bot filled the hidden field. Pretend everything is fine.
			if (honeypot) {
				showSent();
				return;
			}

			if (!naam || !email || !bericht) {
				showError('Vul je naam, e-mailadres en bericht in.');
				return;
			}
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
				showError('Dat e-mailadres ziet er niet geldig uit.');
				return;
			}
			if (bericht.length > 5000) {
				showError('Je bericht is wat aan de lange kant. Kort het even in.');
				return;
			}

			if (!window.ENDPOINTS.contact) {
				showError(
					'Het formulier is nog niet aangesloten. Zet ENDPOINTS.contact in js/config.js, of mail ons rechtstreeks.'
				);
				return;
			}

			setLoading(true);

			var forms = window.FORMS;
			var fields = {
				naam: naam,
				email: email,
				onderwerp: onderwerp,
				bericht: bericht,
				// Form services show this as the subject line in your inbox.
				_subject: '0% Experiment — ' + (onderwerp || 'nieuw bericht')
			};

			fetch(window.ENDPOINTS.contact, {
				method: 'POST',
				headers: {
					'content-type': 'application/x-www-form-urlencoded',
					accept: 'application/json'
				},
				body: forms.encodeFields(fields)
			})
				.then(function (res) {
					if (res.ok) {
						showSent();
						return;
					}
					return forms.readProviderError(res).then(function (message) {
						throw new Error(message);
					});
				})
				.catch(function (e) {
					showError(e.message || 'Er ging iets mis.');
				})
				.finally(function () {
					setLoading(false);
				});
		});

		function showSent() {
			form.hidden = true;
			if (sent) sent.hidden = false;
		}

		function showError(message) {
			if (!error) return;
			error.textContent = message;
			error.hidden = false;
		}

		function setLoading(loading) {
			button.disabled = loading;
			if (loading) {
				if (error) error.hidden = true;
				button.innerHTML = '<span class="spinner" aria-hidden="true"></span>Verstuur mijn bericht';
			} else {
				button.textContent = 'Verstuur mijn bericht';
			}
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();

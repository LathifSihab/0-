/**
 * 0% EXPERIMENT — shared behaviour
 *
 * Injects the header, footer and cookie banner into every page, then wires up
 * the handful of things on this site that actually need JavaScript.
 *
 * The header and footer live here rather than being copy-pasted into nine HTML
 * files, so changing a nav link is a one-line edit. The trade-off: they appear
 * a moment after the rest of the page, and a crawler that does not run JS will
 * not see them. Everything that matters for SEO — headings, copy, links inside
 * the content — is real HTML in the page itself.
 *
 * Plain <script>, no modules, no build step. Load it with `defer`.
 */
(function () {
	'use strict';

	var NAV = [
		{ href: 'product.html', label: 'Het experiment' },
		{ href: 'mocktails.html', label: 'Mocktails' },
		{ href: 'contact.html', label: 'Contact' }
	];

	/** Current page filename, e.g. "product.html". Treats / as index.html. */
	function currentPage() {
		var path = window.location.pathname;
		var file = path.substring(path.lastIndexOf('/') + 1);
		return file === '' ? 'index.html' : file;
	}

	function escapeHtml(value) {
		return String(value)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}

	/* ─── HEADER ──────────────────────────────────────────────────────────
	   The full lockup is stacked and unreadable at nav height, so the header
	   uses the 0%-magnifier mark plus a Sora wordmark. The brandbook allows
	   the mark to stand alone as an icon; the lockup stays for brand moments.
	   ------------------------------------------------------------------- */
	function renderHeader() {
		var mount = document.querySelector('[data-site-header]');
		if (!mount) return;

		var here = currentPage();

		var desktopLinks = NAV.map(function (link) {
			var active = link.href === here;
			return (
				'<a href="' +
				link.href +
				'" class="header__link' +
				(active ? ' is-active' : '') +
				'"' +
				(active ? ' aria-current="page"' : '') +
				'>' +
				escapeHtml(link.label) +
				'</a>'
			);
		}).join('');

		var mobileLinks = NAV.map(function (link) {
			return (
				'<a href="' +
				link.href +
				'" class="header__mobile-link">' +
				escapeHtml(link.label) +
				'</a>'
			);
		}).join('');

		mount.outerHTML =
			'<header class="header">' +
			'<div class="o-container header__inner">' +
			'<a href="index.html" class="header__logo" aria-label="0% Experiment — naar de homepage">' +
			'<img src="assets/img/brand/logo-mark.png" width="45" height="38" style="height: 38px; width: auto;" alt="0% Experiment — nieuwsgierig naar jezelf" decoding="async" />' +
			'<span class="header__wordmark" aria-hidden="true">0% Experiment' +
			'<span class="header__payoff">Nieuwsgierig naar jezelf.</span>' +
			'</span>' +
			'</a>' +
			'<nav class="header__nav" aria-label="Hoofdnavigatie">' +
			desktopLinks +
			'<a href="product.html#start" class="c-btn c-btn--primary header__cta">Start het experiment</a>' +
			'</nav>' +
			'<button class="header__toggle" type="button" aria-expanded="false" aria-controls="mobiel-menu">' +
			'<span class="sr-only">Menu openen</span>' +
			'<span class="header__bars" aria-hidden="true"></span>' +
			'</button>' +
			'</div>' +
			'<div id="mobiel-menu" class="header__mobile" hidden>' +
			'<div class="o-container header__mobile-inner">' +
			mobileLinks +
			'<a href="product.html#start" class="c-btn c-btn--primary c-btn--block">Start het experiment</a>' +
			'</div>' +
			'</div>' +
			'</header>';

		var toggle = document.querySelector('.header__toggle');
		var panel = document.getElementById('mobiel-menu');
		var bars = document.querySelector('.header__bars');
		var srLabel = toggle.querySelector('.sr-only');

		toggle.addEventListener('click', function () {
			var open = panel.hidden;
			panel.hidden = !open;
			toggle.setAttribute('aria-expanded', String(open));
			bars.classList.toggle('is-open', open);
			srLabel.textContent = open ? 'Menu sluiten' : 'Menu openen';
		});
	}

	/* ─── FOOTER ──────────────────────────────────────────────────────── */
	function renderFooter() {
		var mount = document.querySelector('[data-site-footer]');
		if (!mount) return;

		var email = escapeHtml(window.SITE.email);
		var year = new Date().getFullYear();

		mount.outerHTML =
			'<footer class="footer u-surface-ink">' +
			'<div class="o-container footer__inner">' +
			'<div class="footer__brand">' +
			'<img src="assets/img/brand/logo-mark.png" width="85" height="72" style="height: 72px; width: auto;" alt="0% Experiment — nieuwsgierig naar jezelf" loading="lazy" decoding="async" />' +
			'<p class="footer__wordmark u-font-display">0% Experiment</p>' +
			'<p class="footer__tagline"><span class="u-accent">Nieuwsgierig</span> naar jezelf.</p>' +
			'</div>' +
			'<nav class="footer__cols" aria-label="Footernavigatie">' +
			'<div>' +
			'<p class="t-eyebrow footer__heading">Experiment</p>' +
			'<a href="product.html">Het experiment</a>' +
			'<a href="product.html#inhoud">Wat zit erin?</a>' +
			'<a href="product.html#faq">Veelgestelde vragen</a>' +
			'<a href="mocktails.html">Mocktailrecepten</a>' +
			'</div>' +
			'<div>' +
			'<p class="t-eyebrow footer__heading">Contact</p>' +
			'<a href="contact.html">Contactpagina</a>' +
			'<a href="mailto:' +
			email +
			'">' +
			email +
			'</a>' +
			'</div>' +
			'<div>' +
			'<p class="t-eyebrow footer__heading">Juridisch</p>' +
			'<a href="algemene-voorwaarden.html">Algemene voorwaarden</a>' +
			'<a href="privacybeleid.html">Privacybeleid</a>' +
			'<a href="cookiebeleid.html">Cookiebeleid</a>' +
			'<a href="styleguide.html">Designsysteem</a>' +
			'</div>' +
			'</nav>' +
			'</div>' +
			'<div class="o-container">' +
			'<p class="footer__disclaimer">' +
			escapeHtml(window.DISCLAIMER) +
			'</p>' +
			'<p class="footer__legal">© ' +
			year +
			' ' +
			escapeHtml(window.SITE.name) +
			'. Alle rechten voorbehouden.</p>' +
			'</div>' +
			'</footer>';
	}

	/* ─── COOKIE BANNER ───────────────────────────────────────────────── */
	function renderCookieBanner() {
		var KEY = '0pct-cookie-consent';
		var stored = null;

		try {
			stored = localStorage.getItem(KEY);
		} catch (e) {
			// Storage blocked (private window, strict settings). Stay silent.
			return;
		}
		if (stored) return;

		var el = document.createElement('div');
		el.className = 'cookie';
		el.setAttribute('role', 'dialog');
		el.setAttribute('aria-live', 'polite');
		el.setAttribute('aria-label', 'Cookievoorkeuren');
		// `u-surface-ink` is what makes the secondary button legible here. The
		// panel is painted antraciet, and without that class the "Alleen
		// noodzakelijk" button inherits `.c-btn--secondary`'s antraciet text on
		// an antraciet panel — invisible. The original had this bug; the rule
		// that fixes it (`.u-surface-ink .c-btn--secondary`) was already in
		// utilities.css, it just was never switched on.
		el.innerHTML =
			'<div class="cookie__inner u-surface-ink">' +
			'<div>' +
			'<p class="cookie__title">Eén vraag voor we beginnen.</p>' +
			'<p class="cookie__body">We gebruiken noodzakelijke cookies om de site te laten werken. ' +
			'Optionele cookies helpen ons te zien wat werkt — maar alleen als jij dat goed vindt. ' +
			'<a href="cookiebeleid.html">Lees het cookiebeleid</a>.</p>' +
			'</div>' +
			'<div class="cookie__actions">' +
			'<button type="button" class="c-btn c-btn--secondary" data-choice="essential">Alleen noodzakelijk</button>' +
			'<button type="button" class="c-btn c-btn--primary" data-choice="all">Oké voor mij</button>' +
			'</div>' +
			'</div>';

		document.body.appendChild(el);

		el.addEventListener('click', function (event) {
			var button = event.target.closest('[data-choice]');
			if (!button) return;
			try {
				localStorage.setItem(
					KEY,
					JSON.stringify({ choice: button.dataset.choice, at: new Date().toISOString() })
				);
			} catch (e) {
				/* ignore */
			}
			el.remove();
			// TODO: hook your analytics / marketing scripts to choice === 'all'.
		});
	}

	/* ─── SCROLL REVEAL ───────────────────────────────────────────────────
	   Adds `is-visible` once an element with [data-reveal] enters the
	   viewport. Degrades to "always visible" when IntersectionObserver is
	   missing or motion is reduced.
	   ------------------------------------------------------------------- */
	function initReveal() {
		var nodes = document.querySelectorAll('[data-reveal]');
		if (!nodes.length) return;

		var reduced =
			window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (reduced || typeof IntersectionObserver === 'undefined') {
			Array.prototype.forEach.call(nodes, function (node) {
				node.classList.add('is-visible');
			});
			return;
		}

		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
		);

		Array.prototype.forEach.call(nodes, function (node) {
			node.classList.add('u-reveal');
			observer.observe(node);
		});
	}

	/* ─── ACCORDION ───────────────────────────────────────────────────────
	   The questions and answers are real HTML in the page. This only closes
	   the panels and wires up the toggling — so without JavaScript every
	   answer is simply visible, which is the right fallback for an FAQ.
	   ------------------------------------------------------------------- */
	function initAccordion() {
		var accordions = document.querySelectorAll('.acc');

		Array.prototype.forEach.call(accordions, function (acc) {
			var items = acc.querySelectorAll('.acc__item');

			Array.prototype.forEach.call(items, function (item) {
				var trigger = item.querySelector('.acc__trigger');
				var panel = item.querySelector('.acc__panel');
				if (!trigger || !panel) return;

				panel.hidden = true;
				trigger.setAttribute('aria-expanded', 'false');

				trigger.addEventListener('click', function () {
					var willOpen = panel.hidden;

					// One panel at a time, matching the original behaviour.
					Array.prototype.forEach.call(items, function (other) {
						var otherPanel = other.querySelector('.acc__panel');
						var otherTrigger = other.querySelector('.acc__trigger');
						if (!otherPanel || !otherTrigger) return;
						otherPanel.hidden = true;
						otherTrigger.setAttribute('aria-expanded', 'false');
						other.classList.remove('is-open');
					});

					if (willOpen) {
						panel.hidden = false;
						trigger.setAttribute('aria-expanded', 'true');
						item.classList.add('is-open');
					}
				});
			});
		});
	}

	/* ─── BUY BUTTONS ─────────────────────────────────────────────────────
	   Each [data-buy] is an <a> already written into the page. All this does
	   is point it at the Stripe Payment Link — or, when none is configured,
	   fall back to one of two things:

	     DEMO.enabled true   a marked demo panel in the brand's own voice, for
	                         when the site is being shown to someone. The
	                         developer hint moves to the console.
	     DEMO.enabled false  the blunt red warning, for when it is being built.

	   Either way the button never leads to a dead end.
	   ------------------------------------------------------------------- */
	function initBuyButtons() {
		var buttons = document.querySelectorAll('[data-buy]');
		if (!buttons.length) return;

		var link = window.PRODUCT.paymentLink;
		var priced = window.PRODUCT.priceConfirmed && window.PRODUCT.priceCents > 0;

		Array.prototype.forEach.call(buttons, function (button) {
			var wrap = button.closest('.buy');

			if (link && priced) {
				button.setAttribute('href', link);
				return;
			}

			var reason = !link
				? 'De verkoop staat nog niet open. Zet paymentLink in assets/js/config.js zodra je Stripe Payment Link klaar is.'
				: 'De prijs staat nog niet vast. Zet priceCents + priceConfirmed in assets/js/config.js.';

			if (isDemo()) {
				if (window.DEMO.target) {
					button.setAttribute('href', window.DEMO.target);
				} else {
					button.removeAttribute('href');
					button.setAttribute('aria-disabled', 'true');
				}
				if (wrap) wrap.appendChild(demoPanel());
				if (window.console && console.info) console.info('0% demo — ' + reason);
				return;
			}

			button.removeAttribute('href');
			button.setAttribute('aria-disabled', 'true');

			if (!wrap) return;
			var note = document.createElement('p');
			note.className = 'buy__error';
			note.setAttribute('role', 'status');
			note.textContent = reason;
			wrap.appendChild(note);
		});
	}

	/** True when the site is being shown rather than sold from. */
	function isDemo() {
		return Boolean(window.DEMO && window.DEMO.enabled);
	}

	/** The placeholder that stands in for the checkout while it is closed. */
	function demoPanel() {
		var panel = document.createElement('div');
		panel.className = 'buy__demo';
		panel.setAttribute('role', 'note');
		panel.innerHTML =
			'<p class="buy__demo-tag">Demo</p>' +
			'<p class="buy__demo-text">' +
			escapeHtml(window.DEMO.note) +
			'</p>';
		return panel;
	}

	/* ─── PRICE TAG ───────────────────────────────────────────────────── */
	function initPriceTags() {
		var tags = document.querySelectorAll('[data-price]');

		Array.prototype.forEach.call(tags, function (tag) {
			var large = tag.dataset.price === 'lg';
			var priced = window.PRODUCT.priceConfirmed && window.PRODUCT.priceCents > 0;
			// In demo mode the tag says a price is coming — never a number.
			// A placeholder price is the one thing that must not ship.
			var demo = !priced && isDemo();

			tag.className =
				'price' + (large ? ' price--lg' : '') + (priced || demo ? '' : ' price--todo');

			if (priced) {
				tag.innerHTML =
					escapeHtml(window.formatPrice(window.PRODUCT.priceCents, window.PRODUCT.currency)) +
					'<span class="price__note">eenmalig · incl. btw</span>';
			} else if (demo) {
				tag.innerHTML =
					escapeHtml(window.DEMO.price) +
					'<span class="price__note">' +
					escapeHtml(window.DEMO.priceNote) +
					'</span>';
			} else {
				tag.innerHTML =
					'Prijs nog te bepalen' +
					'<span class="price__note">Zet <code>priceCents</code> + <code>priceConfirmed</code> in <code>assets/js/config.js</code></span>';
			}
		});
	}

	/* ─── SITE DATA ───────────────────────────────────────────────────────
	   Fills in values that live in config.js, so the e-mail address and the
	   company details have exactly one home.
	   ------------------------------------------------------------------- */
	function fillSiteData() {
		var nodes = document.querySelectorAll('[data-site]');

		Array.prototype.forEach.call(nodes, function (node) {
			var value;
			switch (node.dataset.site) {
				case 'email':
					value = window.SITE.email;
					if (node.tagName === 'A') node.setAttribute('href', 'mailto:' + value);
					break;
				case 'company-name':
					value = window.SITE.company.name;
					break;
				case 'company-address':
					value = window.SITE.company.address;
					break;
				case 'company-vat':
					value = window.SITE.company.vat;
					break;
				case 'disclaimer':
					value = window.DISCLAIMER;
					break;
				case 'product-subtitle':
					value = window.PRODUCT.subtitle;
					break;
				case 'product-footnote':
					value = window.PRODUCT.footnote;
					break;
				default:
					return;
			}
			node.textContent = value;
		});
	}

	/* ─── NEWSLETTER ─────────────────────────────────────────
	   Sends the address to whatever list provider is configured in
	   ENDPOINTS.newsletter + NEWSLETTER (assets/js/config.js). Two shapes, because
	   providers come in two shapes — see the NEWSLETTER block in the config.
	   ------------------------------------------------------------------- */
	function initNewsletter() {
		var form = document.querySelector('[data-newsletter]');
		if (!form) return;

		var done = document.querySelector('[data-newsletter-done]');
		var error = form.querySelector('.news__error');
		var button = form.querySelector('button[type="submit"]');
		var input = form.querySelector('input[type="email"]');
		var settings = window.NEWSLETTER || {};

		// Double opt-in means the address is not on the list until they click the
		// link in the mail, so the thank-you has to say that out loud.
		var THANKS = 'Genoteerd. Kijk in je mailbox — je inschrijving is pas rond als je de bevestigingsmail opent.';

		form.addEventListener('submit', function (event) {
			event.preventDefault();

			var email = input.value.trim();
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
				showError('Dat e-mailadres ziet er niet geldig uit.');
				return;
			}

			if (!window.ENDPOINTS.newsletter) {
				showError(
					'De nieuwsbrief is nog niet aangesloten. Zet ENDPOINTS.newsletter in assets/js/config.js.'
				);
				return;
			}

			var fields = buildFields(settings, email);

			// Providers that refuse cross-origin fetches (Brevo, Mailchimp) get a
			// real form submission aimed at a hidden iframe. We never see their
			// answer, so this reports success once the browser has sent it — their
			// confirmation mail is what actually closes the loop.
			if (settings.mode === 'form') {
				postThroughIframe(window.ENDPOINTS.newsletter, fields);
				showDone(THANKS);
				return;
			}

			setLoading(true);

			fetch(window.ENDPOINTS.newsletter, {
				method: 'POST',
				// Form-encoded, not JSON: it is what an ordinary HTML form would
				// have sent, so every provider accepts it. The Accept header is what
				// makes them answer with JSON instead of redirecting to a thank-you
				// page we cannot read.
				headers: {
					'content-type': 'application/x-www-form-urlencoded',
					accept: 'application/json'
				},
				body: encodeFields(fields)
			})
				.then(function (res) {
					if (res.ok) {
						showDone(THANKS);
						return;
					}
					return readProviderError(res).then(function (message) {
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

		function showDone(message) {
			form.hidden = true;
			if (done) {
				done.hidden = false;
				done.textContent = message;
			}
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
				button.innerHTML =
					'<span class="spinner" aria-hidden="true"></span>Hou me op de hoogte';
			} else {
				button.textContent = 'Hou me op de hoogte';
			}
		}
	}

	/* ─── FORM PLUMBING ────────────────────────────────────────
	   Shared by the newsletter here and the contact form in assets/js/contact.js.
	   ------------------------------------------------------------------- */

	/** The provider's own field names, plus whatever its embed carries along. */
	function buildFields(settings, email) {
		var fields = {};
		var hidden = settings.hiddenFields || {};

		Object.keys(hidden).forEach(function (key) {
			fields[key] = hidden[key];
		});

		fields[settings.emailField || 'email'] = email;
		return fields;
	}

	function encodeFields(fields) {
		return Object.keys(fields)
			.map(function (key) {
				return encodeField(key) + '=' + encodeField(fields[key]);
			})
			.join('&');
	}

	// encodeURIComponent writes a space as %20, but a form body is supposed to
	// use +. Most servers cope with either; the ones that do not fail quietly,
	// with the space still in the name, which is a miserable thing to debug.
	function encodeField(value) {
		return encodeURIComponent(value).replace(/%20/g, '+');
	}

	/**
	 * A normal form POST into a hidden iframe: the only way to reach a provider
	 * that does not send CORS headers without navigating the visitor away.
	 */
	function postThroughIframe(action, fields) {
		var name = 'form-sink-' + Date.now();

		var frame = document.createElement('iframe');
		frame.name = name;
		frame.hidden = true;
		frame.setAttribute('aria-hidden', 'true');
		frame.setAttribute('tabindex', '-1');
		document.body.appendChild(frame);

		var form = document.createElement('form');
		form.action = action;
		form.method = 'POST';
		form.target = name;
		form.hidden = true;

		Object.keys(fields).forEach(function (key) {
			var field = document.createElement('input');
			field.type = 'hidden';
			field.name = key;
			field.value = fields[key];
			form.appendChild(field);
		});

		document.body.appendChild(form);
		form.submit();
		form.remove();
	}

	/**
	 * Turns a failed response into something a human can act on. Form services
	 * all report errors differently; these are the three shapes in the wild.
	 */
	function readProviderError(res) {
		return res
			.json()
			.catch(function () {
				return null;
			})
			.then(function (body) {
				if (body) {
					if (body.errors && body.errors.length && body.errors[0].message) {
						return body.errors[0].message; // Formspree
					}
					if (typeof body.error === 'string') return body.error; // Basin, Formspark
					if (typeof body.message === 'string') return body.message;
				}
				return 'Er ging iets mis. Probeer het zo nog eens.';
			});
	}

	// assets/js/contact.js runs as its own script, so hand it what it needs.
	window.FORMS = {
		buildFields: buildFields,
		encodeFields: encodeFields,
		postThroughIframe: postThroughIframe,
		readProviderError: readProviderError
	};

	/* ─── BOOT ────────────────────────────────────────────────────────── */
	function init() {
		renderHeader();
		renderFooter();
		renderCookieBanner();
		fillSiteData();
		initReveal();
		initAccordion();
		initBuyButtons();
		initPriceTags();
		initNewsletter();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();

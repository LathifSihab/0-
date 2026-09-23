/**
 * MOCKTAILRECEPTEN — PLACEHOLDER DATA + RENDERING
 *
 * The content document says: "30 recepten; inhoud volgt".
 * Everything below is scaffolding so the page, the filters and the ad slots
 * can be designed and reviewed. Replace `name`, `tagline`, `ingredients`,
 * `steps` and `image` with the real recipes — the shape is final.
 *
 * Images: drop files in the `mocktails/` folder next to this site and set
 * `image` to `mocktails/<bestand>.jpg`. Cards fall back to a branded
 * placeholder tile while `image` is empty, so nothing looks broken before
 * the shoot.
 *
 * Once the real recipes exist, replace the generated array below with a
 * plain list of objects — it is the same shape, just written out by hand.
 */
(function () {
	'use strict';

	var CATEGORIES = ['Fris', 'Bitter', 'Kruidig', 'Fruitig', 'Warm', 'Feest'];
	var GLASSES = ['Longdrink', 'Tumbler', 'Coupe', 'Wijnglas'];

	/** Thirty placeholder records. Content follows. */
	var MOCKTAILS = [];
	for (var i = 0; i < 30; i++) {
		var n = i + 1;
		MOCKTAILS.push({
			slug: 'recept-' + String(n).padStart(2, '0'),
			name: 'Recept ' + String(n).padStart(2, '0'),
			tagline: 'Naam, smaakprofiel en verhaal volgen nog.',
			category: CATEGORIES[i % CATEGORIES.length],
			minutes: 3 + (i % 5),
			glass: GLASSES[i % 4],
			ingredients: [
				'Ingrediënt — volgt',
				'Ingrediënt — volgt',
				'Ingrediënt — volgt',
				'Garnering — volgt'
			],
			steps: ['Stap 1 — volgt', 'Stap 2 — volgt', 'Stap 3 — volgt'],
			image: ''
		});
	}

	/** An advertiser block every 6 cards — visible, but never the main event. */
	var AD_AFTER = [5, 17];

	var filter = 'Alles';

	function escapeHtml(value) {
		return String(value)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}

	function cardHtml(mocktail, index) {
		var media = mocktail.image
			? '<img src="' +
				escapeHtml(mocktail.image) +
				'" alt="' +
				escapeHtml(mocktail.name) +
				'" loading="lazy" decoding="async" />'
			: '<div class="mock__placeholder" aria-hidden="true">' +
				'<span class="u-figure mock__number">' +
				String(index + 1).padStart(2, '0') +
				'</span>' +
				'<span class="mock__placeholder-note">Beeld volgt</span>' +
				'</div>';

		var ingredients = mocktail.ingredients
			.map(function (item) {
				return '<li>' + escapeHtml(item) + '</li>';
			})
			.join('');

		var steps = mocktail.steps
			.map(function (item) {
				return '<li>' + escapeHtml(item) + '</li>';
			})
			.join('');

		return (
			'<article class="mock c-card c-card--interactive">' +
			'<div class="mock__media">' +
			media +
			'<span class="c-tag mock__cat">' +
			escapeHtml(mocktail.category) +
			'</span>' +
			'</div>' +
			'<div class="mock__body">' +
			'<h3 class="t-h3 mock__name">' +
			escapeHtml(mocktail.name) +
			'</h3>' +
			'<p class="mock__tagline u-muted t-small">' +
			escapeHtml(mocktail.tagline) +
			'</p>' +
			'<ul class="mock__meta t-small u-faint">' +
			'<li>' +
			mocktail.minutes +
			' min</li>' +
			'<li>' +
			escapeHtml(mocktail.glass) +
			'</li>' +
			'<li>0% alcohol</li>' +
			'</ul>' +
			'<details class="mock__details">' +
			'<summary>Bekijk het recept</summary>' +
			'<div class="mock__recipe">' +
			'<p class="t-eyebrow">Ingrediënten</p>' +
			'<ul>' +
			ingredients +
			'</ul>' +
			'<p class="t-eyebrow">Bereiding</p>' +
			'<ol>' +
			steps +
			'</ol>' +
			'</div>' +
			'</details>' +
			'</div>' +
			'</article>'
		);
	}

	/**
	 * Advertiser slot. The content document asks for a page where advertisers
	 * "kunnen uitblinken" — so the slot is a first-class brand surface, not a
	 * banner strip. Keep it clearly labelled: the brandbook forbids anything
	 * that reads as sneaky or salesy.
	 *
	 * Wire a real partner by passing brand, claim, href and image.
	 */
	function adHtml(options) {
		var opts = options || {};
		var label = opts.label || 'Partner';
		var filled = Boolean(opts.brand);

		if (!filled) {
			return (
				'<aside class="ad ad--empty">' +
				'<p class="ad__label t-eyebrow">' +
				escapeHtml(label) +
				'</p>' +
				'<div class="ad__content ad__content--empty">' +
				'<p class="ad__brand t-h3">Advertentieruimte</p>' +
				'<p class="ad__claim t-small">Vrij blok voor een alcoholvrij merk. Geef ' +
				'<code>brand</code>, <code>claim</code>, <code>href</code> en <code>image</code> ' +
				'mee aan <code>adHtml()</code> in <code>js/mocktails.js</code>.</p>' +
				'</div>' +
				'</aside>'
			);
		}

		return (
			'<aside class="ad">' +
			'<p class="ad__label t-eyebrow">' +
			escapeHtml(label) +
			'</p>' +
			'<div class="ad__content">' +
			(opts.image
				? '<img class="ad__image" src="' +
					escapeHtml(opts.image) +
					'" alt="' +
					escapeHtml(opts.brand) +
					'" loading="lazy" />'
				: '') +
			'<div>' +
			'<p class="ad__brand t-h3">' +
			escapeHtml(opts.brand) +
			'</p>' +
			(opts.claim ? '<p class="ad__claim t-small">' + escapeHtml(opts.claim) + '</p>' : '') +
			(opts.href
				? '<a class="ad__link" href="' +
					escapeHtml(opts.href) +
					'" rel="sponsored noopener" target="_blank">Ontdek meer</a>'
				: '') +
			'</div>' +
			'</div>' +
			'</aside>'
		);
	}

	function render() {
		var grid = document.querySelector('[data-mocktail-grid]');
		var count = document.querySelector('[data-mocktail-count]');
		if (!grid) return;

		var visible =
			filter === 'Alles'
				? MOCKTAILS
				: MOCKTAILS.filter(function (m) {
						return m.category === filter;
					});

		var html = '';
		visible.forEach(function (mocktail, i) {
			html += cardHtml(mocktail, MOCKTAILS.indexOf(mocktail));
			if (filter === 'Alles' && AD_AFTER.indexOf(i) !== -1) {
				html += adHtml({ label: 'In samenwerking met' });
			}
		});

		grid.innerHTML = html;

		if (count) {
			count.textContent = visible.length + ' van ' + MOCKTAILS.length + ' recepten';
		}
	}

	function init() {
		var buttons = document.querySelectorAll('[data-filter]');

		Array.prototype.forEach.call(buttons, function (button) {
			button.addEventListener('click', function () {
				filter = button.dataset.filter;

				Array.prototype.forEach.call(buttons, function (other) {
					other.classList.toggle('is-active', other === button);
					other.setAttribute('aria-pressed', String(other === button));
				});

				render();
			});
		});

		render();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();

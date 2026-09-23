/**
 * set-config.mjs — write one value into assets/js/config.js, in place.
 *
 * The launch values live in a commented JavaScript file rather than a .env,
 * so the go-live wizard needs something that can edit that file precisely and
 * leave every comment around it intact. That is all this does.
 *
 *   node tools/set-config.mjs PRODUCT.paymentLink "https://buy.stripe.com/xxx"
 *   node tools/set-config.mjs PRODUCT.priceCents 2700 --raw
 *   node tools/set-config.mjs DEMO.enabled false --raw
 *
 * Without --raw the value is written as a single-quoted JS string. With --raw
 * it is written verbatim, which is how numbers, booleans and objects get in.
 *
 * Only one level deep (BLOCK.key) — that is every value the wizard sets.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const CONFIG = resolve(HERE, '..', 'assets', 'js', 'config.js');

const [dotted, value, ...flags] = process.argv.slice(2);
const raw = flags.includes('--raw');

if (!dotted || value === undefined) {
	console.error('usage: node tools/set-config.mjs BLOCK.key value [--raw]');
	process.exit(2);
}

const [block, key] = dotted.split('.');
if (!block || !key) {
	console.error(`not a BLOCK.key path: ${dotted}`);
	process.exit(2);
}

const source = readFileSync(CONFIG, 'utf8');

/** The body of `window.BLOCK = { … }`, found by counting braces. */
function findBlock(text, name) {
	const opener = `window.${name} = {`;
	const start = text.indexOf(opener);
	if (start === -1) return null;

	let depth = 0;
	for (let i = start + opener.length - 1; i < text.length; i++) {
		if (text[i] === '{') depth++;
		else if (text[i] === '}') {
			depth--;
			if (depth === 0) return { from: start, to: i + 1 };
		}
	}
	return null;
}

const found = findBlock(source, block);
if (!found) {
	console.error(`could not find window.${block} = { … } in assets/js/config.js`);
	process.exit(1);
}

const before = source.slice(0, found.from);
const body = source.slice(found.from, found.to);
const after = source.slice(found.to);

// A single-quoted JS string: escape the quote and the backslash, nothing else,
// because every value here is a URL, an e-mail address or a short label.
const written = raw ? value : `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

// The key on its own line, with whatever indentation and trailing comma it
// already had. Anchored to line start so a key name inside a comment or a
// longer identifier (priceCents vs price) cannot match.
const line = new RegExp(`^([ \\t]*)${key}:[ \\t]*(.*?)(,?)[ \\t]*$`, 'm');
const match = body.match(line);

if (!match) {
	console.error(`window.${block} has no key "${key}"`);
	process.exit(1);
}

if (match[2] === written) {
	console.log(`= ${dotted} already ${written}`);
	process.exit(0);
}

const patched = body.replace(line, `$1${key}: ${written}$3`);
writeFileSync(CONFIG, before + patched + after, 'utf8');
console.log(`✓ ${dotted} = ${written}`);

/** Live model prices for the docs. Prices are edited on the console's admin page and served by the gateway's
 *  public GET /v1/models. Pages render them at build time, and a small script refreshes every <Price> from the
 *  same endpoint when the page loads, so an admin change shows without a redeploy.
 *
 *  The formatting mirrors Olaverse-console/src/lib/pricing.ts so the docs and the console say the same thing. */

export const MODELS_URL = 'https://api.olaverselab.com/v1/models';

export type Price =
	/** USD per 1M tokens; output null = no output charge. */
	| { unit: 'tokens'; input: number; output: number | null }
	/** USD per `per` units. Documents can include a number of pages, with each page beyond priced per 1,000. */
	| { unit: 'requests' | 'characters' | 'documents'; price: number; per: number; pagesIncluded?: number; extraPagePrice?: number };

export type PriceTable = Record<string, Price>;

/** Stand-ins when the API can't be reached (an offline build, or the script failing). Keep them roughly in
 *  step with DEFAULT_PRICES in the console. */
export const DEFAULT_PRICES: PriceTable = {
	'purplemist-flash-1.0': { unit: 'tokens', input: 0.06, output: null },
	'purplemist-mini-1.0': { unit: 'tokens', input: 0.02, output: null },
	'mist-extract-1.0': { unit: 'documents', price: 2.5, per: 1_000, pagesIncluded: 5, extraPagePrice: 0.5 },
	'mist-extract-flash-1.0': { unit: 'tokens', input: 0.2, output: null },
	'mist-qg-1.5b': { unit: 'tokens', input: 0.04, output: 0.12 },
	'lid-neural-608': { unit: 'requests', price: 0.3, per: 1_000 },
	'lid-lite-608': { unit: 'requests', price: 0.05, per: 1_000 },
	'diacnet-2.0': { unit: 'characters', price: 1.0, per: 1_000_000 },
	'diacnet-mini-2.0': { unit: 'characters', price: 0.6, per: 1_000_000 },
	'diactag-2.0': { unit: 'characters', price: 0.2, per: 1_000_000 },
};

/** The models behind each capability, for "from …" labels. */
export const CAPABILITY_MODELS: Record<string, string[]> = {
	decide: ['purplemist-flash-1.0', 'purplemist-mini-1.0'],
	extract: ['mist-extract-1.0', 'mist-extract-flash-1.0'],
	'language-id': ['lid-neural-608', 'lid-lite-608'],
	diacritize: ['diacnet-2.0', 'diacnet-mini-2.0', 'diactag-2.0'],
	questions: ['mist-qg-1.5b'],
};

/* ── The gateway's shape ─────────────────────────────────────────────────────── */

type GatewayPrice =
	| { unit: 'token'; input: number; output: number }
	| { unit: 'request' | 'character' | 'document'; price: number; per: number; pages_included?: number; extra_page_price?: number };

const PLURAL = { request: 'requests', character: 'characters', document: 'documents' } as const;

function fromGateway(p: GatewayPrice): Price {
	return p.unit === 'token'
		? { unit: 'tokens', input: p.input, output: p.output ? p.output : null }
		: {
				unit: PLURAL[p.unit],
				price: p.price,
				per: p.per,
				...(p.pages_included ? { pagesIncluded: p.pages_included, extraPagePrice: p.extra_page_price ?? 0 } : {}),
			};
}

/** The live table, falling back to the defaults model by model. */
export async function fetchPrices(): Promise<PriceTable> {
	try {
		const r = await fetch(MODELS_URL, { signal: AbortSignal.timeout(10_000) });
		if (!r.ok) return DEFAULT_PRICES;
		const { data } = (await r.json()) as { data: { id: string; pricing?: GatewayPrice }[] };
		const live = Object.fromEntries(data.filter((m) => m.pricing?.unit).map((m) => [m.id, fromGateway(m.pricing!)]));
		return { ...DEFAULT_PRICES, ...live };
	} catch {
		return DEFAULT_PRICES;
	}
}

let buildPrices: Promise<PriceTable> | undefined;
/** One fetch per build, shared by every page. */
export const getBuildPrices = () => (buildPrices ??= fetchPrices());

/* ── Formatting ──────────────────────────────────────────────────────────────── */

/** "$0.025", "$0.12", "$1.00": three decimals only where they matter. */
export const money = (n: number) =>
	new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: n < 0.1 && Math.round(n * 1000) % 10 !== 0 ? 3 : 2,
	}).format(n);

const per = (n: number) => (n === 1_000_000 ? '1M' : n.toLocaleString('en-US'));

const pagesNote = (p: Price) =>
	p.unit === 'documents' && p.pagesIncluded
		? `, up to ${p.pagesIncluded} pages each; extra pages ${money(p.extraPagePrice ?? 0)} per 1,000`
		: '';

/** "$0.06 per 1M input tokens, output free", "$0.04 in · $0.12 out per 1M tokens", "$0.30 per 1,000 requests". */
function line(p: Price) {
	if (p.unit !== 'tokens') return `${money(p.price)} per ${per(p.per)} ${p.unit}${pagesNote(p)}`;
	return p.output === null
		? `${money(p.input)} per 1M input tokens, output free`
		: `${money(p.input)} in · ${money(p.output)} out per 1M tokens`;
}

/** "from $0.02 / 1M tokens": the capability's cheapest model, preferring token prices when units are mixed. */
function from(models: string[], table: PriceTable) {
	const prices = models.map((id) => table[id]).filter(Boolean);
	const tokens = prices.filter((p) => p.unit === 'tokens') as Extract<Price, { unit: 'tokens' }>[];
	if (tokens.length) return `from ${money(Math.min(...tokens.map((p) => p.input)))} / 1M tokens`;
	const units = prices as Exclude<Price, { unit: 'tokens' }>[];
	if (!units.length) return '';
	const cheapest = units.reduce((a, b) => (b.price / b.per < a.price / a.per ? b : a));
	return `from ${money(cheapest.price)} / ${per(cheapest.per)} ${cheapest.unit}`;
}

export type PriceFormat =
	/** The full price phrase for a model. */
	| 'line'
	/** The input price per 1M tokens alone, e.g. "$0.06". */
	| 'input'
	/** "from …" for a capability; `model` is a CAPABILITY_MODELS key. */
	| 'from'
	/** The cost of 1,000 calls of `tokens` input tokens, e.g. "$0.11". */
	| 'per-1000';

/** The text for one <Price>, or '' when the model or format doesn't fit. */
export function formatPrice(table: PriceTable, model: string, format: PriceFormat, tokens?: number): string {
	if (format === 'from') return from(CAPABILITY_MODELS[model] ?? [], table);
	const p = table[model];
	if (!p) return '';
	if (format === 'line') return line(p);
	if (p.unit !== 'tokens') return '';
	if (format === 'input') return money(p.input);
	return money(((tokens ?? 0) * p.input * 1000) / 1e6);
}

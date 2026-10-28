// /llms.txt: an index of every docs page for AI tools and coding agents (llmstxt.org), built from the docs collection
// so it never falls out of step with the site.
import { getCollection } from 'astro:content';

const SITE = 'https://docs.olaverselab.com';

// Sections in sidebar order; a page goes in the first whose prefix matches its id.
const SECTIONS: [string, string][] = [
	['Get started', 'get-started/'],
	['Capabilities', 'api/'],
	['Cookbooks', 'cookbooks/'],
	['Troubleshooting', 'troubleshooting/'],
	['Reference', 'reference/'],
];

export async function GET() {
	const docs = (await getCollection('docs')).sort((a, b) => a.id.localeCompare(b.id));
	const link = (d: (typeof docs)[number]) =>
		`- [${d.data.title}](${SITE}/${d.id === 'index' ? '' : `${d.id}/`})${d.data.description ? `: ${d.data.description}` : ''}`;
	const lines = [
		'# Olaverse API',
		'',
		'> Calibrated decisions, document extraction, language identification, diacritic restoration and question generation, built for English and African languages. One base URL (https://api.olaverselab.com) and one bearer key.',
		'',
		'## Agent resources',
		'',
		`- [Agent skill](${SITE}/.well-known/agent-skills/olaverse-api/SKILL.md): install with \`npx skills add ${SITE} --skill olaverse-api\``,
		`- [Models and prices](https://api.olaverselab.com/v1/models): live JSON, no key needed`,
		'',
		'## Documentation',
		'',
		...docs.filter((d) => d.id === 'index').map(link),
	];
	for (const [title, prefix] of SECTIONS) {
		const pages = docs.filter((d) => d.id.startsWith(prefix));
		if (pages.length) lines.push('', `### ${title}`, '', ...pages.map(link));
	}
	return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

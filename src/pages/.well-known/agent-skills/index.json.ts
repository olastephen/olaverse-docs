// The agent-skills discovery catalogue (agentskills.io), read by `npx skills add https://docs.olaverselab.com`.
// Built from the skill files in public/.well-known/agent-skills/, so each digest always matches the file served.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const SKILLS = [
	{
		name: 'olaverse-api',
		description:
			'Call the Olaverse API: calibrated decisions, document extraction to JSON, language identification, diacritic restoration and question generation, built for English and African languages.',
	},
];

export function GET() {
	const skills = SKILLS.map((s) => {
		const path = `/.well-known/agent-skills/${s.name}/SKILL.md`;
		// From the project root: the build bundles this file elsewhere, so a path relative to it would break.
		const digest = createHash('sha256').update(readFileSync(join(process.cwd(), 'public', path))).digest('hex');
		return { name: s.name, type: 'skill-md', description: s.description, url: path, digest: `sha256:${digest}` };
	});
	return new Response(JSON.stringify({ $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json', skills }, null, 2), {
		headers: { 'Content-Type': 'application/json' },
	});
}

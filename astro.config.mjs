// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://docs.olaverselab.com',
	// /v1/warmup was removed: models start on demand. Old links land on the quickstart.
	redirects: { '/get-started/warm-up': '/get-started/quickstart' },
	integrations: [
		starlight({
			title: 'Olaverse Lab Docs',
			description:
				'Documentation for the Olaverse API: decisions, document extraction, language identification, diacritic restoration and question generation, built for English and African languages.',
			logo: { src: './src/assets/logo.png', alt: 'Olaverse Lab' },
			favicon: '/favicon.ico',
			customCss: ['./src/styles/olaverse.css'],
			components: {
				SiteTitle: './src/components/SiteTitle.astro',
				Sidebar: './src/components/Sidebar.astro',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/Olaverse-Labs' },
				{ icon: 'external', label: 'Developer console', href: 'https://console.olaverselab.com' },
			],
			sidebar: [
				{
					label: 'Get started',
					items: [
						{ label: 'Introduction', link: '/' },
						{ label: 'Quickstart', slug: 'get-started/quickstart' },
						{ label: 'Example use cases', slug: 'get-started/use-cases' },
					],
				},
				{
					label: 'Capabilities',
					items: [
						{ label: 'Decisions', slug: 'api/decisions', badge: { text: 'Frontier', variant: 'tip' } },
						{ label: 'Document extraction', slug: 'api/extraction', badge: { text: 'New', variant: 'success' } },
						{ label: 'Language identification', slug: 'api/language-id' },
						{ label: 'Diacritic restoration', slug: 'api/diacritics' },
						{ label: 'Question generation', slug: 'api/questions' },
					],
				},
				{
					label: 'Inference API',
					items: [
						{ label: 'Overview', slug: 'api/overview' },
						{ label: 'Authentication', slug: 'get-started/authentication' },
						{ label: 'OpenAI & OpenRouter clients', slug: 'get-started/compatibility' },
					],
				},
				{
					label: 'Troubleshooting',
					items: [
						{ label: 'Errors', slug: 'reference/errors' },
						{ label: 'Retries and timeouts', slug: 'troubleshooting/retries' },
					],
				},
				{
					label: 'Models',
					items: [{ label: 'Model catalog', slug: 'reference/models' }],
				},
				{
					label: 'Account',
					items: [{ label: 'Pricing', slug: 'reference/billing' }],
				},
			],
		}),
	],
});

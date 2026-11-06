# Good Q — Cloudflare Web Analytics rollout (draft)

Status: **not enabled**. This branch is for preparation only; production `main` and `goodq.app` remain unchanged.

## Before enabling

1. Create a Cloudflare Web Analytics site for `goodq.app` in an account controlled by the Good Q owner.
2. Copy the **Web Analytics site token** (not an API key). Do not commit API secrets.
3. Add Cloudflare's documented Web Analytics beacon script with that site token to the production website HTML (and web app entry page if tracking the app is desired). The expected script URL is `https://static.cloudflareinsights.com/beacon.min.js`; use the exact current snippet supplied by Cloudflare.
4. Update `web-privacy.html` **in English and Chinese before or alongside activation**. Its current promise of “no analytics / no trackers” must not remain after analytics is enabled. Describe the analytics provider, the data collected, purpose, retention, and privacy choices accurately based on Cloudflare's current documentation.
5. Review any other privacy statements and confirm that app-specific privacy policies are not accidentally changed.
6. Test in a separate preview/staging deployment, check network requests and dashboard events, then merge via reviewed pull request.

## Guardrails

- Do not alter Namecheap DNS, GitHub Pages custom domain, or the CNAME file.
- Do not add analytics to sensitive birth-chart data, questions, or user-input events; only aggregate page traffic is intended.
- Do not claim historical visitor counts: data begins after tracking is actually enabled.
- Keep this branch separate from the iOS/cloud-sync development branch.

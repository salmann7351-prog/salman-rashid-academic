# Salman Rashid Academic Portfolio

This package contains the final academic portfolio website with the locked dark/lime visual direction and a private admin panel.

## Public site

The public navigation is: Home · Research · CV · Research Interests · Recommendations · Contact. The separate About, EAG, and Notes pages are intentionally removed.

## Private admin

Open `/admin/` on the deployed Vercel project. Routine content edits are saved through the connected GitHub repository and Vercel redeploys the site automatically.

Required Vercel environment variables:
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `GITHUB_TOKEN`
- `GITHUB_REPO`
- `GITHUB_BRANCH` (usually `main`)

The GitHub token is used only from server-side Vercel functions. The fine-grained token should be restricted to this repository with Contents: Read and write and Metadata: Read-only.

## Recommendations

The public Recommendations page can be enabled from the Admin panel. Submissions are stored in a private review queue and are never published automatically. Only an administrator can approve and publish them.

## CV

The structured CV page is driven by `data/site-content.json`. The downloadable PDF lives at `assets/cv/Salman_Rashid_CV.pdf`. The Admin panel supports uploading a replacement PDF.

## Research

Research cards and statuses are driven by `data/site-content.json`. The three current research detail pages retain their substantive full-page content. New projects can be added from the Admin panel; newly added projects can use the generic `project.html?slug=...` detail template.

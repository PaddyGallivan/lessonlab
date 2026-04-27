# lessonlab

Cloudflare Worker `lessonlab` — deploys via GitHub Actions. **NO LOCAL INFRA.**

Push to `main` → GH Actions runs `wrangler deploy --keep-vars` → CF.

## One-time setup

Repo Settings → Secrets and variables → Actions → New repository secret:
- `CLOUDFLARE_API_TOKEN` (from asgard-vault `CF_API_TOKEN`)
- `CLOUDFLARE_ACCOUNT_ID` = `a6f47c17811ee2f8b6caeb8f38768c20`

(May already be set — if so, skip.)

To enable the workflow, ensure your PAT has `workflow` scope, then `cp docs/SETUP-WORKFLOW.yml .github/workflows/deploy.yml` and push.

Worker secrets stay in CF (not in this repo). Deploys use `--keep-vars`.

# Security & Operational Rules
- **Environment:** Secrets locked in `.env`. Never commit or expose API keys.
- **Command Constraints:**
  - ALLOWED: `npm run`, `pytest`, `git status`, `git commit`, `./scripts/*`
  - DENIED: `rm -rf /`, `curl | sh`, `git push --force`, dumping `.env` contents.
- **Pre-Commit Enforcement:** Automated via `.git/hooks/pre-commit`.

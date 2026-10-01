# V18 — Secure Signing & Supply-Chain QA

Status: **DEVELOPMENT / NOT RELEASED**

## Version

- Release: `V18`
- Version: `5.8.0`
- versionCode: `180`
- Planned tag: `v5.8.0`
- Branch: `v18-secure-signing-migration`
- Publication gate: `publish=false`

## Scope

V18 starts with security and release-engineering hardening. Medical/core calculations, SCORE2, report formulas, existing data schema, package ID and user data compatibility are intentionally out of scope unless separately reviewed.

## Completed foundation

- [x] V18 metadata initialized
- [x] Release publication gate closed
- [x] Legacy tracked signing material removed from V18 tree
- [x] Ordinary branch CI separated from production signing
- [x] Production signing isolated to protected release workflow
- [x] Existing tag/release overwrite blocked
- [x] Private-key file patterns blocked by `.gitignore`
- [x] Tracked private-key/PEM guard added
- [x] Separate V18 Playwright suite added
- [x] In-app About shows Apache License 2.0
- [x] V18 onboarding version/security text updated
- [x] Dependabot configuration added
- [x] Dependency vulnerability workflow added
- [x] CodeQL workflow added
- [ ] SheetJS CDN SHA-256 pinned and enforced
- [ ] jsPDF upgraded from 2.5.1 and PDF regression completed
- [ ] New private V18 production signing key created outside Git
- [ ] GitHub `production-signing` environment configured
- [ ] Production signing secrets configured
- [ ] New certificate SHA-256 recorded and verified
- [ ] V17 backup → clean V18 install → restore migration tested
- [ ] Full real-device acceptance completed

## Automated checks

Required on the exact V18 candidate commit:

- `build-apk`
- `mobile-ui`

Additional V18 security checks:

- `dependency-audit`
- `codeql-javascript`

## Release rule

V18 must not be published until:

1. production signer is private and verified;
2. dependency/supply-chain findings are resolved or explicitly documented;
3. automated checks pass;
4. real-device migration and functional acceptance pass;
5. the owner explicitly approves publication.

## Signing boundary

The V17 direct-distribution signer was exposed in public project history and is treated as compromised. It must not be reused as the V18 trusted production signing identity.

The V18 production keystore must never be committed to Git or sent through public project files.

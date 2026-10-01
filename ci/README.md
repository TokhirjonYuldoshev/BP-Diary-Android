# CI signing policy

BP Diary V18 separates ordinary CI signing from production release signing.

## Ordinary branch CI

The `build-apk` workflow must not use a production or legacy private signing key.

- branch candidates use the standard Android/Gradle debug signer;
- the release build is compiled as an unsigned release artifact to catch build failures;
- no private keystore is stored in Git;
- `scripts/security-check.mjs` rejects tracked private-key material.

## Production release

Production signing is performed only by the protected release workflow after the explicit publication gate is opened.

The release workflow expects a private keystore and credentials through GitHub Secrets in the `production-signing` environment. The production keystore must never be committed to this repository.

## Legacy V17 signer

The V17 direct-distribution signer was exposed in public Git history and must be treated as compromised. It remains documented only for historical verification and migration planning; V18 production must not reuse it.

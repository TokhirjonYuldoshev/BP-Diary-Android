# CI signing material

`debug.keystore.b64` contains the legacy stable direct-distribution key used to preserve the V8–V15 APK update path.

## Important

This key has been stored in the public repository history. It must therefore be treated as **public/test signing material**, not as a secure production credential.

It exists only so users of the current direct-distribution test lineage can install newer compatible APKs over older versions without uninstalling.

For any real production channel, especially Google Play:

- create a new private signing key;
- never commit it to Git;
- store it in GitHub Actions Secrets or another secure secret store;
- prefer Google Play App Signing;
- use AAB when appropriate;
- plan the signing-lineage migration explicitly.

Do not add any new private signing keys, passwords, API tokens or user data to this directory.

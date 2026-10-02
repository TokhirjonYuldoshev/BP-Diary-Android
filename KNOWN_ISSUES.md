# Known Issues / Известные проблемы

## V18 5.8.1: in-place update may be rejected on some existing installations

Status: **OPEN — under investigation in Issue #18**

On 2026-10-02 the owner reported that the official `BP-Diary-5.8.1-V18.apk` did not install over the app already present on the device without uninstalling it first.

### What is already verified

The two official GitHub Release APKs themselves have the expected upgrade-compatible identifiers:

| Release | versionCode | Package ID | APK SHA-256 |
| --- | ---: | --- | --- |
| V18 5.8.0 | 181 | `com.tokhirjonyuldoshev.bpdiary` | `802b608d2828c4513be644cdbb4287bf922dadec4fe3a6469378ee5c50c3d15c` |
| V18 5.8.1 | 182 | `com.tokhirjonyuldoshev.bpdiary` | `38b1e92307df61915ff85edc8e447688f4f36010ec39c6e01178a9f5796b1301` |

Both official APKs contain the same APK Signature Scheme v2 signing certificate SHA-256:

`a5937391a51706596971d19374b9e956f256ba4621c58a2ac487f0862f2b2cb4`

Therefore this is **not yet confirmed as a release-signing regression**. The exact installed package on the affected device still needs to be identified. A previously installed CI/debug candidate with the same package ID but a different certificate is one possible cause.

### Safe update guidance

1. Create a **Full Backup** before any uninstall or reinstall.
2. Verify that the backup file exists and can be selected for restore.
3. Do not uninstall the current app merely to retry an update unless the backup has been verified.
4. If Android rejects the official 5.8.1 APK, capture the exact Package Installer message or `adb install -r` error.
5. Do not install CI/debug candidates on the main production device.

### Diagnostic commands (Windows / PowerShell)

Check the installed version:

```powershell
adb shell dumpsys package com.tokhirjonyuldoshev.bpdiary | Select-String "versionCode|versionName"
```

Get the installed APK path:

```powershell
adb shell pm path com.tokhirjonyuldoshev.bpdiary
```

Pull the installed APK by using the returned `package:/.../base.apk` path without the `package:` prefix:

```powershell
adb pull "<returned-base.apk-path>" .\installed-bp-diary.apk
```

Then inspect its certificate with Android SDK Build Tools `apksigner`:

```powershell
$apksigner = Get-ChildItem "$env:LOCALAPPDATA\Android\Sdk\build-tools\*\apksigner.bat" |
  Sort-Object FullName -Descending |
  Select-Object -First 1
& $apksigner.FullName verify --print-certs .\installed-bp-diary.apk
```

Expected official V18 production certificate SHA-256:

`a5937391a51706596971d19374b9e956f256ba4621c58a2ac487f0862f2b2cb4`

To capture the exact package-manager failure without uninstalling:

```powershell
adb install -r .\BP-Diary-5.8.1-V18.apk
```

Track investigation details in [Issue #18](https://github.com/TokhirjonYuldoshev/BP-Diary-Android/issues/18).

## Build-tooling findings

The dependency audit continues to report known build-time findings through `@capacitor/assets 3.0.5`. The shipped runtime dependency audit remains clean at the current stable release. These findings are tracked separately and do not change medical/core calculations.

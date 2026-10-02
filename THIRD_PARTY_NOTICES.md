# Third-Party Notices

BP Diary includes or uses the following third-party open-source components.

This file documents the primary direct dependencies and bundled web assets used by the current V18 / 5.8.0 release. Transitive build dependencies may have their own notices and license terms; their upstream license files remain authoritative.

## Runtime / bundled components

### Capacitor

- Packages: `@capacitor/core 8.5.2`, `@capacitor/android 8.5.2`
- Project: https://github.com/ionic-team/capacitor
- License: MIT

Copyright (c) 2017-present Drifty Co.

### Chart.js

- Package: `chart.js 4.5.1`
- Project: https://github.com/chartjs/Chart.js
- License: MIT

### Font Awesome Free

- Package: `@fortawesome/fontawesome-free 7.3.1`
- Project: https://github.com/FortAwesome/Font-Awesome
- Licensing:
  - Icons: CC BY 4.0
  - Fonts: SIL OFL 1.1
  - Code: MIT

### html2canvas

- Package: `html2canvas 1.4.1`
- Project: https://github.com/niklasvh/html2canvas
- License: MIT

### jsPDF

- Package: `jspdf 4.2.1`
- Project: https://github.com/parallax/jsPDF
- License: MIT

Copyright (c) 2010-2025 James Hall
Copyright (c) 2015-2025 yWorks GmbH

### SheetJS Community Edition

- Bundled asset: `xlsx.full.min.js`
- Version used by the V18 preparation pipeline: `0.20.2`
- Project: https://sheetjs.com/
- License: Apache License 2.0

Required attribution:

> SheetJS Community Edition -- https://sheetjs.com/
>
> Copyright (C) 2012-present SheetJS LLC
>
> Licensed under the Apache License, Version 2.0.

The V18 build pipeline downloads this asset from the official SheetJS CDN and verifies its pinned SHA-256 before packaging it into the offline web app.

## Build-time tools

### Capacitor CLI

- Package: `@capacitor/cli 8.5.2`
- Project: https://github.com/ionic-team/capacitor
- License: MIT

### Capacitor Assets

- Package: `@capacitor/assets 3.0.5`
- Project: https://github.com/ionic-team/capacitor-assets
- License: MIT

`@capacitor/assets` is used only during resource generation. Current upstream build-time vulnerability findings remain tracked by the repository dependency-audit workflow; the shipped runtime dependency audit is required to remain free of high/critical findings.

## License texts

The corresponding upstream repositories and distributed package metadata contain the complete license texts and copyright notices. BP Diary's own source code remains licensed under the repository's Apache License 2.0 unless a file or bundled third-party component states otherwise.

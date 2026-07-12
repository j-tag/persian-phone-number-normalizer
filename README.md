# persian-phone-number-normalizer

Validate and normalize Persian phone numbers using blazingly fast implementation which is flexible at the same time.

To install:

```bash
npm i persian-phone-number-normalizer
```

Usage with ESM:

```javascript
import { normalizeNumber } from 'persian-phone-number-normalizer'
```

Usage with CJS:

```javascript
const { normalizeNumber } = require("persian-phone-number-normalizer")
```
Normalizing a number:

```javascript
const n = '09123456789'
const normalized = normalizeNumber(n) // +989123456789
```

Persian and Arabic numbers are automatically converted:

```javascript
const n = '09۱۲3٤٥٦789'
const normalized = normalizeNumber(n) // +989123456789
```

Validate numbers while normalizing:

```javascript
const n = '0912345'
const normalized = normalizeNumber(n) // false
```

You can opt out of English digit conversion or phone number validation:

```javascript
const n = '091۲345'
const normalized = normalizeNumber(n, { forceEnDigits: false, validate: false }) // +9891۲345
```

Separate functions for other use cases:

```javascript
import { faToEnDigits, isValidPersianPhoneNumber } from 'persian-phone-number-normalizer'
// or
const { faToEnDigits, isValidPersianPhoneNumber } = require("persian-phone-number-normalizer")

const input = '۱۲۳۴'
const pin = faToEnDigits(input) // 1234

const phoneNumber = '۰۹۱۲۳۴۵۶۷۸۹'
const isValid = isValidPersianPhoneNumber(phoneNumber) // true
const isStrictValid = isValidPersianPhoneNumber(phoneNumber, { normalize: false }) // false
```

If you want to report any issues or request features, please open an issue on GitHub.

Contributions are also welcomed.

## Development

This project was created using `bun init` in bun v1.3.11. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

To install dependencies:

```bash
bun install
```

To bundle:

```bash
bun run build
```

Generate types:

```bash
tsc
```

Lint without applying:

```bash
bun lint
```

Lint with applying safe fixes and formatting:

```bash
bun format
```

Run unit tests:

```bash
bun test --concurrent --randomize
```

In order to publish package:

```bash
npm login
```

Create tarball and check before publishing:
```bash
bun pm pack
```

Publish to npm:

```bash
bun publish
```

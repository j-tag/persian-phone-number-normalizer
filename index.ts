/**
 * Normalize phone number to use this format: +989123456789. By default, this
 * function will convert Persian and Arabic numbers to English counterparts
 * unless you opt out of this behavior using `{forceEnDigits: false}` option.
 * In addition to that, this function will validate the phone number to be valid.
 * The validation is not comprehensive, and it only checks for prefix and length.
 * You can opt out of validation by using `{validate: false}` option.
 *
 * For example this phone number: `09123456789` will be converted to `+989123456789`.
 * This one: `912۳۴۵6789` will be converted to `+989123456789`.
 * This one: `123456789` will return false because it doesn't have the correct prefix.
 * This one: `0912345678` will also return false because it doesn't have the correct length.
 * @param input The phone number.
 * @param options
 */
export function normalizeNumber(
	input: string,
	options?: { forceEnDigits: boolean; validate: boolean },
): string | false {
  const enDigits = (() => {
    if (options?.forceEnDigits === false) {
      return input
    }

    return faToEnDigits(input)
  })()

  const normalized = (() => {
    if (enDigits.startsWith("+98")) {
      return enDigits
    } else if (enDigits.startsWith("098")) {
      return `+${enDigits.substring(1)}`
    } else if (enDigits.startsWith("98")) {
      return `+${enDigits}`
    } else if (enDigits.startsWith("09")) {
      return `+98${enDigits.substring(1)}`
    } else if (enDigits.startsWith("9")) {
      return `+98${enDigits}`
    }
    return false
  })()

  if (normalized === false) {
    return false
  }

  if (options?.validate === false) {
    return normalized
  }

  /**
   * At this point we have the normalized number so there is no need to normalize again
   * inside the validator function.
   */
  if (isValidPersianPhoneNumber(normalized, { normalize: false })) {
    return normalized
  }

  return false
}

/**
 * Normalizes a number and check its length and initial characters to match `+989`.
 * Phone number length after internal normalization should be exactly 13 characters
 * including the first + sign. If you want to strict check without normalization,
 * you can pass `{normalize: false}` option to opt out of this behavior.
 *
 * For example this number is valid: `0912۳۴۵6789` because after internal normalization
 * it'll have the correct length and prefix. But this number is not valid: `+98912345678`
 * because it doesn't have the correct length even after the internal normalization.
 *
 * @param input The phone number.
 * @param options
 */
export function isValidPersianPhoneNumber(
  input: string,
  options?: { normalize: boolean },
): boolean {
  const phoneNumber = (() =>
    options?.normalize === false ? input : normalizeNumber(input))()
  if (phoneNumber === false) {
    return false
  }
  return (
    phoneNumber.startsWith("+989") &&
    phoneNumber.length === 13 &&
    /**
     * This will make sure something like "123 456" is not passed successfully.
     */
    `+${parseInt(phoneNumber, 10)}` === phoneNumber
  )
}

/**
 * Convert Persian and Arabic numbers to English counterparts.
 * @param input The phone number.
 */
export function faToEnDigits(input: string): string {
  const persian = "۰۱۲۳۴۵۶۷۸۹"
  const arabic = "٠١٢٣٤٥٦٧٨٩"

  return input.replace(/[۰-۹٠-٩]/g, (char) => {
    const pIndex = persian.indexOf(char)
    if (pIndex !== -1) return String(pIndex)

    const aIndex = arabic.indexOf(char)
    if (aIndex !== -1) return String(aIndex)

    return char
  })
}

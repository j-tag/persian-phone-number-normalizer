import { expect, test } from "bun:test"
import {
  enToFaDigits,
  faToEnDigits,
  isValidPersianPhoneNumber,
  normalizeNumber,
} from "./index.ts"

test("Should convert Persian and Arabic numbers to English", () => {
  expect(faToEnDigits("۹۱234٥6789")).toBe("9123456789")
  expect(faToEnDigits("Hello ۹۱234٥6789")).toBe("Hello 9123456789")
  expect(faToEnDigits("سلام ۹۱234٥6789")).toBe("سلام 9123456789")
})

test("Should convert all English digits to Persian", () => {
  expect(enToFaDigits("0123456789")).toBe("۰۱۲۳۴۵۶۷۸۹")
  expect(enToFaDigits("+989123456789")).toBe("+۹۸۹۱۲۳۴۵۶۷۸۹")
})

test("Should preserve other characters when converting English digits", () => {
  expect(enToFaDigits("Hello 012-345 (6789)!")).toBe("Hello ۰۱۲-۳۴۵ (۶۷۸۹)!")
  expect(enToFaDigits("سلام ۹۱234٥6789")).toBe("سلام ۹۱۲۳۴٥۶۷۸۹")
  expect(enToFaDigits("۰۱۲۳۴۵۶۷۸۹ ٠١٢٣٤٥٦٧٨٩")).toBe("۰۱۲۳۴۵۶۷۸۹ ٠١٢٣٤٥٦٧٨٩")
  expect(enToFaDigits("Hello سلام")).toBe("Hello سلام")
  expect(enToFaDigits("")).toBe("")
})

test("Should validate numbers correctly", () => {
  expect(isValidPersianPhoneNumber("+989123456789")).toBeTrue()
  expect(isValidPersianPhoneNumber("0989123456789")).toBeTrue()
  expect(isValidPersianPhoneNumber("09123456789")).toBeTrue()
  expect(isValidPersianPhoneNumber("9123456789")).toBeTrue()
  expect(isValidPersianPhoneNumber("123456789")).toBeFalse()
  expect(isValidPersianPhoneNumber("09123 456789")).toBeFalse()
  expect(isValidPersianPhoneNumber("09123a56789")).toBeFalse()
  expect(
    isValidPersianPhoneNumber("09123456789", { normalize: false }),
  ).toBeFalse()
  expect(
    isValidPersianPhoneNumber("9123456789", { normalize: true }),
  ).toBeTrue()
})

test("Should normalize numbers correctly", () => {
  expect(normalizeNumber("+989123456789")).toBe("+989123456789")
  expect(normalizeNumber("0989123456789")).toBe("+989123456789")
  expect(normalizeNumber("09123456789")).toBe("+989123456789")
  expect(normalizeNumber("9123456789")).toBe("+989123456789")
  expect(normalizeNumber("123456789")).toBeFalse()
})

test("Should normalize numbers correctly with different options", () => {
  expect(
    normalizeNumber("9۱۲۳456", { forceEnDigits: false, validate: false }),
  ).toBe("+989۱۲۳456")
  expect(
    normalizeNumber("۱۲۳456789", { forceEnDigits: false, validate: false }),
  ).toBeFalse()
  expect(
    normalizeNumber("09123456789", { forceEnDigits: false, validate: true }),
  ).toBe("+989123456789")
  expect(
    normalizeNumber("91234567۸9", { forceEnDigits: false, validate: true }),
  ).toBeFalse()
  expect(
    normalizeNumber("912۳۴5٦٧89", { forceEnDigits: true, validate: false }),
  ).toBe("+989123456789")
  expect(
    normalizeNumber("912345۶۷", { forceEnDigits: true, validate: false }),
  ).toBe("+9891234567")
  expect(
    normalizeNumber("091234567۸۹", { forceEnDigits: true, validate: true }),
  ).toBe("+989123456789")
  expect(
    normalizeNumber("123۴۵6789", { forceEnDigits: true, validate: true }),
  ).toBeFalse()
  expect(normalizeNumber("123۴۵6789", { validate: true })).toBeFalse()
  expect(normalizeNumber("123۴۵6789", { forceEnDigits: true })).toBeFalse()
  expect(
    normalizeNumber("912345۶۷", {
      forceEnDigits: true,
      validate: false,
      prefix: "09",
    }),
  ).toBe("091234567")
  expect(
    normalizeNumber("091234567۸۹", {
      forceEnDigits: true,
      validate: true,
      prefix: "989",
    }),
  ).toBe("989123456789")
})

test("Should apply prefix correctly to number", () => {
  expect(normalizeNumber("9۱۲۳456789", { prefix: "9" })).toBe("9123456789")
  expect(normalizeNumber("9125647788", { prefix: "09" })).toBe("09125647788")
  expect(normalizeNumber("09123456789", { prefix: "989" })).toBe("989123456789")
  expect(normalizeNumber("91234567۸9", { prefix: "0989" })).toBe(
    "0989123456789",
  )
  expect(normalizeNumber("912۳۴5٦٧89", { prefix: "+989" })).toBe(
    "+989123456789",
  )
})

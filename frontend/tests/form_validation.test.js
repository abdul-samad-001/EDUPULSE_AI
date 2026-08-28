/**
 * EduPulse AI - Form Validation State Machine Tests
 * Validates email formatting, password strength constraints, field presence, and error states for Login and Signup forms.
 */

import assert from "node:assert";
import process from "node:process";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginForm({ email, password }) {
  const errors = {};
  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateSignupForm({ name, email, password, confirmPassword }) {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = "Full name is required";
  }

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function runFormValidationTests() {
  const testResults = [];

  function test(name, fn) {
    const start = process.hrtime.bigint();
    try {
      fn();
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1e6;
      testResults.push({ name, status: "PASSED", durationMs });
    } catch (err) {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1e6;
      testResults.push({ name, status: "FAILED", durationMs, error: err.message });
      throw err;
    }
  }

  // 1. Email Format Validation
  test("Form Validation: Rejects invalid email strings (missing @, missing domain, spaces)", () => {
    assert.strictEqual(EMAIL_REGEX.test("invalid_email"), false);
    assert.strictEqual(EMAIL_REGEX.test("user@"), false);
    assert.strictEqual(EMAIL_REGEX.test("@domain.com"), false);
    assert.strictEqual(EMAIL_REGEX.test("user@domain"), false);
  });

  test("Form Validation: Accepts standard valid email addresses", () => {
    assert.strictEqual(EMAIL_REGEX.test("student@edupulse.ai"), true);
    assert.strictEqual(EMAIL_REGEX.test("abdul.samad@college.edu"), true);
  });

  // 2. Login Form Validation Rules
  test("Form Validation: Login validates required fields and password length", () => {
    const emptyForm = validateLoginForm({ email: "", password: "" });
    assert.strictEqual(emptyForm.isValid, false);
    assert.strictEqual(emptyForm.errors.email, "Email is required");
    assert.strictEqual(emptyForm.errors.password, "Password is required");

    const shortPass = validateLoginForm({ email: "student@edupulse.ai", password: "123" });
    assert.strictEqual(shortPass.isValid, false);
    assert.strictEqual(shortPass.errors.password, "Password must be at least 6 characters");

    const validLogin = validateLoginForm({ email: "student@edupulse.ai", password: "password123" });
    assert.strictEqual(validLogin.isValid, true);
    assert.strictEqual(Object.keys(validLogin.errors).length, 0);
  });

  // 3. Signup Form Validation Rules
  test("Form Validation: Signup validates password matching confirmation", () => {
    const mismatch = validateSignupForm({
      name: "Abdul Samad",
      email: "samad@edupulse.ai",
      password: "password123",
      confirmPassword: "password456",
    });
    assert.strictEqual(mismatch.isValid, false);
    assert.strictEqual(mismatch.errors.confirmPassword, "Passwords do not match");

    const match = validateSignupForm({
      name: "Abdul Samad",
      email: "samad@edupulse.ai",
      password: "password123",
      confirmPassword: "password123",
    });
    assert.strictEqual(match.isValid, true);
  });

  test("Form Validation: Signup validates required student profile fields", () => {
    const missingName = validateSignupForm({
      name: "",
      email: "samad@edupulse.ai",
      password: "password123",
    });
    assert.strictEqual(missingName.isValid, false);
    assert.strictEqual(missingName.errors.name, "Full name is required");
  });

  return testResults;
}

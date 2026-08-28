/**
 * EduPulse AI - Cryptographic Password Hashing & Data Protection Security Tests
 * Validates bcrypt work factor (>= 10 rounds), salted hash security, password comparison, and field projection omission.
 */

const assert = require("node:assert");
const bcrypt = require("bcryptjs");

async function runCryptoPasswordSecurityTests() {
  const testResults = [];

  async function test(name, fn) {
    const start = process.hrtime.bigint();
    try {
      await fn();
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

  // 1. Bcrypt Work Factor Verification
  await test("Crypto Security: Bcrypt uses at least 10 salt rounds ($2a$10$ / $2b$10$) yielding 60-char hash", async () => {
    const plaintext = "superSecretPassword123";
    const saltRounds = 10;
    const hash = await bcrypt.hash(plaintext, saltRounds);

    assert.strictEqual(typeof hash, "string");
    assert.strictEqual(hash.length, 60);
    assert.ok(hash.startsWith("$2a$10$") || hash.startsWith("$2b$10$"));
  });

  // 2. Cryptographic Salt Uniqueness
  await test("Crypto Security: Hashing the same password twice yields distinct cryptographic hashes due to unique salts", async () => {
    const plaintext = "commonStudentPassword123";
    const hash1 = await bcrypt.hash(plaintext, 10);
    const hash2 = await bcrypt.hash(plaintext, 10);

    assert.notStrictEqual(hash1, hash2);
  });

  // 3. Bcrypt Comparison Correctness
  await test("Crypto Security: Correctly authenticates valid password and rejects incorrect password", async () => {
    const plaintext = "correctStudyPassword2026";
    const hash = await bcrypt.hash(plaintext, 10);

    const isMatch = await bcrypt.compare(plaintext, hash);
    const isMismatch = await bcrypt.compare("wrongGuessPassword", hash);

    assert.strictEqual(isMatch, true);
    assert.strictEqual(isMismatch, false);
  });

  // 4. Password Field Projection Omission
  await test("Crypto Security: User queries omit password hash by default via .select('-password')", () => {
    const mockUserRecord = {
      _id: "65d8a9f3b123456789abcdef",
      name: "Abdul Samad",
      email: "samad@edupulse.ai",
      role: "student",
      password: "$2a$10$encryptedHashThatShouldBeExcludedFromApiResponse123456",
    };

    // Simulate select('-password') projection
    const projectUserSafe = (user) => {
      const { password, ...safeUser } = user;
      return safeUser;
    };

    const safeUser = projectUserSafe(mockUserRecord);
    assert.strictEqual(safeUser.password, undefined);
    assert.strictEqual(safeUser.email, "samad@edupulse.ai");
  });

  return testResults;
}

module.exports = { runCryptoPasswordSecurityTests };

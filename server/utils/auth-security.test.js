import test from "node:test";
import assert from "node:assert/strict";

import { getPublicUser, requireSessionSecret } from "./auth-security.js";

const testUser = {
  id: 1,
  username: "example-user",
  avatarurl: "https://example.com/avatar.png",
  githubid: 12345,
  accesstoken: "fake-test-token",
  email: "example@example.com",
};

// Session secret validation

test("rejects a missing session secret", () => {
  assert.throws(() => requireSessionSecret(undefined));
});

test("rejects empty and whitespace-only secrets", () => {
  assert.throws(() => requireSessionSecret(""));
  assert.throws(() => requireSessionSecret("   "));
});

test("rejects the known default session secret", () => {
  assert.throws(() => requireSessionSecret("codepath"));
  assert.throws(() => requireSessionSecret(" codepath "));
});

test("accepts a configured non-default session secret", () => {
  const secret = "example-non-default-test-secret";

  assert.equal(requireSessionSecret(secret), secret);
});

// Authenticated user data protection

test("preserves the three required user fields", () => {
  assert.deepEqual(getPublicUser(testUser), {
    id: 1,
    username: "example-user",
    avatarurl: "https://example.com/avatar.png",
  });
});

test("excludes the GitHub OAuth access token", () => {
  const result = getPublicUser(testUser);

  assert.equal(Object.hasOwn(result, "accesstoken"), false);
});

test("excludes additional database fields", () => {
  const result = getPublicUser(testUser);

  assert.equal(Object.hasOwn(result, "githubid"), false);
  assert.equal(Object.hasOwn(result, "email"), false);
});

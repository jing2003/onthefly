export const getPublicUser = (user) => ({
  id: user.id,
  username: user.username,
  avatarurl: user.avatarurl,
});

export const requireSessionSecret = (secret) => {
  if (!secret?.trim() || secret.trim() === "codepath") {
    throw new Error(
      "SESSION_SECRET must be configured with a non-default value.",
    );
  }

  return secret;
};

import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { Strategy as GitHubStrategy } from "passport-github2";
import { pool } from "./database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!clientID) {
  throw new Error("GITHUB_CLIENT_ID is missing. Add it to the root .env file.");
}

if (!clientSecret) {
  throw new Error(
    "GITHUB_CLIENT_SECRET is missing. Add it to the root .env file.",
  );
}

const options = {
  clientID,
  clientSecret,
  callbackURL: "http://localhost:3001/auth/github/callback",
};

const verify = async (accessToken, refreshToken, profile, callback) => {
  const {
    _json: { id, login, avatar_url },
  } = profile;

  const userData = {
    githubId: id,
    username: login,
    avatarUrl: avatar_url,
    accessToken,
  };

  try {
    const userResults = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [userData.username],
    );

    const user = userResults.rows[0];

    if (user) {
      return callback(null, user);
    }

    const insertResults = await pool.query(
      `
        INSERT INTO users (
          githubid,
          username,
          avatarurl,
          accesstoken
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      [
        userData.githubId,
        userData.username,
        userData.avatarUrl,
        userData.accessToken,
      ],
    );

    const newUser = insertResults.rows[0];

    return callback(null, newUser);
  } catch (error) {
    console.error("GitHub authentication error:", error.message);
    return callback(error);
  }
};

export const GitHub = new GitHubStrategy(options, verify);

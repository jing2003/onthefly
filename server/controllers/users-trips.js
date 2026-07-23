import { pool } from "../config/database.js";

const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    githubid BIGINT NOT NULL,
    username VARCHAR(200) NOT NULL UNIQUE,
    avatarurl VARCHAR(500),
    accesstoken VARCHAR(500) NOT NULL
  );
`;

const createUsersTripsTableQuery = `
  CREATE TABLE IF NOT EXISTS users_trips (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL,
    username TEXT NOT NULL,
    CONSTRAINT fk_users_trips_trip
      FOREIGN KEY (trip_id)
      REFERENCES trips(id)
      ON DELETE CASCADE,
    CONSTRAINT unique_trip_user
      UNIQUE (trip_id, username)
  );
`;

const createUsersTables = async () => {
  try {
    await pool.query(createUsersTableQuery);
    console.log("✅ users table ready");

    await pool.query(createUsersTripsTableQuery);
    console.log("✅ users_trips table ready");
  } catch (error) {
    console.error("🚫 Unable to create user tables:", error.message);
  }
};

createUsersTables();

export const createTripUser = async (req, res) => {
  try {
    const tripId = Number.parseInt(req.params.trip_id, 10);
    const { username } = req.body;

    if (Number.isNaN(tripId)) {
      return res.status(400).json({
        error: "A valid trip ID is required.",
      });
    }

    if (!username?.trim()) {
      return res.status(400).json({
        error: "A GitHub username is required.",
      });
    }

    const tripResults = await pool.query("SELECT id FROM trips WHERE id = $1", [
      tripId,
    ]);

    if (tripResults.rows.length === 0) {
      return res.status(404).json({
        error: "Trip not found.",
      });
    }

    const results = await pool.query(
      `
        INSERT INTO users_trips (trip_id, username)
        VALUES ($1, $2)
        RETURNING *
      `,
      [tripId, username.trim()],
    );

    console.log("🆕 Added user to trip");

    return res.status(201).json(results.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "This user is already a traveler on this trip.",
      });
    }

    console.error("🚫 Unable to add user to trip:", error.message);

    return res.status(409).json({
      error: error.message,
    });
  }
};

export const getTripUsers = async (req, res) => {
  try {
    const tripId = Number.parseInt(req.params.trip_id, 10);

    if (Number.isNaN(tripId)) {
      return res.status(400).json({
        error: "A valid trip ID is required.",
      });
    }

    const results = await pool.query(
      `
        SELECT *
        FROM users_trips
        WHERE trip_id = $1
        ORDER BY id ASC
      `,
      [tripId],
    );

    return res.status(200).json(results.rows);
  } catch (error) {
    console.error("🚫 Unable to get trip users:", error.message);

    return res.status(409).json({
      error: error.message,
    });
  }
};

export const getUserTrips = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username?.trim()) {
      return res.status(400).json({
        error: "A username is required.",
      });
    }

    const results = await pool.query(
      `
        SELECT t.*
        FROM users_trips AS ut
        INNER JOIN trips AS t
          ON ut.trip_id = t.id
        WHERE ut.username = $1
        ORDER BY t.id ASC
      `,
      [username],
    );

    return res.status(200).json(results.rows);
  } catch (error) {
    console.error("🚫 Unable to get user's trips:", error.message);

    return res.status(409).json({
      error: error.message,
    });
  }
};

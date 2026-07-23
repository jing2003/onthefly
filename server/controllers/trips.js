import { pool } from "../config/database.js";

const createTrip = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      title,
      description,
      img_url,
      num_days,
      start_date,
      end_date,
      total_cost,
      username,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        error: "A trip title is required.",
      });
    }

    if (!username?.trim()) {
      return res.status(400).json({
        error: "An authenticated username is required.",
      });
    }

    await client.query("BEGIN");

    const tripResults = await client.query(
      `
        INSERT INTO trips (
          title,
          description,
          img_url,
          num_days,
          start_date,
          end_date,
          total_cost
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
      [
        title.trim(),
        description,
        img_url,
        num_days,
        start_date,
        end_date,
        total_cost,
      ],
    );

    const newTrip = tripResults.rows[0];

    await client.query(
      `
        INSERT INTO users_trips (trip_id, username)
        VALUES ($1, $2)
        RETURNING *
      `,
      [newTrip.id, username.trim()],
    );

    await client.query("COMMIT");

    console.log("🆕 New trip created and creator added as traveler");

    return res.status(201).json(newTrip);
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("🚫 Unable to create trip:", error.message);

    return res.status(409).json({
      error: error.message,
    });
  } finally {
    client.release();
  }
};

const getTrips = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM trips ORDER BY id ASC");

    return res.status(200).json(results.rows);
  } catch (error) {
    console.error("🚫 Unable to get all trips:", error.message);

    return res.status(409).json({
      error: error.message,
    });
  }
};

const getTrip = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "A valid trip ID is required.",
      });
    }

    const results = await pool.query("SELECT * FROM trips WHERE id = $1", [id]);

    if (results.rows.length === 0) {
      return res.status(404).json({
        error: "Trip not found.",
      });
    }

    return res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error("🚫 Unable to get trip:", error.message);

    return res.status(409).json({
      error: error.message,
    });
  }
};

const updateTrip = async (req, res) => {
  try {
    const {
      title,
      description,
      img_url,
      num_days,
      start_date,
      end_date,
      total_cost,
    } = req.body;

    const id = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "A valid trip ID is required.",
      });
    }

    const results = await pool.query(
      `
        UPDATE trips
        SET
          title = $1,
          description = $2,
          img_url = $3,
          num_days = $4,
          start_date = $5,
          end_date = $6,
          total_cost = $7
        WHERE id = $8
        RETURNING *
      `,
      [
        title,
        description,
        img_url,
        num_days,
        start_date,
        end_date,
        total_cost,
        id,
      ],
    );

    if (results.rows.length === 0) {
      return res.status(404).json({
        error: "Trip not found.",
      });
    }

    console.log("✨ Trip updated");

    return res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error("🚫 Unable to update trip:", error.message);

    return res.status(409).json({
      error: error.message,
    });
  }
};

const deleteTrip = async (req, res) => {
  const client = await pool.connect();

  try {
    const id = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "A valid trip ID is required.",
      });
    }

    await client.query("BEGIN");

    await client.query("DELETE FROM activities WHERE trip_id = $1", [id]);

    await client.query("DELETE FROM users_trips WHERE trip_id = $1", [id]);

    await client.query("DELETE FROM trips_destinations WHERE trip_id = $1", [
      id,
    ]);

    const results = await client.query(
      "DELETE FROM trips WHERE id = $1 RETURNING *",
      [id],
    );

    if (results.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        error: "Trip not found.",
      });
    }

    await client.query("COMMIT");

    console.log("❌ Trip deleted");

    return res.status(200).json({
      message: "Trip deleted successfully.",
      trip: results.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("🚫 Unable to delete trip:", error.message);

    return res.status(409).json({
      error: error.message,
    });
  } finally {
    client.release();
  }
};

export default {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
};

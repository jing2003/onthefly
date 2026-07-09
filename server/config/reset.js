import { pool } from "./database.js";
import "./dotenv.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";

const currentPath = fileURLToPath(import.meta.url);
const tripsFile = fs.readFileSync(
  path.join(dirname(currentPath), "../config/data/data.json"),
);
const tripsData = JSON.parse(tripsFile);

const dropTables = async () => {
  const dropTablesQuery = `
    DROP TABLE IF EXISTS
      trips_users,
      trips_destinations,
      activities,
      destinations,
      trips,
      users
    CASCADE;
  `;

  await pool.query(dropTablesQuery);
  console.log("🗑️ old tables dropped successfully");
};

const createTripsTable = async () => {
  const createTripsTableQuery = `
    CREATE TABLE IF NOT EXISTS trips (
      id serial PRIMARY KEY,
      title varchar(100) NOT NULL,
      description varchar(500) NOT NULL,
      img_url text NOT NULL,
      num_days integer NOT NULL,
      start_date date NOT NULL,
      end_date date NOT NULL,
      total_cost money NOT NULL
    );
  `;

  await pool.query(createTripsTableQuery);
  console.log("🎉 trips table created successfully");
};

const createDestinationsTable = async () => {
  const createDestinationsTableQuery = `
    CREATE TABLE IF NOT EXISTS destinations (
      id serial PRIMARY KEY,
      destination varchar(100) NOT NULL,
      description varchar(500) NOT NULL,
      city varchar(100) NOT NULL,
      country varchar(100) NOT NULL,
      img_url text NOT NULL,
      flag_img_url text NOT NULL
    );
  `;

  await pool.query(createDestinationsTableQuery);
  console.log("🎉 destinations table created successfully");
};

const createUsersTable = async () => {
  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id serial PRIMARY KEY,
      githubid integer NOT NULL,
      username varchar(100) NOT NULL,
      avatarurl varchar(500) NOT NULL,
      accesstoken varchar(500) NOT NULL
    );
  `;

  await pool.query(createUsersTableQuery);
  console.log("🎉 users table created successfully");
};

const createActivitiesTable = async () => {
  const createActivitiesTableQuery = `
    CREATE TABLE IF NOT EXISTS activities (
      id serial PRIMARY KEY,
      trip_id int NOT NULL,
      activity varchar(100) NOT NULL,
      num_votes integer DEFAULT 0,
      FOREIGN KEY(trip_id) REFERENCES trips(id) ON DELETE CASCADE
    );
  `;

  await pool.query(createActivitiesTableQuery);
  console.log("🎉 activities table created successfully");
};

const createTripsDestinationsTable = async () => {
  const createTripsDestinationsTableQuery = `
    CREATE TABLE IF NOT EXISTS trips_destinations (
      trip_id int NOT NULL,
      destination_id int NOT NULL,
      PRIMARY KEY (trip_id, destination_id),
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE ON DELETE CASCADE,
      FOREIGN KEY (destination_id) REFERENCES destinations(id) ON UPDATE CASCADE ON DELETE CASCADE
    );
  `;

  await pool.query(createTripsDestinationsTableQuery);
  console.log("🎉 trips_destinations table created successfully");
};

const createTripsUsersTable = async () => {
  const createTripsUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS trips_users (
      trip_id int NOT NULL,
      user_id int NOT NULL,
      PRIMARY KEY (trip_id, user_id),
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
    );
  `;

  await pool.query(createTripsUsersTableQuery);
  console.log("🎉 trips_users table created successfully");
};

const seedTripsTable = async () => {
  for (const trip of tripsData) {
    const insertQuery = `
      INSERT INTO trips (
        title,
        description,
        img_url,
        num_days,
        start_date,
        end_date,
        total_cost
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7);
    `;

    const values = [
      trip.title,
      trip.description,
      trip.img_url,
      trip.num_days,
      trip.start_date,
      trip.end_date,
      trip.total_cost,
    ];

    await pool.query(insertQuery, values);
    console.log(`✅ ${trip.title} added successfully`);
  }
};

const resetDatabase = async () => {
  try {
    await dropTables();

    await createTripsTable();
    await createDestinationsTable();
    await createUsersTable();
    await createActivitiesTable();
    await createTripsDestinationsTable();
    await createTripsUsersTable();

    await seedTripsTable();

    console.log("✅ database reset successfully");
  } catch (err) {
    console.error("⚠️ error resetting database", err);
  } finally {
    pool.end();
  }
};

resetDatabase();

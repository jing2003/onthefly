import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";

import { GitHub } from "./config/auth.js";

import authRoutes from "./routes/auth.js";
import tripRoutes from "./routes/trips.js";
import activityRoutes from "./routes/activities.js";
import destinationRoutes from "./routes/destinations.js";
import tripDestinationRoutes from "./routes/trips-destinations.js";
import userTripRoutes from "./routes/users-trips.js";

const app = express();

const isProduction = process.env.NODE_ENV === "production";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "codepath",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(GitHub);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      '<h1 style="text-align: center; margin-top: 50px;">✈️ OnTheFly API</h1>',
    );
});

app.use("/auth", authRoutes);

app.use("/api/trips", tripRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/trips-destinations", tripDestinationRoutes);
app.use("/api/users-trips", userTripRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

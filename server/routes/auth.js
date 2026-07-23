import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/login/success", (req, res) => {
  if (req.user) {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  }

  return res.status(401).json({
    success: false,
    user: null,
    message: "User is not authenticated",
  });
});

router.get("/login/failed", (req, res) => {
  return res.status(401).json({
    success: false,
    message: "GitHub authentication failed",
  });
});

router.get("/logout", (req, res, next) => {
  req.logout((logoutError) => {
    if (logoutError) {
      return next(logoutError);
    }

    req.session.destroy((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      res.clearCookie("connect.sid", {
        path: "/",
      });

      return res.status(200).json({
        status: "logout",
        user: null,
      });
    });
  });
});

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["read:user"],
  }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:5173/",
  }),
  (req, res) => {
    res.redirect("http://localhost:5173/");
  },
);

export default router;

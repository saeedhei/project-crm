
const express = require("express");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios"); // Install axios for API calls (if needed)

const router = express.Router();

// Install and configure environment variables for JWT secret
require("dotenv").config();

// Configure passport strategy for JWT
passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Adjust extraction method as needed
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        // Optional: Fetch user data from API if needed (based on payload)
        // ...

        // If user data is already available (e.g., from req.user)
        if (req.user) {
          return done(null, req.user); // Pass through existing user object
        } else {
          return done(null, false); // User not found or invalid token
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Login endpoint with user data retrieval and password verification
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user data from API using email
    // const userResponse = await axios.get(`http://localhost:3000/api/users/${email}`);
    const userResponse = await axios.get(
      `http://localhost:3000/api/users/662cce164633c07cd6c67794`
    );
    const user = userResponse.data;

    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    // Verify password using bcrypt
    const validPassword = await bcrypt.compare(password, user.password); // Assuming password is stored hashed in the API response
    if (!validPassword) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    // Generate JWT token on successful login
    const payload = { id: user.id, email: user.email }; // Customize token payload as needed

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    }); // Adjust expiration time

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/test", function (req, res, next) {
  res.json({ message: "You are authorized to access this protected route." });
});

// ... other routes (e.g., user creation as discussed previously)

module.exports = router;

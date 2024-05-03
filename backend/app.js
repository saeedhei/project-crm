var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const cors = require("cors"); // a
const jwt = require("jsonwebtoken"); // a
const axios = require("axios"); // a

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
// var authRouter = require("./routes/auth");

const passport = require("passport");
require("dotenv").config();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cors()); // a
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
// app.use("/auth", authRouter);

const db = require("./api/models");
db.mongoose
  .connect(db.url, {})
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });



  // const updateUsernames = async () => {
  //   try {
  //     const documents = await db.tutorials.find({}); 
  //     for (const doc of documents) {
  //       doc.username = "saeed"; 
  //       await doc.save(); 
  //     }
  //     console.log("Updated usernames for all documents");
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  // updateUsernames();

require("./api/routes/turorial.routes")(app);

const secretKey = process.env.JWT_SECRET;

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await axios.get(`http://localhost:3000/api/users/${email}`);

    const user = response.data;

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
   
    // Validate the password (replace with your password hashing logic)
    // const isValidPassword = password === user.password; // (Implement secure hashing)
    // if (!isValidPassword) {
    //   return res.status(401).json({ message: "Invalid credentials" });
    // }

    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Protected endpoint (replace with your actual protected route logic)
app.get("/api/protected", (req, res) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secretKey); // Verify JWT token
    const userId = decoded.userId;

    // Perform actions using the user ID (e.g., fetch user data)
    // ... your protected route logic ...

    res.json({ message: `Success! You accessed a protected resource. id: "${userId}"`});
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      // Handle invalid or expired token
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});
app.get('/api/auth/validate', async (req, res) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey); // Verify signature
    if (decoded.exp < Date.now() / 1000) { // Check expiration
      return res.status(401).json({ message: 'Token expired' });
    }
    // Optional: Additional payload checks if needed
    return res.json({ isValid: true });
  } catch (error) {
    console.error('Error validating token:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

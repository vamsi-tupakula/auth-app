const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbConnect = require("./db/dbConnect");
dbConnect();
const UserCollection = require("./models/user.model");
const auth = require("./auth");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is a testing route.");
});

app.post("/api/register", (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(400).send({ status: "err", message: "all fields are required" });
    return;
  }

  bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword) => {
      const user = new UserCollection({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      user
        .save()
        .then((result) => {
          res.status(201).send({ status: "user created successfully", user });
        })
        .catch(() => {
          res
            .status(500)
            .send({ status: "error", message: "Error creating user." });
        });
    })
    .catch(() => {
      res
        .status(500)
        .send({ status: "error", message: "Error hashing the password." });
    });
});

app.post("/api/login", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send({ status: "err", message: "all fields are required" });
  }

  UserCollection.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res
        .status(404)
        .send({ status: "error", message: "user not found" });
    }

    bcrypt
      .compare(req.body.password, user.password)
      .then((passwordCheck) => {
        if (!passwordCheck) {
          return res
            .status(400)
            .send({ status: "error", message: "invalid password" });
        }

        const token = jwt.sign(
          {
            userId: user._id,
            userEmail: user.email,
          },
          "RANDOM-TOKEN",
          { expiresIn: "24h" }
        );

        res
          .status(200)
          .send({ message: "login successful", email: user.emai, token });
      })
      .catch(() => {
        res
          .status(500)
          .send({ status: "error", message: "Internal server error" });
      });
  });
});

app.get("/api/public-endpoint", (req, res) => {
  res.send("This is a public end point");
});

app.get("/api/private-endpoint", auth, (req, res) => {
  res.send("This is a private end point");
});

module.exports = app;

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const restricted = require("../auth/restricted-middleware");

const usersRouter = require("../users/users-router");
const authRouter = require("../auth/auth-router");

const server = express();

const sessionConfig = {
  name: "cookie-monster",
  secret: "blueEatingMan",
  cookie: {
    maxAge: 3600 * 1000,
    secure: false, //should be true in production
    httpOnly: true,
  },
  resave: false,
  saveUnitialized: false,

  // npm i connect-session-knex (this will allow us to use connect session to knex)

  // create a store (this goes in the sessionConfig under saveUnitialized)
  // 1.) const knexSessionStore = require("connect-session-knex")(session)
  // 2.) store: new knexSessionStore(
  // {
  //   knex: require("../database/db-config"),
  //   tablename: "sessions",
  //   sidfieldname: "sid",
  //   createtable: true,
  //   clearinterval: 3600 * 1000
  // }
  // )
};

// Global Middleware
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users", restricted, usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;

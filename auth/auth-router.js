const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model");

router.post("/register", (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);

  user.password = hash;

  Users.add(user)
    .then((saved) => {
      res.status(201).json({ saved });
    })
    .catch((err) =>
      res.status(500).json({ message: "db isssues!", error: err })
    );
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = username; // confirms  thatthe username and pass was successful; then adds the username to the session (saved to store)
        res.status(200).json({ message: "Welcome!" });
      } else {
        res.status(401).json({ message: "invalid credentials!" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "db isssues!", error: err });
    });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send("unable to logout");
    } else {
      res.semd("Logged out!");
    }
  });
});

module.exports = router;

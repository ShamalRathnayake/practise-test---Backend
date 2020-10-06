const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

//User Model
const User = require("../../models/User");

//@route GET api/users
//@desc get all registered users
router.get("/", auth, (req, res) => {
  User.find().then((users) => res.json(users));
});

//@route GET api/users
//@desc get single registered users
router.get("/:id", auth, (req, res) => {
  User.findById(req.params.id, (err, user) => {
    return res.status(200).json(user);
  });
});

//@route POST api/users
//@desc register new user
router.post("/", (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    conf_password,
    phone,
    address,
  } = req.body;

  // validation
  if (
    !first_name ||
    !last_name ||
    !email ||
    !password ||
    !conf_password ||
    !phone ||
    !address
  ) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  if (password.length < 5 || conf_password.length < 5) {
    return res
      .status(400)
      .json({ msg: "The Password needs to be atleast 5 characters long" });
  }
  if (password !== conf_password) {
    return res.status(400).json({ msg: "The Passwords do not match" });
  }

  // Check for existing user
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const newUser = new User({
      first_name,
      last_name,
      email,
      password,
      phone,
      address,
    });

    //Create salt and hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          throw err;
        }
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            config.get("jwtSecret"),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) {
                throw err;
              }
              res.json({
                token,
                user: {
                  id: user.id,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email,
                  phone: user.phone,
                  address: user.address,
                },
              });
            }
          );
        });
      });
    });
  });
});

//@route PUT api/users
//@desc edit user details
router.put("/", auth, (req, res) => {
  const { _id, first_name, last_name, email, phone, address } = req.body;
  if (!_id || !first_name || !last_name || !email || !phone || !address) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  User.findById(_id).then((user) =>
    user
      .updateOne({
        first_name: first_name.toString(),
        last_name: last_name.toString(),
        email: email.toString().trim(),
        phone: phone.toString(),
        address: address.toString(),
      })
      .then(() => res.json({ success: true }))
      .catch((err) => res.status(404).json({ success: false, error: err }))
  );
});

//@route DELETE api/users
//@desc edit user details
router.delete("/:id", auth, (req, res) => {
  User.findById(req.params.id).then((user) =>
    user
      .remove()
      .then(() => res.json({ success: true }))
      .catch((err) => res.json({ success: false, error: err }))
  );
});

module.exports = router;

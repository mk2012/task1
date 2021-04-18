const express = require("express");
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

//get users data

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      // console.log("###", users);
      return res.status(200).json(
        users.map((u) => {
          return u;
        })
      );
    } else {
      res.status(404);
    }
  } catch (err) {
    console.log(err);
  }
});

//Register
router.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

//Bio
router.post("/myprofile/:id", async (req, res) => {
  let { name, description } = req.body;
  const user = await User.findById(req.params.id);
  user
    .updateOne({
      bioName: name !== undefined ? name : user.bioName,
      description: description !== undefined ? description : user.description,
    })
    .exec();
});

//Get Bio
router.get("/myprofile/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.json({ success: false, err });
  return res.status(200).json({
    oname: user.name,
    name: user.bioName,
    description: user.description,
    success: true,
    token: user.token,
    likedIds: user.likedProfileIds,
  });
});

//Login
router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Wrong password" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

//Logout
router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "", tokenExp: "" },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

module.exports = router;

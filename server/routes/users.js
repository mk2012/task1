const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { UserAction } = require("../models/UserAction");

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
  let currentUserId = req.query.userId;
  try {
    const users = await User.find();
    let notLikedUsers = [];
    await Promise.all(
      users.map(async (user) => {
        const alreadyLiked = await UserAction.find({
          likedBy: currentUserId,
          likedFor: user._id,
        });
        if (alreadyLiked.length === 0) {
          notLikedUsers.push(user);
        }
      })
    );
    if (notLikedUsers) {
      // console.log("###", users);
      return res.status(200).json(notLikedUsers);
    } else {
      res.status(404);
    }
  } catch (err) {
    console.log(err);
  }
});

//
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log(user);
    if (user) {
      console.log("********", user, "*******");
      return res.status(200).json({
        oname: user.name,
        name: user.bioName,
        description: user.description,
        success: true,
        token: user.token,
      });
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

// post Liked profiles

router.post("/useraction/", async (req, res) => {
  let { senderId, recieverId, action } = req.body;

  const useraction = new UserAction({
    likedBy: senderId,
    likedFor: recieverId,
    action: action,
  });

  useraction.save((err, doc) => {
    if (err.code === 11000)
      return res.status(422).json({ success: false, err: "DUPLICATE_ENTRY" });
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

//get liked profiles
router.get("/useraction/", async (req, res) => {
  const useraction = await UserAction.find().populate({
    path: "likedFor",
    select: "-password",
  });
  if (!useraction) return res.json({ success: false, err });
  return res.status(200).json(useraction);
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

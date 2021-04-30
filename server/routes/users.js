const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { UserAction } = require("../models/UserAction");
const { MutualProfiles } = require("../models/Mutual");

const { auth } = require("../middleware/auth");
const socketServer = require("http").createServer(router);
const io = require("socket.io")(socketServer);

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
    if (currentUserId) {
      const users = await User.find().sort({ priority: 1 }).exec();
      let notLikedUsers = [];
      await Promise.all(
        users.map(async (user) => {
          const alreadyLiked = await UserAction.find({
            likedBy: currentUserId,
            likedFor: user._id,
            action: "liked",
          });
          if (alreadyLiked.length === 0 && user._id != currentUserId) {
            notLikedUsers.push(user);
          }
        })
      );
      if (notLikedUsers) {
        return res.status(200).json(notLikedUsers);
      } else {
        res.status(404);
      }
    } else {
      const users = await User.find();
      if (!users) return res.status(404).json({ success: false });
      return res.status(200).json(users);
    }
  } catch (err) {
    console.log(err);
  }
});

//
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      // console.log("********", user, "*******");
      return res.status(200).json({
        oname: user.name,
        name: user.bioName,
        description: user.description,
        success: true,
        token: user.token,
        image: user.image,
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
    image: user.image,
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
  try {
    const useract = await UserAction.find({
      likedBy: recieverId,
      likedFor: senderId,
      action: "liked",
    });
    if (useract.length !== 0) {
      const existMutual = await MutualProfiles.find({
        user1: senderId,
        user2: recieverId,
      });
      const existMutual2 = await MutualProfiles.find({
        user1: recieverId,
        user2: senderId,
      });
      if (existMutual.length == 0 && existMutual2.length == 0) {
        let mutual = new MutualProfiles({
          user1: senderId,
          user2: recieverId,
        });

        mutual.save();

        io.on("connection", (socket) => {
          socket.on("Notify", (user) => {
            io.emit("MutualNotify", mutual);
          });
        });
      }
    }
    var alreadydisliked = await UserAction.findOne({
      likedBy: senderId,
      likedFor: recieverId,
      action: "disliked",
    });
    if (alreadydisliked) {
      var dislikedToLiked = alreadydisliked
        .updateOne({ action: "liked" })
        .exec();
    } else {
      var useraction = new UserAction({
        likedBy: senderId,
        likedFor: recieverId,
        action: action,
      });
      useraction.save();
      console.log("saved");
    }
    res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, err });
  }
});

//get liked profiles
router.get("/useraction/", async (req, res) => {
  let currentUserId = req.query.userId;
  const useraction = await UserAction.find({
    likedBy: currentUserId,
    action: "liked",
  }).populate({
    path: "likedFor",
    select: "-password",
  });
  if (!useraction) return res.json({ success: false, err });
  return res.status(200).json(useraction);
});

//delete liked profile

router.delete("/useraction", async (req, res) => {
  let currentUserId = req.query.userId;
  let deletedId = req.query.deletedId;
  const useraction = await UserAction.findOneAndDelete({
    likedBy: currentUserId,
    likedFor: deletedId,
  });
  return res.status(200).json({ success: true });
});

//get Mutual liked profile
router.get("/mutualprofile", async (req, res) => {
  let currentUserId = req.query.userId;
  var mutual = await MutualProfiles.find({
    $or: [{ user1: currentUserId }, { user2: currentUserId }],
  }).populate("user1 user2");
  // var mutual2 = await MutualProfiles.find({
  //   user2: currentUserId,
  // }).populate({
  //   path: "user1",
  //   select: "-password",
  // });
  if (mutual.length !== 0) {
    return res.json(mutual);
  }
  // if (mutual2.length !== 0) {
  //   return res.json(mutual2);
  // }

  if (mutual.length == 0) {
    return res.status(404).json({ success: false });
  }
});

//delete Mutual liked profile

router.delete("/mutualprofile", async (req, res) => {
  let mutualId = req.query.mutualProfileId;

  const mutualLikedUser = await MutualProfiles.findByIdAndDelete(mutualId);
  if (!mutualLikedUser) return res.status(404).json({ success: false });
  return res.status(200).json({ success: true });
});

// image upload

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

socketServer.listen(8003, () => {
  console.log("8003 connected");
});

module.exports = router;

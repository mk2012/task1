const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { Message } = require("../models/Chats");
const { MutualProfiles } = require("../models/Mutual");

router.get("/", async (req, res) => {
  let roomId = req.query.roomId;
  let messages = await Message.find({ roomId: roomId }).populate("userId");
  if (!messages) return res.status(404).json({ success: false });
  return res.json(messages);
});

router.get("/mutual", async (req, res) => {
  let mutualId = req.query.mutualId;
  let mutualProfile = await MutualProfiles.findById(mutualId);
  if (!mutualProfile) return res.status(404).json({ success: false });
  return res.json(mutualProfile);
});

module.exports = router;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MutualSchema = mongoose.Schema({
  user1: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: "ChatRoom",
  },
});

MutualSchema.index({ user1: 1, user2: 1, roomId: 1 }, { unique: true });
const MutualProfiles = mongoose.model("mutual", MutualSchema);
module.exports = { MutualProfiles };

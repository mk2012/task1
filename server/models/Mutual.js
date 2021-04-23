const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MutualSchema = mongoose.Schema({
  user1: {
    type: Schema.Types.ObjectId,
    ref: "UserAction",
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

MutualSchema.index({ user1: 1, user2: 1 }, { unique: true });
const MutualProfiles = mongoose.model("mutual", MutualSchema);
module.exports = { MutualProfiles };

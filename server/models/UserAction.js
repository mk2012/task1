const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserActionSchema = mongoose.Schema({
  likedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  likedFor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  action: {
    type: String,
  },
  updatedAt: {
    type: Date,
  },
});

UserActionSchema.index({ likedBy: 1, likedFor: 1 }, { unique: true });
const UserAction = mongoose.model("UserAction", UserActionSchema);
module.exports = { UserAction };

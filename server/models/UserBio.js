import mongoose from "mongoose";

const UserBioSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
});

const UserBio = mongoose.model("UserBio", UserBioSchema);

module.exports = { UserBio };

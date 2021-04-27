const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatRoomSchema = mongoose.Schema({
  name: {
    type: String,
  },
  maxCapacity: {
    type: Number,
  },
  members: {
    type: Array,
  },
});

const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
module.exports = { ChatRoom };

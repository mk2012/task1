const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = mongoose.Schema({
  roomId: {
    type: Schema.Types.ObjectId,
    ref: "ChatRoom",
  },
  message: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Message = mongoose.model("Message", MessageSchema);
module.exports = { Message };

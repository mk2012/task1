const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatRoomMembersSchema = mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: "ChatRooms",
  },
});

const ChatRoomMembers = mongoose.model(
  "ChatRoomMembers",
  ChatRoomMembersSchema
);
module.exports = { ChatRoomMembers };

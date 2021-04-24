const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = mongoose.Schema({
  name: String,
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  img: {
    data: Buffer,
    contentType: String,
  },
});

const Images = mongoose.model("Images", ImageSchema);
module.exports = { Images };

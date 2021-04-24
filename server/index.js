const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
let multer = require("multer");
const { User } = require("./models/User");

const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");
const mongoURI = require("./config/dev");

const DIR = "uploads";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

app.post("/user-profile", upload.single("image"), async (req, res, next) => {
  const id = req.query.userId;
  const url = req.protocol + "://" + req.get("host");
  const user = await User.findById(id);
  user.updateOne({ image: url + "/uploads/" + req.file.filename }).exec();
  if (!user) return res.json({ success: false });
  return res.status(200).json({
    success: true,
  });
});

app.get("/user-profile", async (req, res, next) => {
  const id = req.query.userId;
  const user = await User.findById(id);
  if (!user) return res.json({ success: false });
  return res.status(200).json({
    success: true,
    image: user.image,
  });
});

// const mongoose = require("mongoose");
// mongoose
//   .connect(config.mongoURI, { useNewUrlParser: true })
//   .then(() => console.log("DB connected"))
//   .catch(err => console.error(err));

const mongoose = require("mongoose");
const { UserAction } = require("./models/UserAction");
mongoose.connect("mongodb://localhost/wb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.once("open", () => {
  console.log("Database connected");
});
app.use(cors());

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/users", require("./routes/users"));

//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client

//**************** */
app.use("/uploads", express.static("uploads"));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  // All the javascript and css files will be read and served from this folder
  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});

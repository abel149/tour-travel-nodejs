const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejs = require("ejs");
//for the image files
const multer = require("multer");
//const upload = multer({ dest: "uplods/" });

const port = 3019;

const app = express();

app.use(express.json());
//app.use("/uplods", express.static("uplods"));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(
    "mongodb+srv://abel:abel1234@cluster0.lnvkuh8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("conected to atlas database");
  });

const bookingschema = new mongoose.Schema({
  //for the booking
  reg_no: String,
  name: String,
  email: String,
});
const feedbackschema = new mongoose.Schema({
  //for the feedback
  name: String,
  email: String,
  feed: String,
});
/*const blogschema = new mongoose.Schema({
  //for the blog
  place: String,
  date: String,
  intro: String,
  blog: String,
  
  image: {
    date: Buffer,
    contentType: String,
  },
});*/

const imageschema = new mongoose.Schema({
  place: String,
  date: String,
  intro: String,
  blog: String,

  image: {
    data: Buffer,
    contentType: String,
  },
});
const Image = mongoose.model("Image", imageschema);

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
//const Blog = mongoose.model("Blog", blogschema);
//for the image upload
/*const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/uplods");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});*/
//const storage = multer.memoryStorage();

//const upload = multer({ storage: storage });
//....
const feedback = mongoose.model("feedback", feedbackschema);

const people = mongoose.model("people", bookingschema);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/book", (req, res) => {
  res.sendFile(path.join(__dirname, "book.html"));
});
app.get("/feedback", (req, res) => {
  res.sendFile(path.join(__dirname, "feedback.html"));
});
app.get("/blog", async (req, res) => {
  // res.sendFile(path.join(__dirname, "blog.html"));

  const post = await Image.find();
  res.render("blog.ejs", { post });
});
//feach a data from the database
app.get("/admin", async (req, res) => {
  try {
    const result = await people.find();
    const response = await feedback.find();
    res.render("admin.ejs", { response, result });
  } catch (err) {
    console.log(err);
  }
});
/*app.get("/admin", async (req, res) => {
  try {
    const response = await feedback.find();
    res.render("admin.ejs", { response });
  } catch (err) {
    console.log(err);
  }
});*/

app.post("/book", async (req, res) => {
  const { reg_no, name, email } = req.body;
  const newpeople = new people({
    reg_no,
    name,
    email,
  });
  await newpeople.save();
  res.send("booked successfully");
});
app.post("/feedback", async (req, res) => {
  const { name, email, feed } = req.body;
  const newfeed = new feedback({
    name,
    email,
    feed,
  });
  await newfeed.save();
  res.send("commented successfully");
});
/*app.post("/upload", upload.single("image"), async (req, res) => {
  const { place, date, intro, blog } = req.body;

  const newblog = new Blog({
     place,
    date,
    intro,
    blog,
    
    image: {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    },
  });
  await newblog.save();

  res.send("blog posted successfully");
});*/

app.post("/upload", upload.single("image"), async (req, res) => {
  const { place, date, intro, blog } = req.body;
  const image = new Image({
    place,
    date,
    intro,
    blog,
    image: {
     // data: req.file.buffer,
     // contentType: req.file.mimetype,
    },
  });
  await image.save();

  res.send("uploaded");
});

app.listen(port, () => {
  console.log("server started");
});

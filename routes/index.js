// Route to upload from project base path
// const upload = multer({ dest: "./public/uploads/" });
// const multer = require("multer");
const express = require("express");
const router = express.Router();
const Picture = require("../models/picture");
const fs = require("fs");

const { upload } = require("../utils/cloudinary"); //destructuring used

/* GET home page */
router.get("/", function(req, res, next) {
  Picture.find({}).then(pictures => {
    res.render("index", { pictures });
  });
});

router.post("/upload", (req, res, next) => {
  // router.post("/upload", upload.single("photo"), function(req, res) {
  req.files.photo.mv(`public/uploads/${req.files.photo.name}`, function(err) {
    //moving the uploaded file with the specific name to the specified directory
    if (err) return res.status(500).send(err);

    upload(`public/uploads/${req.files.photo.name}`).then(result => {
      Picture.findOneAndUpdate(
        { name: req.body.name },
        { name: req.body.name, path: result.secure_url },
        { new: true, upsert: true, runValidators: true } //upsert means that if the name is not found a new document is created
      ).then(pic => {
        fs.unlinkSync(`public/uploads/${req.files.photo.name}`); //we do this to delete the files from the upload folder in order not to store them here in this project
        res.redirect("/");
      });
    });
  });
});

module.exports = router;

const express = require("express");
const router = new express.Router();
const verify = require("./verifyToken");
const {upload, uploadImage} = require("../controller/uploadController");


router.post("/",verify,uploadImage, upload)


module.exports = router;
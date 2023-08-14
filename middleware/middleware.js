const jwt = require("jsonwebtoken");
const multer = require("multer");
const { fileStore } = require("../config/config");
const path = require("path");

let generateOTP = () => {
  let OTP = "", i = 0
  for (; i < 4; i++) {
    OTP += Math.floor(Math.random() * 10);
  }
  return OTP;
};

let verifyToken = (req, res, next) => {
  try {
    let token, authHeader;
    authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
          res.send({ status: 0, response: "User not authorized" });
        } else {
          userInfo = payload;
          next();
        }
      });
    } else if (!token) {
      res.send({ status: 0, response: "Token not provided" });
    } else {
      res.send({ status: 0, response: "Something went wrong" });
    }
  } catch (error) {
    res.send({ status: 0, response: "something went wrong" });
  }
};

var uploadFile = multer({
  storage: fileStore,
  limits: { fileSize: 1000000 },
});

let imgUpload = [
  uploadFile.single("image"),
  (req, res, next) => {
    if (req.file) {
      let image = path.join(__dirname, "../", req.file.path);
      img = image;
      next();
    } else {
      res.status(400).send("Please upload a valid image");
    }
  },
];


let pdfUpload = [
  uploadFile.single("pdf"),
  (req, res, next) => {
    if (req.file) {
      let pdf = path.join(__dirname, "../", req.file.path);
      pdfFile = pdf;
      next();
    } else {
      res.status(400).send("Please upload a valid pdf");
    }
  },
];

let checkIfAdmin = async (req, res, next) => {
  try {
    if (userInfo.user.admin !== true) {
      return res.send({ status: 0, response: "You're not an admin" })
    }
    else {
      next()
    }
  } catch (error) {
    return res.send({status:0, response:error.message})
  }
 
}

module.exports = { generateOTP, verifyToken, imgUpload, pdfUpload, checkIfAdmin };

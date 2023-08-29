const jwt = require("jsonwebtoken");
const multer = require("multer");
const { fileStore, awsConfig } = require("../config/config.js");
const path = require("path");

const fs = require('fs');
const AWS = require('aws-sdk/');

let generateOTP, verifyToken, uploadFile, s3, imgUpload, pdfUpload, track;

generateOTP = () => {
  let OTP = "", i = 0
  for (; i < 4; i++) {
    OTP += Math.floor(Math.random() * 10);
  }
  return OTP;
};
track = (req, res, next) => {
  console.log({ url: req.url, method: req.method, Originalurl: req.originalUrl, host: req.hostname, detail: req.headers.host, body: req.body });
  next()
}


verifyToken = (req, res, next) => {
  try {
    let token, authHeader;
    authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
         return res.send({ status: 0, response: "User not authorized" });
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


uploadFile = multer({
  storage: fileStore,
  limits: { fileSize: 1000000 },
});

s3 = new AWS.S3({
  accessKeyId: awsConfig.ACCESS_KEY,
  secretAccessKey: awsConfig.SECRET_KEY
});


imgUpload = [
  uploadFile.single("image"),
  (req, res, next) => {
    if (req.file) {
      let image, reader;
      image = path.join(__dirname, "../", req.file.path);
      reader = fs.readFileSync(image);

      const params = {
        Bucket: awsConfig.BUCKET_NAME,
        Key: `image/${req.file.originalname}`,
        Body: reader,
        ACL: "public-read-write",
        ContentType: "image/jpg/pdf"
      };

      s3.upload(params, (error, data) => {
        if (error) {
          return res.send({ "err": error })
        }
        awsLink = data.Location
        next()
      })
    } else {
      res.status(400).send("Please upload a valid image");
    }
  },
];


pdfUpload = [
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


module.exports = { generateOTP, verifyToken, imgUpload, pdfUpload, track };


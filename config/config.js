require('dotenv').config()
const multer = require('multer')
const nodemailer = require('nodemailer')


let serverConnections, configMail, fileStore, awsConfig;

serverConnections = {
    MONGODB : process.env.MONGO_URL,
    PORT :  process.env.PORT
}

configMail = { 
    fromSmtp :process.env.SMTP_MAIL,
    setUp:nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_MAIL,
      pass:  process.env.SMTP_PASS,
    },
  })}

  
fileStore = multer.diskStorage({
    destination: "./uploads",
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

awsConfig = {
  ACCESS_KEY : process.env.ACCESS_KEY,
  SECRET_KEY : process.env.SECRET_KEY,
  BUCKET_NAME : process.env.BUCKET_NAME
}

module.exports = {serverConnections, fileStore, configMail, awsConfig}
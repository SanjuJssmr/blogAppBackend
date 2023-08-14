const express = require("express");
const {
  registerUser,
  verifyUsers,
  loginUser,
} = require("../controllers/userControllers");
const { userValCheck } = require("../validate/validate");
const { pdfUpload } = require("../middleware/middleware");

let userRouter = express.Router();

userRouter.post("/register", pdfUpload, userValCheck, registerUser);
userRouter.post("/verify/:id", verifyUsers);
userRouter.post("/login", loginUser);

module.exports = userRouter;

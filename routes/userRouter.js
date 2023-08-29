const express = require("express");
const userControlls = require("../controllers/userControllers");
const { userValCheck } = require("../validate/validate");
const { pdfUpload } = require("../middleware/middleware");

let userRouter = express.Router();

userRouter.post("/register", pdfUpload, userValCheck, userControlls.registerUser);
userRouter.post("/verify/:id", userControlls.verifyUsers);
userRouter.post("/login", userControlls.loginUser);
userRouter.get("/logout", userControlls.logout)

module.exports = userRouter;

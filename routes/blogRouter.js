const express = require("express");
const { verifyToken, imgUpload, track } = require("../middleware/middleware");
const blogControlls = require("../controllers/blogControllers");
const { idValCheck, blogValCheck } = require("../validate/validate");
const authVal = require('../middleware/auth.js')
let blogRouter = express.Router();

blogRouter.get("/viewAllBlogs",authVal, blogControlls.getAllBlogs);
blogRouter.get("/singleBlog", verifyToken, idValCheck, blogControlls.getSingleBlog);
blogRouter.post("/postBlog", verifyToken, imgUpload, blogValCheck, blogControlls.postBlog);
blogRouter.post("/updateBlog", verifyToken, idValCheck, blogControlls.updateBlog);
blogRouter.post("/deleteBlog", verifyToken, idValCheck, blogControlls.deleteBlog);
blogRouter.post("/comments", verifyToken, blogControlls.addComment);
blogRouter.post("/removeComment", verifyToken, idValCheck, blogControlls.deleteComment);
blogRouter.post("/reply", verifyToken, blogControlls.replieComment);
blogRouter.post("/removeReplie", verifyToken, idValCheck, blogControlls.deleteReply);

module.exports = blogRouter;

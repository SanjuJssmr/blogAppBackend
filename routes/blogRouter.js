const express = require("express");
const { verifyToken, imgUpload } = require("../middleware/middleware");
const {
  postBlog,
  updateBlog,
  addComment,
  replieComment,
  getAllBlogs,
  deleteComment,
  deleteBlog,
  deleteReply,
  getSingleBlog,
} = require("../controllers/blogControllers");
const { idValCheck, blogValCheck } = require("../validate/validate");

let blogRouter = express.Router();

blogRouter.get("/viewAllBlogs", verifyToken, getAllBlogs);
blogRouter.get("/singleBlog", verifyToken, idValCheck, getSingleBlog);
blogRouter.post("/postBlog", verifyToken, imgUpload, blogValCheck, postBlog);
blogRouter.post("/updateBlog", verifyToken, idValCheck, updateBlog);
blogRouter.post("/deleteBlog", verifyToken, idValCheck, deleteBlog);
blogRouter.post("/comments", verifyToken, addComment);
blogRouter.post("/removeComment", verifyToken, idValCheck, deleteComment);
blogRouter.post("/reply", verifyToken, replieComment);
blogRouter.post("/removeReplie", verifyToken, idValCheck, deleteReply);

module.exports = blogRouter;

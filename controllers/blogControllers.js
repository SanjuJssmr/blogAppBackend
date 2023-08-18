const Blog = require("../models/blogs.js");
const nodecache = require('node-cache')
const crypto = require('crypto')
const cache = new nodecache({ stdTTL: 10 })


const getAllBlogs = async (req, res) => {
  try {
    let getAllBlog;
    getAllBlog = await Blog.find();
    return res.send({ status: 1, response: getAllBlog });
  } catch (error) {
    return res.send({ status: 0, response: error.message });
  }
};

const getSingleBlog = async (req, res) => {
  try {
    let { id } = req.body,
      payload,
      Key,
      IV,
      decipher,
      decrypt;
      
    if (cache.has(id)) {
      console.log('from cache');
      return res.send(cache.get(id));
    }
    else {
      payload = await Blog.findById({ _id: id });
      if (!payload) {
        return res.send({ status: 0, response: "No blog found" });
      } else {
        cache.set(id, payload);
        IV = process.env.CRYPTO_IV
        Key = process.env.CRYPTO_KEY
        decipher = crypto.createDecipheriv('aes-256-cbc', Key, IV)
        decrypt = decipher.update(payload.image, "hex", "utf-8");
        decrypt += decipher.final("utf8");
        console.log('from api');
        return res.send({
          status: 1,
          response: {
            userPosted: payload.userPosted,
            title: payload.title,
            description: payload.desc,
            comments: payload.comments,
            image: decrypt,
          },
        });
      }
    }
  } catch (error) {
    return res.send({ status: 0, response: error.message });
  }
};

const postBlog = async (req, res) => {
  try {
    let { title, desc } = req.body,
      postData, encrypted, IV, Key, cipher;

    IV = process.env.CRYPTO_IV
    Key = process.env.CRYPTO_KEY
    cipher = crypto.createCipheriv('aes-256-cbc', Key, IV);
    encrypted = cipher.update(awsLink, "utf-8", "hex");
    encrypted += cipher.final("hex");

    postData = await Blog.create({
      userPosted: userInfo.user._id,
      title: title,
      desc: desc,
      image: encrypted,
    });
    return res.send({ status: 1, response: postData });
  } catch (error) {
    return res.send({ status: 0, response: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    let { title, desc, id } = req.body,
      updatedBlog,
      verifyUser;

    verifyUser = await Blog.findById({ _id: id });
    if (!verifyUser) {
      return res.send({ status: 0, response: "No blog found" });
    } else if (verifyUser.userPosted.toString() !== userInfo.user._id) {
      return res.send({ status: 0, response: "You can't edit other post" });
    } else {
      updatedBlog = await Blog.updateOne(
        { _id: id },
        { title: title, desc: desc }
      );
     return res.send({
        status: 1,
        response: "updated successfully",
        payload: updatedBlog,
      });
    }
  } catch (error) {
    return res.send({ status: 0, response: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    let { userPosted, id } = req.body;
    if (userInfo.user._id === userPosted) {
      await Blog.findByIdAndUpdate({ _id: id }, { $set: { activeStatus: 0 } });
      return res.send({
        status: 1,
        response: "Blog de-activated successfully",
      });
    }
  } catch (error) { }
};

const addComment = async (req, res) => {
  try {
    let { comment, id } = req.body;

    await Blog.findByIdAndUpdate(
      { _id: id },
      {
        $push: {
          comments: [{ userCommented: userInfo.user._id, comment: comment }],
        },
      }
    );
    return res.send({ status: 1, response: "comment added successfully" });
  } catch (error) {
    return res.send({ status: 0, response: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    let { userPosted, id, blogId } = req.body;
    if (userInfo.user._id === userPosted) {
      await Blog.findByIdAndUpdate(
        { _id: blogId },
        { $pull: { comments: { _id: id } } }
      ).then(res.send({ status: 1, response: "Comment deleted successfully" }));
    } else {
      return res.send({ status: 0, response: "You can't delete this comment" });
    }
  } catch (error) {
    return res.send({ status: 0, response: error.message });
  }
};

const replieComment = async (req, res) => {
  try {
    let { reply, blogId, id } = req.body;

    await Blog.updateOne(
      { _id: blogId, "comments._id": id },
      {
        $push: {
          "comments.$.replies": {
            userReplied: userInfo.user._id,
            reply: reply,
          },
        },
      }
    );
    return res.send({ status: 1, response: "Reply added successfully" });
  } catch (error) {
    return res.send({ status: 0, response: error.message });
  }
};

const deleteReply = async (req, res) => {
  try {
    let { userPosted, id, commentId, blogId } = req.body;
    if (userInfo.user._id === userPosted) {
      await Blog.updateOne(
        { _id: blogId, "comments._id": commentId },
        {
          $pull: {
            "comments.$.replies": {
              _id: id,
            },
          },
        }
      );
      return res.send({ status: 1, response: "Reply deleted" });
    } else {
      return res.send({ status: 0, response: "You can't delete this comment" });
    }
  } catch (error) {
    return res.send({ status: 0, response: error.message });
  }
};

module.exports = {
  postBlog,
  updateBlog,
  addComment,
  replieComment,
  getAllBlogs,
  getSingleBlog,
  deleteComment,
  deleteBlog,
  deleteReply,
};


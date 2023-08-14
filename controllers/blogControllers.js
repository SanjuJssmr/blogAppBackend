const Blog = require("../models/blogs.js");
const fs = require("fs");

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
      reader,
      base64;
    payload = await Blog.findById({ _id: id });
    if (!payload) {
      return res.send({ status: 0, response: "No blog found" });
    } else {
      reader = fs.readFileSync(payload.image);
      base64 = new Buffer.from(reader).toString("base64");
      return res.send({
        status: 1,
        response: {
          userPosted: payload.userPosted,
          title: payload.title,
          description: payload.desc,
          comments: payload.comments,
          image: base64,
        },
      });
    }
  } catch (error) {
    return res.send({ status: 0, response: error.message });
  }
};

const postBlog = async (req, res) => {
  try {
    let { title, desc } = req.body,
      postData;
    postData = await Blog.create({
      userPosted: userInfo.user._id,
      title: title,
      desc: desc,
      image: img,
    });
    res.send({ status: 1, response: postData });
  } catch (error) {
    res.send({ status: 0, response: error.message });
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
      res.send({
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

// getBlog = await Blog.aggregate([
//   { $group: { _id: blogId,   } },

// {
// $group:{_id:{"comments":id}}}

// getBlog = await Blog.findById(
//   { _id: blogId },
//   { comments: { $elemMatch: { _id: id } } }
// );

// blogsId = getBlog.comments[0]._id;

// postReply = await Blog.findOneAndUpdate(
//   { _id: blogId },
//   { "comments._id": blogsId },
//   {
//     $push: {
//       replies: [{ userReplied: userInfo.user._id, reply: reply }],
//     },
//   }
// );

// console.log(postReply);
// console.log(getBlog);

//     let ggid = getBlog.comments[0]._id.toString();
//     console.log(ggid);

//     getComment = await Blog.findOneAndUpdate(
//       { comments: { $elemMatch: { _id: id } } },
//       {
//         $push: {
//         replies: [{userReplied:userInfo.user._id,reply: reply}] },

//       },
//       { new: true }
//     );
// console.log(getComment);
// //  getBlog=   await Blog.findOneAndUpdate(
// //       { _id: blogId, "comments._id": id },
// //       { $push: { "comments.0.replies": { reply: reply } } }
// //     );

// console.log(getComment);
// return res.send({
//   status: 1,
//   response: "comment added",

//   comment: getBlog,
// });


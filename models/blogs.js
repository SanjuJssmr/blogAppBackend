const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = mongoose.Schema(
  {
    userPosted: {
      type: ObjectId,
      ref: "users",
    },
    title: {
      type: String,
    },
    desc: {
      type: String,
    },
    comments: [
      {
        userCommented: {
          type: ObjectId,
          ref: "users",
        },
        comment: {
          type: String,
          default: "No comments yet",
        },
        replies: [
          {
            userReplied: {
              type: ObjectId,
              ref: "users",
            },
            reply: {
              type: String,
              default: "No replies yet",
            },
          },
        ],
      },
    ],
    image: {
      type: String,
    },
    activeStatus: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("blogs", blogSchema);

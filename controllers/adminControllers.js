const User = require('../models/users.js')
const Blog = require('../models/blogs.js')


const getAllBlogs = async (req, res) => {
    try {
        let getAllBlogs = await Blog.find();
        return res.send({ status: 1, response: getAllBlogs });
    } catch (error) {
        return res.send({ status: 0, response: error.message })
    }
}

const getAllUsers = async (req, res) => {
    try {
        let getAllUsers = await User.find();
        return res.send({ status: 1, response: getAllUsers });
    } catch (error) {
        return res.send({ status: 0, response: error.message })

    }
}

const getUsersWithBlog = async (req, res) => {
    try {

        let getUserWithBlog = await User.aggregate([
            {
                $lookup: {
                    from: "blogs",
                    localField: "_id",
                    foreignField: "userPosted",
                    as: "BlogPostedDetails",
                },
            },
        ])
        return res.send({ status: 1, response: getUserWithBlog })

    } catch (error) {
        return res.send({ status: 0, response: error.message })
    }
}

const deleteBlog = async (req, res) => {
    try {
        let { id } = req.body
        await Blog.findByIdAndUpdate({ _id: id }, { $set: { activeStatus: 0 } });
        return res.send({
            status: 1,
            response: "Blog de-activated successfully",
        });
    } catch (error) {
        return res.send({ status: 0, response: error.message })

    }
}

const deleteUser = async (req, res) => {
    try {
            await User.findByIdAndUpdate({ _id: id }, { $set: { userActiveStatus: 0 } });
            await Blog.updateMany({ userPosted: id }, { $set: { activeStatus: 0 } })
            return res.send({
                status: 1,
                response: "User and his/her blogs has been de-activated successfully",
            });

    } catch (error) {
        return res.send({ status: 0, response: error.message })
    }
}

module.exports = {getAllBlogs, getAllUsers, getUsersWithBlog, deleteBlog, deleteUser} 
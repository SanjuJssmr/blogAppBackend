const express = require('express')
const { verifyToken } = require('../middleware/middleware')
const adminControllers  = require('../controllers/adminControllers')
const { checkIfAdmin } = require('../validate/validate')

const adminRouter = express.Router()

adminRouter.get('/getAllBlogs', verifyToken, checkIfAdmin, adminControllers.getAllBlogs)
adminRouter.get('/getAllUsers', verifyToken, checkIfAdmin, adminControllers.getAllUsers)
adminRouter.get('/getUsersWithBlog', verifyToken, checkIfAdmin, adminControllers.getUsersWithBlog)
adminRouter.post('/deleteBlog', verifyToken, checkIfAdmin, adminControllers.deleteBlog)
adminRouter.post('/deleteUser', verifyToken, checkIfAdmin, adminControllers.deleteUser)

module.exports = adminRouter
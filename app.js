const express = require('express')
const mongoose = require('mongoose')
const { serverConnections } = require('./config/config')
const userRouter = require('./routes/userRouter')
const blogRouter = require('./routes/blogRouter')
require('dotenv').config()
const cors = require('cors')
const adminRouter = require('./routes/adminRouter')
const tracker = require('./track.js')

const app = express()

app.use(cors({ origin: "*" }))
app.use(express.json())
app.use('/users', userRouter)
app.use('/blogs', blogRouter)
app.use('/admin', adminRouter)

mongoose.connect(serverConnections.MONGODB).then(console.log('Mongo connected'))

app.listen(serverConnections.PORT, () => {
    console.log('Node is running');
})


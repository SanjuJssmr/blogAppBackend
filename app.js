const express = require('express')
const mongoose = require('mongoose')
const { serverConnections } = require('./config/config')
const userRouter = require('./routes/userRouter')
const blogRouter = require('./routes/blogRouter')
const path = require('path')
require('dotenv').config()
const cors = require('cors')
const adminRouter = require('./routes/adminRouter')

const app = express()

app.use(cors({ origin: "*" }))
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))
app.use('/users', userRouter)
app.use('/blogs', blogRouter)
app.use('/admin', adminRouter)

mongoose.connect(serverConnections.MONGODB).then(console.log('Mongo connected'))

app.listen(serverConnections.PORT, () => {
    console.log('Node is running');
})


// app.get('/', async (req, res) => {
//     let payload = await fetch('http://localhost:5000/', {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//         },
//     })
//     console.log(payload);
//     res.send(payload)

// })
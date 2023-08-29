const express = require('express')
const mongoose = require('mongoose')
const { serverConnections } = require('./config/config')
const userRouter = require('./routes/userRouter')
const blogRouter = require('./routes/blogRouter')
require('dotenv').config()
const cors = require('cors')
const adminRouter = require('./routes/adminRouter')
const { track } = require('./middleware/middleware')
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express()
mongoose.connect(serverConnections.MONGODB).then(console.log('Mongo connected'))

const store = new MongoDBStore({
    uri: serverConnections.MONGODB,
    collection: "mySessions",
});

app.use(
    session({
        secret: "jssmr",
        resave: false,
        saveUninitialized: false,
cookie:{
maxAge:6000000
},
        store: store,
    })
);

app.use(cors({ origin: "*" }))
app.use(express.json())
app.use(track)
app.use('/users', userRouter)
app.use('/blogs', blogRouter)
app.use('/admin', adminRouter)


app.listen(serverConnections.PORT, () => {
    console.log('Node is running');
})


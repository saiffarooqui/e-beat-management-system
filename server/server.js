require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.json({msg: "ebms goa police server running"})
})

// Routes
app.use('/user', require('./routes/userRouter'))

app.use('/beat', require('./routes/beatRouter'))

app.use('/column', require('./routes/columnRouter'))

app.use('/contact', require('./routes/contactRouter'))

// Connect to mongodb
const URI = process.env.MONGODB_URL

mongoose
    .connect(URI)
    .then(()=>{console.log("connected to mongoDB")})
    .catch (error => console.log(error));

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> {
    console.log('Server is running', PORT)
})
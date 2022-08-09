require("dotenv").config()
const express = require("express");
const app = express()
const mongoose = require("mongoose")
const authRouter = require("./routes/auth")
const userRouter = require("./routes/User")



mongoose.connect("mongodb://localhost:27017/myDb", {
    useNewUrlParser : true,
    useUnifiedTopology : true
}, ()=> {
    console.log("database connected successfully");
})

app.use(express.json())

app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)



const PORT = 4000;
app.listen(PORT, () => {
    console.log(`backend server is running on port ${PORT}`)
}) 
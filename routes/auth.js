const router = require("express").Router();
const User = require("../model/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//REGISTER
router.post("/register", async (req,res) => {
    try {

        //GENERATE NEW PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //CREATE NEW USER
        const newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword
        })

        //SAVE
        const user = await newUser.save();

        res.status(200).json(user)

    }catch(err){
        res.status(500).json(err)
    }

})


//LOGIN
router.get("/login", async (req,res) => {
    try {

        const user = await User.findOne({email : req.body.email});
        !user && res.status(404).send("user not found")

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("wrong Password")

        //GENERATE JWT
        if(validPassword) {
            const username = user.username
            const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN)
                res.json({accessToken : accessToken})
        } 

    }catch(err){
        res.status(500).json(200)
    }
})
 

//FORGET PASSWORD
router.post("/forgetPassword", async(req,res) => {

    const user = await User.findOne({email : req.body.email})
    const email = req.body.email
    if(email !== user.email){
        res.send("user not registered")
        return
    }

    const secret = process.env.ACCESS_TOKEN + user.password
    const payload = {
        email : user.email,
        id : user._id
    }

    const token = jwt.sign(user.username, process.env.ACCESS_TOKEN)
    const link = `localhost:4000/api/auth/resetPassword/${user._id}/${token}`
    res.send(link)
})


//RESET PASSWORD
router.post("/resetPassword/:id/:token", async(req,res) =>{
    const user = await User.findById(req.params.id)
    const {id, token } = req.params;
    const password = req.body.password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const secret = jwt.sign(user.username, process.env.ACCESS_TOKEN)

    try{
        const payload = await jwt.verify(token, secret)
        await User.findOneAndUpdate({id : user._id} , {password : hashedPassword})
        res.status(200).json("password reset successfully")

    }catch(err){
        res.status(500).json(err)
    }



})
  

module.exports = router;
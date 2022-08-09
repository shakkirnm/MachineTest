const router = require("express").Router()
const User = require('../model/User')
const authCheck = require("../middleware/authCheck")

//USER DETAILS
router.get("/userDetails/:id",authCheck, async (req,res) => {
    try{
        const  id = req.params.id
        const user = await User.findById(id)
        res.status(200).json(user)

    }catch(err){
        res.status(500).json(err)
    }
})





module.exports = router 
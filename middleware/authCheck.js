const jwt = require("jsonwebtoken")


module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if(token == null) return res.status(401).json("Token not available")

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if(err) res.status(403).json("Invalid Token")
        req.user = user
        next()
    })
}  
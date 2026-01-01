import jwt from "jsonwebtoken"

function verifyToken(req,res,next){
    const token = req.cookies.session
    if(!token){
        return res.status(400).json({"message":"user not authenticated"})
    }
    try{
    const isAuth = jwt.verify(token,process.env.JWT_SECRET_KEY)
    if(!isAuth){
        return res.status(400).json({"message":"user not authenticated"})
    }
    const userId = isAuth.userId
    req.user = {userId}
    next()
}
    catch(error){
        return res.status(500).json({"message":"server error",err:error})
    }
}
export default verifyToken
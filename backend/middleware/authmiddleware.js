import jwt from 'jsonwebtoken'

function Authentication(req,res,next){
    let token = req.headers.token
    const decodedData = jwt.verify(token, `${process.env.JWT}`)
    if(decodedData){
       
        next()
    }else{
        res.json({
            success:false,
            message:"you are not logged in !"
        })
    }

}

export default Authentication
import { Router } from "express";
    let count = 0
const userRouter = Router();
import {blogModel, commentModel} from "../db.js"
import jwt from 'jsonwebtoken'
import Authentication from "../middleware/authmiddleware.js";


userRouter.post('/login',async (req, res) => {
    console.log(++count)

    let {email, password} = req.body
    if(email != process.env.ADMIN_EMAIL || password != process.env.ADMIN_PASSWORD){
        return res.json({success:false, message:"invalid credentials"})
    }
   
    try{
     
        let token = jwt.sign({email},`${process.env.JWT}`)//Should not share the same secret for user and admins
        res.json({token:token, success:true})
    


    }catch(e){
        console.log(e);
        res.json({
            success:false,
            message:e.message
        })
    }

    
})

userRouter.get('/blogs',Authentication ,  async (req, res) => {
    try {
        let blogs = await blogModel.find({}).sort({createdAt: -1})
        res.json({
            blogs,
            success: true
        })

    } catch (e) {
        res.json({
            success: false,
            message: e.message
        })
    }

})

userRouter.get('/comments', Authentication ,  async (req,res)=>{
   
    try{
         let comments = await commentModel.find({ }).populate('blog').sort({createdAt:-1})

    res.json({
        success:true,
        comments
    })

    }catch(e){
        res.json({
            success:false,
            message:e.message
        })
    }
   
})

userRouter.get('/dashboard', async (req,res)=>{
    let recentblogs = await blogModel.find({}).sort({createdAt:-1}).limit(5)
try{
    let blogs = await blogModel.countDocuments()
    let drafts = await blogModel.countDocuments({isPublished:false})
    let comments= await commentModel.countDocuments()

    res.json({
        success:true,
        dashboardData:{ blogs, comments, drafts, recentblogs}
       
    })


}catch(e){
    res.json({
        success:false,
        message:e.message
    })
}
    
})

userRouter.post('/delete-comment', async (req,res)=>{
    let {id }= req.body
    try{
        await commentModel.findByIdAndDelete(id)
    res.json({
        success:true,
        message:"comment deleted !"
    })
    }catch(e){
        res.json({
            success:false,
            message:e.message
        })
    }
})


userRouter.post('/approve-comment', async (req,res)=>{
    let { id }= req.body
    try{
        await commentModel.findByIdAndUpdate(id, {isApproved:true})
    res.json({
        success:true,
        message:"comment approved successfully !"
    })
    }catch(e){
        res.json({
            success:false,
            message:e.message
        })
    }
})

export default userRouter
import { Router } from "express";
import Authentication from "../middleware/authmiddleware.js";
const blogRouter = Router();
import { blogModel, commentModel } from '../db.js'
import client from "../imagekit.js";
import fs from 'fs'
import main from "../GEMINI.js"
import upload from "../middleware/multer.js";




blogRouter.post('/create', Authentication, upload.single('image'), async (req, res) => {
    let { title, subTitle, author, description, category, isPublished } = JSON.parse(req.body.blog);
    let imageFile = req.file


    try {

        const url = await client.files.upload({ file: fs.createReadStream(req.file.path), fileName: imageFile.originalname, folder: '/blogs' });

        // URL with basic transformations
        /*const url = client.helper.buildSrc({
        urlEndpoint: 'https://ik.imagekit.io/hrdpaliwal93',
        src: `${imageFile.path}`,
    });*/
        // Result: https://ik.imagekit.io/your_imagekit_id/path/to/image.jpg?tr=w-400,h-300,c-maintain_ratio,q-80,f-webp
        const blog = await blogModel.create({
           
            title, subTitle, author, description, category, isPublished, image: url.url

        })
        res.json({
            message: "Blog created successfully!",
            
            success: true

        })

    } catch (e) {
        
        res.json({
            message: e.message,
            success: false

        })
    }



})

// blogRouter.get('/view/all', async (req, res) => {
//     try {
//         let blogs = await blogModel.find({}).sort({createdAt: -1})
//         res.json({
//             blogs,
//             success: true
//         })

//     } catch (e) {
//         res.json({
//             success: false,
//             message: e.message
//         })
//     }

// })
blogRouter.get('/all', async (req, res) => {
    try {
        let blogs = await blogModel.find({ isPublished: true })
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

blogRouter.get('/:id', async (req, res) => {
   
    try {
        let {id} = req.params
        let blog = await blogModel.findById(id)
        if (blog) {
            res.json({
                blog,
                success: true
            })
        }

    } catch (e) {
        
        res.json({

            success: false,
            message: e.message
        })
    }



})



blogRouter.post('/delete', async (req, res) => {
    let {id}= req.body
    try {
        await blogModel.findByIdAndDelete(id)

        await commentModel.deleteMany({blog:id})

        res.json({
            message: "blog deleted !",
            success: true
        })

    } catch (e) {
        res.json({
            success: false,
            message: e.message
        })
    }


})

blogRouter.post('/toggle-publish', async (req, res) => {
    let {id} = req.body
   
    try {
        const blog = await blogModel.findById(id)
        if(blog){  blog.isPublished = !blog.isPublished
        await blog.save()}
        else{
            res.json({
            success: false,
            message: "unable to find blog"
        })

        }

        res.json({
            success: true,
            message: "Blog status updated"
        })


    } catch (e) {
        res.json({
            success: false,
            message: e.message
        })
    }


})


blogRouter.post('/add-comment', async (req,res)=>{
    let {name, blog, content}  = req.body
    try{
         await commentModel.create({
        name, blog, content
    })
    res.json({
        success:true,
        message:"comment added for review"
    })

    }catch(e){
        res.json({
            success:false,
            message:e.message
        })
    }
   
})


blogRouter.post('/comments', async (req,res)=>{
    let  {blogID}  = req.body
        try{
         let comments = await commentModel.find({ blog:blogID, isApproved:true }).sort({createdAt:-1})

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
   

blogRouter.post('/generateContent', Authentication, async (req,res)=>{
    try{
        const {prompt} = req.body
        const content = await main(prompt + 'Generate a blog content for this topic in simple text format')
        res.json({
            success:true,
            content
        })
    }catch(e){
        res.json({
            success:false,
            message:e.message
        })
    }
})


export default blogRouter
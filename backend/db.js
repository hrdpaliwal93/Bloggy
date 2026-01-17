import mongoose, { mongo } from "mongoose";

try{
    mongoose.connect(`${process.env.DATABASE_URL}Bloggy`).then(console.log("database connected"))

}catch(e){
    console.error(e);
}

const schema = mongoose.Schema
const objectID = mongoose.Types.ObjectId

const blogSchema = new schema({
   
   title:{type:String, required:true },
   subTitle:String,
   author:String,
   description:{type:String, required:true},
   category:{type:String, required:true},
   image:{type:String, required:true},
   isPublished:{type:Boolean, required:true }   
    

}, {timestamps:true});


const commentSchema = new schema({

   blog:{type:objectID, ref:'blogs' , required:true},
   name:{type:String, required:true},
   content:{type:String, required:true},
   isApproved:{type:Boolean, default:false}

}, {timestamps:true});

const userSchema = new schema({
   
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true}
})


const userModel = mongoose.model('users', userSchema);
const blogModel = mongoose.model('blogs', blogSchema);
const commentModel = mongoose.model('comments', commentSchema);

export  {
    userModel,
    blogModel,
    commentModel
};
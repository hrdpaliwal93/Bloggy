import toast from "react-hot-toast";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";


function CommentTableItem({comment, fetchComments}){

    const {axios} = useAppContext()
    
    const {blog, createdAt, _id} = comment;
    const BlogDate = new Date(createdAt)
    const approveComment = async ()=>{
        try{
            const {data} = await axios.post("api/v1/user/approve-comment", {id:_id})
            if(data.success){
                toast.success(data.message)
                fetchComments()
            }else{
                toast.error(data.message)
            }
        }catch(e){
            toast.error(e.message)
        }
    }

        const deleteComment = async ()=>{
        try{
            const confirm  = window.confirm("Are you sure you want to delete this comment")
            if(!confirm) return 

            const {data} = await axios.post("api/v1/user/delete-comment", {id:_id})
            if(data.success){
                toast.success(data.message)
                fetchComments()
            }else{
                toast.error(data.message)
            }
        }catch(e){
            toast.error(e.message)
        }
    }


    return <>
    <tr className="order-y border-gray-300">
        <td className="px-6 py-4">
            <b className="font-medium tetx-gray-600">Blog</b> : {blog.title}
            <br />
            <b className="font-medium tetx-gray-600">Name</b> : {comment.name}
            <br />
            <b className="font-medium tetx-gray-600">Comment</b> :{comment.content}
        </td>

        <td className="px-6 py-4 max-sm:hidden">
            {BlogDate.toLocaleDateString()}
        </td>

        <td className="px-6 py-4 ">
            <div className="inline-flex items-center gap-4">
                {!comment.isApproved ? 
                
                    <img onClick={approveComment}  src={assets.tick_icon} className="w-5 hover:scale-110 transition-all cursor-pointer"/>
                        :
                        <p className="text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1">Approved</p>}

                        <img  onClick={deleteComment} src={assets.bin_icon} className="w-5 hover:scale-110 transition-all cursor-pointer"/>
            </div>
        </td>
    </tr>
    
    </>


}

export default CommentTableItem
import { Outlet } from "react-router-dom"
import {assets} from "../../assets/assets.js"
import Sidebar from "./Sidebar.jsx"
import { useAppContext } from "../../context/AppContext.jsx"

function Layout(){

   

    const {axios,setToken,  navigate} = useAppContext()

    const logout = ()=>{
        localStorage.removeItem('token')
        axios.defaults.headers.common['token'] = null
        setToken(null)
        navigate('/')
         
    }



    return <>
        <div className="flex justify-between cursor-pointer items-center py-5 mx-8 sm:mx-20 xl:mx-32 border-b border-gray-300">
            <img src={assets.bloggy} alt="" className="w-32 sm:w-40 cursor-pointer" onClick={()=>navigate('/')} />
            <button onClick={logout} className="text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer">Logout</button>
        </div>


        <div className="flex h-[calc(100vh-70px)]" >
          <Sidebar />
            <Outlet />
            
        </div>
    </>


}

export default Layout
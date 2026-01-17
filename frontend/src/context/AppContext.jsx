
import { createContext,useContext } from "react"
import {useNavigate} from "react-router-dom"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { useEffect } from "react"
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

const AppContext  = createContext()

export function AppProvider({children}){

    const navigate = useNavigate()
     const [token, setToken] = useState(null)
     const [blogs, setBlogs] = useState([])
     const [input, setInput] = useState("")

     const fetchBlogs = async()=>{
        try{
             const {data} = await axios.get("/api/v1/blog/all" )
          data.success ? setBlogs(data.blogs) : toast.error(data.message)

        }catch(e){
            toast.error(e.message)
            
            }
       
    }
    useEffect(()=>{
        fetchBlogs()
        const token = localStorage.getItem('token')
            if(token){
                setToken(token)
                axios.defaults.headers.common['token'] = `${token}`
            }
    },[])

     const value = {axios, navigate, token, setToken, blogs, setBlogs, input, setInput}

        return (
                <AppContext.Provider value={value}>
                   
                    {children}

                </AppContext.Provider>
        )

}

  

export function useAppContext(){
    return useContext(AppContext)
}
 
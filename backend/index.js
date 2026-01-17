import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import userRouter from './routes/user.js'
import blogRouter from './routes/blog.js'


const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))

app.get('/', (req,res)=>{
    res.send("ddadadadad")
})

app.use('/api/v1/user', userRouter)
app.use('/api/v1/blog', blogRouter)

app.listen(8000)
const express = require('express')
const app = express()
const dotenv=require('dotenv').config()
const port = process.env.PORT || 8000
const path=require('path')
const dbConection=require('./db/db')
const userRouter=require('./router/user.route')




app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')))
app.use('/',userRouter)



dbConection.then(()=>{
    console.log("Connection Success")
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
})
.catch((e)=>{
    console.log("connection Faield")
})



const mongoose=require('mongoose')
const dbConection=mongoose.connect(process.env.DB_URL)
module.exports=dbConection
const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        default:15,
        required:true,
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Post'
        },
    ]
},{timestamps:true})

const userModel=mongoose.model('User',userSchema)
module.exports=userModel;
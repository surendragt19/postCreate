const mongoose=require('mongoose')

const postSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    date: {
    type: Date,
    default: Date.now
  },
   likes:[
    {
    type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
  ],
  user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
},{timestamps:true})

const postModel=mongoose.model('Post',postSchema)
module.exports=postModel;
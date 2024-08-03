const userModel=require('../models/user.models')
const postModel=require('../models/post.models')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const registerController = async (req, res) => {
    const { name, email, username, password, age } = req.body;
    if (!name || !email || !username || !password || !age) {
      return res.status(400).json({ status: 'Bad Request', message: 'All fields are required' });
    }
    try {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(401).json({ status: 'User already exists' });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user=await userModel.create({
        name,
        email,
        username,
        password: hashedPassword,
        age
      });
      //jwt
      const payload={
        id:user._id,
        email
      }
      const token=jwt.sign(payload,process.env.SEC_KEY, { expiresIn: '1h' })
      res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'strict' });
      res.render('login')
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ status: 'Server Error', message: 'Server problem' });
    }
  };



const loginController=async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await userModel.findOne({email})
        if (!user) {
            return res.status(401).json({ status: 'Unauthorized', message: 'Invalid email or password' });
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if (!isMatch) {
            return res.status(401).json({ status: 'Unauthorized', message: 'Invalid email or password' });
        }
        const token=jwt.sign({id:user._id,email:email},process.env.SEC_KEY,{expiresIn:'1h'})
        res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'strict' });
        res.redirect('profile')
    } catch (error) {
        console.error('Error Login User:', error);
        res.status(500).json({ status: 'Server Error', message: 'Server problem' });
    }
}


const profileController=async(req,res)=>{
    try {
        let user=await userModel.findOne({email:req.user.email}).populate("posts")
    res.render('profile',{user})
    } catch (error) {
        console.error('Error Login User:', error);
        res.status(500).json({ status: 'Server Error', message: 'Server problem' });
    }
}

//crete post
const postCreateController = async (req, res) => {
    try {
        if (!req.user || !req.user.email) {
            return res.status(401).send('User not authenticated');
        }
        let user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const { content } = req.body;
        const newPost = await postModel.create({
            content,
            user: user._id
        });

        if (!user.posts) {
            user.posts = [];
        }
        user.posts.push(newPost._id); 
        await user.save();

        res.redirect('/profile'); 
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).send('An error occurred while creating the post');
    }
};

const likePostController = async (req, res) => {
    try {
        const post=await postModel.findOne({_id:req.params.id}).populate("user")
        if(post.likes.indexOf(req.user._id)=== -1){
        post.likes.push(req.user.userid)
        }
    else{
        post.likes.splice(post.likes.indexOf(req.user.userid),1)
    }
    await post.save()
    res.redirect('/profile')
    } catch (error) {
        console.error('Error Like post:', error);
        res.status(500).send('An error occurred while liking the post');
    }
}

const deletePostController = async (req, res) => {
    const id = req.params.id;
    try {
        const deletePost = await postModel.findOneAndDelete({_id:id});
        if (!deletePost) {
            return res.status(404).send('Post Not Found');
        }
        res.redirect('/profile');
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).send('Server Error');
    }
};


const editPostController=async(req,res)=>{
    const post=await postModel.find({_id:req.params.id}).populate("user")
    res.render('edit',{post})
}

const updatePostController=async(req,res)=>{
   try {
    const id=req.params.id;
    await postModel.findByIdAndUpdate({_id:id},{content:req.body.content},{new:true})
    res.redirect('/profile')
   } catch (error) {
    console.error('Error Updating post:', error);
        res.status(500).send('Server Error');
   }
}



const allPostController = async (req, res) => {
    try {
        const allPosts = await postModel.find().populate('user');

        if (!allPosts || allPosts.length === 0) {
            return res.status(404).send('No posts found');
        }
        res.render('allPost', { 
            allPosts: allPosts,
            user: req.user 
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Server Error');
    }
};


const likeAllPostController = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id; 
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        if (post.likes.includes(userId)) {
           
            post.likes.pull(userId);
        } else {
           
            post.likes.push(userId);
        }
        await post.save();
        res.redirect('/allPosts'); 
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).send('Server Error');
    }
};







module.exports={registerController,loginController,profileController,postCreateController,likePostController,deletePostController,likeAllPostController,editPostController,updatePostController,allPostController}
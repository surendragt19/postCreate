const express = require('express');
const router = express.Router();
const { 
    registerController,
    loginController, 
    profileController, 
    postCreateController,
    likePostController,
    deletePostController,
    editPostController,
    updatePostController,
    allPostController,
    likeAllPostController
    } = require('../controller/user.controller');
const isLoginMiddleware = require('../middlewear/login.middlewear');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', registerController);

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/login', loginController);

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

router.get('/profile', isLoginMiddleware, profileController);

router.post('/post', isLoginMiddleware, postCreateController);

router.get('/like/:id', isLoginMiddleware, likePostController);

router.get('/delete/:id', deletePostController);

router.get('/edit/:id',isLoginMiddleware,editPostController);

router.post('/postUpdate/:id',isLoginMiddleware,updatePostController)


router.get('/allPost',isLoginMiddleware,allPostController)

router.get('/allLike/:id',isLoginMiddleware,likeAllPostController)
module.exports = router;

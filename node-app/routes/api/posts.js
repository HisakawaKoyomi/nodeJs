const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Profile = require("../../models/Profiles");
const Post = require("../../models/Post");

const validatePostInput = require("../../validator/post");

// $router POST api/posts
// @desc 创建互动信息
// @access Private
router.post("/", passport.authenticate("jwt", {session: false}), (req, res) => {
    const {errors, isValid} = validatePostInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors)
    }

    const newPost = {
        user: req.user.id,
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
    };
    // 不完善: 模型中不必存储用户名及头像，想要获取时 populate 联合查找即可

    new Post(newPost).save().then(post => res.json(post)); // 互动信息可以重复创建
});

// $router GET api/posts/all
// @desc 获取所有互动信息
// @access Public
router.get("/all", (req, res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json(err))
});

// $router GET api/posts/:id
// @desc 获取单个互动信息
// @access Public
router.get("/:id", (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                return res.status(404).json({nopostfound: "找不到该互动信息"})
            }
            res.json(post);
        }).catch(err => res.status(400).json(err))
});

// $router DELETE api/posts/:id
// @desc 删除单个互动信息
// @access Private
router.delete("/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (!post){
                return res.status(404).json({nopostfound: "找不到该互动信息!"})
            }
            if (post.user.toString() !== req.user.id){
                // post.user 为ObjectId类型，需要进行类型转换
                return res.status(401).json({notauthorized: "用户非法操作!"})
            }
            post.remove().then(() => res.json({success: true}))
        }).catch(err => res.status(400).json(err))
});

// $router POST api/posts/like/:id
// @desc 进行点赞
// @access Private
router.post("/like/:id",passport.authenticate("jwt",{session: false}),(req,res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (!post){
                return res.status(404).json({nopostfound: "找不到该互动信息!"})
            }
            if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
                return res.status(400).json({alreadyliked: "该用户已赞过!"})
            }
            post.likes.unshift({user: req.user.id});
            post.save().then(post => res.json(post));
        }).catch(err => res.status(400).json(err))
});

// $router POST api/posts/unlike/:id
// @desc 取消点赞
// @access Private
router.post("/unlike/:id",passport.authenticate("jwt",{session: false}),(req,res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (!post){
                return res.status(404).json({nopostfound: "找不到该互动信息!"})
            }
            if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                return res.status(400).json({notliked: "该用户没有点过赞!"})
            }

            const removeIndex = post.likes
                .map(item => item.user.toString())
                .indexOf(req.user.id);
            post.likes.splice(removeIndex,1);

            post.save().then(post => res.json(post));
        }).catch(err => res.status(400).json(err))
});

// $router POST api/posts/comment/:id
// @desc 添加评论
// @access Private
router.post("/comment/:id",passport.authenticate("jwt",{session: false}),(req,res) => {
    const {errors,isValid} = validatePostInput(req.body);

    if (!isValid){
        return res.status(400).json(errors)
    }

    Post.findById(req.params.id)
        .then(post => {
            if (!post){
                return res.status(404).json({nopostfound: "找不到该互动信息!"})
            }
            const newComment = {
                user: req.user.id,
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar
            };
            post.comments.unshift(newComment);

            post.save().then(post => res.json(post))
        }).catch(err => res.status(400).json(err))
});

// $router POST api/posts/discomment/:id/:comment_id
// @desc 删除评论
// @access Private
router.post("/discomment/:id/:comment_id",passport.authenticate("jwt",{session: false}),(req,res) => {
    // 评论可以重复，点赞不会重复，因而要加上comment_id
    Post.findById(req.params.id)
        .then(post => {
            if (!post){
                return res.status(404).json({nopostfound: "找不到该互动信息!"})
            }
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0){
                return res.status(404).json({commentnotexist: "该评论不存在!"})
            }

            const removeIndex = post.comments
                .map(item => item._id.toString())
                .indexOf(req.params.comment_id);
            if (post.comments[removeIndex].user.toString() !== req.user.id){
                return res.status(401).json({notauthorized: "用户非法操作!"})
            }
            post.comments.splice(removeIndex,1);

            post.save().then(post => res.json(post));
        }).catch(err => res.status(400).json(err))
});

module.exports = router;
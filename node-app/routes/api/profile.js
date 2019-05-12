const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Profile = require("../../models/Profiles");
const User = require("../../models/User");

const validateProfileInput = require("../../validator/profile");
const validateExperienceInput = require("../../validator/experience");
const validateEducationInput = require("../../validator/education");

// $router GET api/profile
// @desc 获取登录用户个人信息接口
// @access private
router.get("/",passport.authenticate("jwt",{session: false}),(req,res) => {
    const errors = {};

    Profile.findOne({user: req.user.id})
        .populate("user",["name","avatar"])
        .then(profile => {
            if (!profile) {
                errors.noprofile = "该用户的信息不存在!";
                return res.status(404).json(errors);
            }
            res.json(profile);
        }).catch(err => res.status(404).json(err));
});

// $router POST api/profile
// @desc 创建与编辑个人信息接口
// @access private
router.post("/",passport.authenticate("jwt",{session: false}),(req,res) => {
   const {errors,isValid} = validateProfileInput(req.body);
   const profileFields = {};

   if (!isValid) return res.status(400).json(errors);

   profileFields.user = req.user.id;
   if (req.body.handle) profileFields.handle = req.body.handle;
   if (req.body.company) profileFields.company = req.body.company;
   if (req.body.website) profileFields.website = req.body.website;
   if (req.body.location) profileFields.location = req.body.location;
   if (req.body.status) profileFields.status = req.body.status;

   if (req.body.bio) profileFields.bio = req.body.bio;
   if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

   if (typeof req.body.skills !== "undefined")  profileFields.skills = req.body.skills.split(",");

   profileFields.social = {};
   if (req.body.wechat) profileFields.social.wechat = req.body.wechat;
   if (req.body.QQ) profileFields.social.QQ = req.body.QQ;
   if (req.body.tengxunkt) profileFields.social.tengxunkt = req.body.tengxunkt;
   if (req.body.wangyikt) profileFields.social.wangyikt = req.body.wangyikt;

   Profile.findOne({user: req.user.id})
       .then((profile) => {
         if (profile) {
             Profile.findOneAndUpdate({user: req.user.id},{$set: profileFields},{new: true, useFindAndModify: false}).then(profile => res.json(profile));
         }else {
             Profile.findOne({handle: profileFields.handle}).then(profile => {
                 if (profile) {
                     errors.handle = "该用户的handle个人信息已存在，请勿重复创建!";
                     return res.status(400).json(errors);
                 }

                 new Profile(profileFields).save().then(profile => res.json(profile));
             })
         }
       }).catch(err => res.status(404).json(err));
});

// $router GET api/profile/handle/:handle
// @desc 通过handle获取个人信息
// @access public
router.get("/handle/:handle",(req,res) => {
   const errors = {};
   Profile.findOne({handle: req.params.handle})
       .populate("user",["name","avatar"])
       .then(profile => {
           if (!profile){
               errors.nohandle = "未找到该用户信息!";
               return res.status(404).json(errors);
           }
           res.json(profile);
       }).catch(err => res.status(400).json(err))
});

// $router GET api/profile/user/:user
// @desc 通过user_id获取个人信息
// @access public
router.get("/user/:user_id",(req,res) => {
    const errors = {};
    Profile.findOne({user: req.params.user_id})
        .populate("user",["name","avatar"])
        .then(profile => {
            if (!profile){
                errors.noprofile = "未找到该用户信息!";
                return res.status(404).json(errors);
            }
            res.json(profile);
        }).catch(err => res.status(400).json(err))
});

// $router GET api/profile/all
// @desc 获取所有人的信息
// @access public
router.get("/all",(req,res) => {
    const errors = {};
   Profile.find()
       .populate("user",["name","avatar"])
       .then(profiles => {
           if (!profiles){
               errors.noprofiles = "没有任何用户信息!";
               return res.status(404).json(profiles);
           }
           res.json(profiles);
       }).catch(err => res.status(400).json(err))
});

// $router POST api/profile/experience
// @desc 添加个人经历
// @access Private
router.post("/experience",passport.authenticate("jwt",{session: false}),(req,res) => {
    const {errors,isValid} = validateExperienceInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    Profile.findOne({user: req.user.id})
        .then(profile => {
            if (!profile){
                errors.noprofile = "该用户的信息不存在!";
                return res.status(404).json(errors);
            }
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };
            profile.experience.unshift(newExp);

            profile.save().then(profile => res.json(profile));
        }).catch(err => res.status(400).json(err))
});

// $router POST api/profile/education
// @desc 添加个人学历
// @access Private
router.post("/education",passport.authenticate("jwt",{session: false}),(req,res) => {
    const {errors,isValid} = validateEducationInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    Profile.findOne({user: req.user.id})
        .then(profile => {
            if (!profile){
                errors.noprofile = "该用户的信息不存在!";
                return res.status(404).json(errors);
            }
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };
            profile.education.unshift(newEdu);
            profile.save().then(profile => res.json(profile));
        }).catch(err => res.status(400).json(err))
});

// $router DELETE api/profile/experience/:exp_id
// @desc 删除个人经历
// @access Private
router.delete("/experience/:exp_id",passport.authenticate("jwt",{session: false}),(req,res) => {
    const errors = {};
    Profile.findOne({user: req.user.id})
        .then(profile => {
            if (!profile){
                errors.noprofile = "该用户的个人信息不存在!";
                return res.status(404).json(errors);
            }

            const removeIndex = profile.experience
                .map(item => item.id) //每个对象都有一个id，进行映射
                .indexOf(req.params.exp_id);
            profile.experience.splice(removeIndex,1);

            profile.save().then(profile => res.json(profile));
        }).catch(err => res.status(400).json(err))
});

// $router DELETE api/profile/education/:edu_id
// @desc 删除个人学历
// @access Private
router.delete("/education/:edu_id",passport.authenticate("jwt",{session: false}),(req,res) => {
   const errors = {};
   Profile.findOne({user: req.user.id})
       .then(profile => {
         if (!profile){
             errors.noprofile = "该用户的个人信息不存在!";
             return res.status(404).json(errors)
         }

         const removeIndex = profile.education
             .map(item => item.id)
             .indexOf(req.params.edu_id);
         profile.education.splice(removeIndex,1);
         profile.save().then(profile => res.json(profile));
       }).catch(err => res.status(400).json(err))
});

// $router DELETE api/profile
// @desc 删除整个用户(基本信息+个人信息)
// @access Private
router.delete("/",passport.authenticate("jwt",{session: false}),(req,res) => {
    Profile.findOneAndRemove({user: req.user.id},{useFindAndModify: false})
        .then(() => {
            User.findOneAndRemove({_id: req.user.id},{useFindAndModify: false})
                .then(() => {
                    res.json({success: true})
                }).catch(err => res.status(400).json(err))
        }).catch(err => res.status(400).json(err))
});

module.exports = router;

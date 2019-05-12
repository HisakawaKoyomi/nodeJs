# 后端接口搭建  
  * express
  * postman
  * mongoDB Atlas
---

## 注意事项
  * 使用前，修改config中的keys文件, mongoURI 改为 mongoDB Atlas 中所注册的数据库接口
  * config中的passport文件用于配置jwt模块的token验证
  
## 接口
  * users, 用户的登录注册，token及validate验证，个人头像avatar的获取
    * $router POST api/users/register, @desc 进行注册, @access Public
    * $router POST api/users/login, @desc 进行登录，并获得token, @access Public
    * $router GET api/users/current, @desc 访问接口并进行token验证, @access Private
    
  * profile, 个人信息的添加删除，包括基本信息，工作经历，教育经历
    * $router GET api/profile, @desc 获取登录用户个人信息接口, @access Private
    * $router POST api/profile, @desc 创建与编辑个人信息接口, @access Private
    * $router GET api/profile/handle/:handle, @desc 通过handle获取个人信息, @access Public
    * $router GET api/profile/user/:user, @desc 通过user_id获取个人信息, @access public
    * $router GET api/profile/all, @desc 获取所有人的信息, @access Public
    * $router POST api/profile/experience, @desc 添加个人经历, @access Private
    * $router POST api/profile/education, @desc 添加个人学历, @access Private
    * $router DELETE api/profile/experience/:exp_id, @desc 删除个人经历, @access Private
    * $router DELETE api/profile/education/:edu_id, @desc 删除个人学历, @access Private
    * $router DELETE api/profile, @desc 删除整个用户(基本信息+个人信息), @access Private  
 
  * posts, 点赞及取消点赞，评论及删除评论
    * $router POST api/posts, @desc 创建互动信息, @access Private
    * $router GET api/posts/all, @desc 获取所有互动信息, @access Public
    * $router GET api/posts/:id, @desc 获取单个互动信息, @access Public
    * $router DELETE api/posts/:id, @desc 删除单个互动信息, @access Private
    * $router POST api/posts/like/:id, @desc 进行点赞, @access Private
    * $router POST api/posts/unlike/:id, @desc 取消点赞, @access Private
    * $router POST api/posts/comment/:id, @desc 添加评论, @access Private
    * $router POST api/posts/discomment/:id/:comment_id, @desc 删除评论, @access Private
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();

// 引入 router
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

// DB config
const db = require("./config/keys").mongoURI;

// 使用中间件
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//connect to mongodb
mongoose.connect(db,{useNewUrlParser:true})
    .then(() => {console.log("mongodb has been connected")})
    .catch((err) => {console.log(err)});

// 初始化 passport
app.use(passport.initialize());
// 配置passport，即规定验证方式，将passport作为参数传入
require("./config/passport")(passport);

app.use("/api/users",users);
app.use("/api/profile",profile);
app.use("/api/posts",posts);

const port = process.env.port || 5000;
app.listen(port,() => {
    console.log(`server is running on port ${port}`);
});

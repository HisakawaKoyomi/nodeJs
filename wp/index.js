const express = require("express");
const fs = require("fs");
const path = require("path");
const Multer = require("multer");
const mysql = require("mysql");

const server = express();
server.listen(9111);
server.use(Multer({dest: './www/allFiles'}).any()); //放在路由注册之后会导致存储路径改变！！

//用户登录注册路由
const loginRouter = express.Router();
server.use('/login',loginRouter);

//上传文件接口
loginRouter.use('/getFiles', (req,res) => {

    res.setHeader('Access-Control-Allow-Origin','*');

    console.log(req.files);
    var oldName = req.files[0].path;
    var newName = req.files[0].path + path.parse(req.files[0].originalname).ext; //加了后缀的文件名
    var hashName = req.files[0].filename + path.parse(req.files[0].originalname).ext; //后台处理获取哈希名
    var thisTime = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(); //后台处理获取日期

    fs.rename(oldName,newName,(err) => {
        if (err){
            console.log(err);
            res.send({'ok': 0,'msg': '文件上传转码失败'});
        }else {
            var Pool = mysql.createPool({
                'host': 'localhost',
                'user': 'root',
                'password': '1996',
                'database': 'wp'
            });
            Pool.getConnection((err,connection) => {
                if (err){
                    console.log(err);
                    res.send({'ok': 0,'msg': '数据库链接失败'});
                    connection.release();
                }else {
                    connection.query('INSERT INTO `' + req.body.fsUser + '` (`lastName`,`hashName`,`size`,`type`,`download`,`lastTime`) VALUES ("' + req.files[0].originalname + '","' + hashName + '","' + req.files[0].size + '","' + path.parse(req.files[0].originalname).ext + '","0","' + thisTime + '");',(err,data) => {
                        if (err){
                            console.log(err);
                            res.send({'ok': 0,'msg': '数据库写入失败'});
                            connection.release();
                        }else {
                            res.send({'ok': 1,'msg': '上传成功','hash': hashName,'timer': thisTime});
                        }
                        connection.release();
                    })
                }
            })
        }
    })



});

//用户注册
loginRouter.use('/res',(req,res) => {

    res.setHeader('Access-Control-Allow-Origin','*');

    var Pool = mysql.createPool({
        'host': 'localhost',
        'user': 'root',
        'password': '1996',
        'database': 'wp'
    });
    Pool.getConnection((err,connection) => {
        if (err){
            console.log(err);
            res.send({'ok': 0,'msg': '数据库链接失败'});
            connection.release();
        }else {
            connection.query('SELECT user FROM `usertab` WHERE user="'+ req.query.user +'";',(err,data) => {
                if (err){
                    console.log(err);
                    res.send({'ok': 0,'msg': '数据库读取失败'});
                    connection.release();
                }else {
                    if (data.length > 0){
                        res.send({'ok': 0,'msg': '用户名已被占用'});
                        connection.release();
                    }else {
                        connection.query('INSERT INTO `usertab` (`user`,`pass`) VALUES("' + req.query.user +'","'+ req.query.pass + '");',(err,data) => {
                            if (err){
                                console.log(err);
                                res.send({'ok': 0,'msg': '数据库写入失败'});
                            }else{
                                connection.query(`CREATE TABLE ${req.query.user} (
                                 ID int(255) NOT NULL AUTO_INCREMENT,
                                 LastName varchar(255) NOT NULL,
                                 hashName varchar(255) NOT NULL,
                                 lastTime varchar(255) NOT NULL,
                                 type varchar(255),
                                 size varchar(255) NOT NULL,
                                 download varchar(255) NOT NULL,
                                 PRIMARY KEY (ID)
                                )`,(err,data) => {
                                    if (err){
                                        console.log(err);
                                    }else {
                                        res.send({'ok': 1,'msg': '恭喜，注册成功'});
                                    }
                                });
                            }
                            connection.release(); // conn.end() 即将被弃用
                        });
                    }
                }
            });
        }
    })
});

//用户登录
loginRouter.use('/lg',(req,res) => {

    res.setHeader('Access-Control-Allow-Origin',"*");

    var Pool = mysql.createPool({
        'host': 'localhost',
        'user': 'root',
        'password': '1996',
        'database': 'wp'
    });
    Pool.getConnection((err,connection) => {
        if (err){
            console.log(err);
            res.send({'ok': 0,'msg': '数据库链接失败'});
            connection.release();
        }else {
            connection.query('SELECT user,pass FROM `usertab` WHERE user = "' + req.query.user + '" AND pass = "' + req.query.pass + '";', (err,data) => {
                if (err){
                    console.log(err);
                    res.send({'ok': 0,'msg': '数据库读取失败'});
                    connection.release();
                }else {
                    if (data.length > 0) {
                        res.send({'ok': 1,'msg': '登录成功'});
                    }else {
                        res.send({'ok': 0,'msg': '用户名或密码错误'});
                    }
                    connection.release();
                }
            } )
        }
    })

});


server.use('/',express.static("./www"));
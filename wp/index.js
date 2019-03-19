const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const mysql = require("mysql");

const server = express();
server.listen(9111);

const loginRouter = express.Router();

loginRouter.use('/res',(req,res) => {
    var Pool = mysql.createPool({
        'host': 'localhost',
        'user': 'root',
        'password': '1996',
         'database': 'wp'
    });
    Pool.getConnection((err,connection) => {
        if (err){
            console.log(err);
            res.send({'ok': 0,'msg': '数据库链接失败'})
            connection.end();
        }else {
            connection.query('SELECT user FROM `usertab` WHERE user="'+ req.query.user +'";',(err,data) => {
                if (err){
                    console.log(err);
                    res.send({'ok': 0,'msg': '数据库链接失败'});
                    connection.end();
                }else {
                    if (data.length > 0){
                        res.send({'ok': 0,'msg': '用户名已被占用'});
                        connection.end();
                    }else {
                        connection.query('INSERT INTO `usertab` (`user`,`pass`) VALUES("' + req.query.user +'","'+ req.query.pass+ '";',(err,data) => {
                            if (err){
                                console.log(err);
                                req.send({'ok': 0,'msg': '数据库链接失败'});
                            }else {
                                res.send({'ok': 1,'msg': '恭喜，注册成功'});
                            }
                            connection.end();
                        });

                    }

                }
            });
        }
    })
});

server.use('/',express.static("./www"));
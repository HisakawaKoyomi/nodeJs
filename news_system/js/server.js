var http = require('http');
var urlLib = require('url');
var fs = require('fs');

var vip = {
    'Ly': 123
};

http.createServer(function (req,res) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var json = urlLib.parse(req.url,true).query;

    if (vip[json.user]){
        res.write('管理员账号禁止注册');
        res.end();
        return
    }

    fs.readFile('../账号管理.txt','utf-8',function (err,data) {
        if (err){
           console.log(err);
        }else {
            var jsonData = JSON.parse(data);

            if (jsonData[json.user]){
                res.write('用户名已被注册');
                res.end();
            }else {
                jsonData[json.user] = json.pass;
                fs.writeFile('../账号管理.txt',JSON.stringify(jsonData),function (err,data){
                    if (err){
                        console.log(err);
                        res.write('注册失败!');
                        res.end();
                    }else {
                        res.write('恭喜，注册成功!');
                        res.end();
                    }

                });
            }
        }
    })

}).listen(2933);

http.createServer(function (req,res) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var json = urlLib.parse(req.url,true).query;

    if (vip[json.user] === json.pass){
        res.write('管理员登录成功');
        res.end();
        return
    }

    fs.readFile('../账号管理.txt','utf-8',function (err,data) {
        if (err){
            console.log(err);
            res.write('登录失败！');
            res.end();
        }else {
            var jsonData = JSON.parse(data);

            if (jsonData[json.user] === json.pass){
                res.write('登录成功');
                res.end();
            }else {
                res.write('用户名或密码错误');
                res.end();
            }
        }

    })

}).listen(2934);

http.createServer(function (req,res) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var json = urlLib.parse(req.url,true).query;

    fs.readFile('../文章列表.txt','utf-8',function (err,data) {
        if (err){
            console.log(err);
        } else{
            var jsonArr = JSON.parse(data);
            jsonArr.push(json.editTitle);
            fs.writeFile('../文章列表.txt','utf-8',function (err) {
                if (err){
                    console.log(err);
                }else {
                    fs.writeFile('../文章内容/'+json.editTitle+'.txt',json.editContent,function (err) {
                        if (err){
                            console.log(err);
                        }else {
                            res.write('发布成功');
                            res.end();
                        }
                    })
                }
            })
        }
    })
}).listen(2935);

http.createServer(function (req,res) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var json = urlLib.parse(req.url,true).query;
    fs.readFile('../文章内容/'+json.title+'.txt','utf-8',function (err,data) {
        if (err){
            console.log(err);
        }else {
            res.write(data);
            res.end();
        }
    })
}).listen(2937);

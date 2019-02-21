let http = require('http');
let urlLib = require('url');

let allData = {};
http.createServer(function (req,res) {
    res.setHeader('Access-Control-Allow-Origin','*');
    let json = urlLib.parse(req.url,true).query;
    if (allData[json.user]){
        res.write("账号名已注册");
    }else {
        allData[json.user] = json.pass;
        res.write("恭喜你，注册成功");
    }
    console.log(allData);
    res.end();
}).listen(2871);

http.createServer(function (req,res) {
    res.setHeader('Access-Control-Allow-Origin','*');
    let json = urlLib.parse(req.url,true).query;
    if (allData[json.user]){
        if (allData[json.user] === json.pass) {
            res.write("登录成功");
        } else{
            res.write("用户名或密码错误")
        }
    }else {
        res.write("该账户名仍未被注册");
    };
    res.end();

}).listen(2872);
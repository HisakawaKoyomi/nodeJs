const Validator = require("validator"); // 用于验证
const isEmpty = require("./is-empty"); // 用于预处理，消去首尾空格且转为字符串存放至原位

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    if (!Validator.isLength(data.name,{min:2,max:30})) {
        errors.name = "名字的长度不能小于2位且不能大于30位!";
    }
    if (Validator.isEmpty(data.name)) {
        errors.name = "名字不能为空!";
    }

    if (!Validator.isEmail(data.email)) {
        errors.name = "邮箱不合法!";
    }
    if (Validator.isEmpty(data.email)) {
        errors.name = "邮箱不能为空!";
    }

    if (!Validator.isLength(data.password,{min:6,max:30})) {
        errors.name = "密码的长度不能小于6位且不能大于30位!";
    }
    if (Validator.isEmpty(data.password)) {
        errors.name = "密码不能为空!";
    }

    if (Validator.isEmpty(data.password2)) {
        errors.name = "确认密码不能为空!";
    }
    if (!Validator.equals(data.password,data.password2)) {
        errors.name = "两次密码输入不一致!"
    }
    // console.log(isEmpty(errors));

    return {
        errors,
        isValid: isEmpty(errors) // 方便直接判断有无错误
    }
};
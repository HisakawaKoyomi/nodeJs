const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
    const errors = {};

    data.text = !isEmpty(data.text) ? data.text : "";

    if (Validator.isEmpty(data.text)){
        errors.text = "文本不能为空!";
    }
    if (!Validator.isLength(data.text,{min: 10,max: 300})){
        errors.text = "评论字符数不能少于10个且不能大于300个!";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};
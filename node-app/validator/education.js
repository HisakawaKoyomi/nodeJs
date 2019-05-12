const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
    let errors = {};

    data.title = !isEmpty(data.school) ? data.school : "";
    data.company = !isEmpty(data.degree) ? data.degree : "";
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
    data.from = !isEmpty(data.from) ? data.from : "";

    if (Validator.isEmpty(data.school)){
        errors.title = "个人教育的学校不能为空!";
    }
    if (Validator.isEmpty(data.degree)){
        errors.company = "个人教育的学校不能为空!";
    }
    if (Validator.isEmpty(data.fieldofstudy)){
        errors.fieldofstudy = "个人教育的领域不能为空!";
    }
    if (Validator.isEmpty(data.from)){
        errors.from = "个人教育的起始时间不能为空!";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};
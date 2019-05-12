const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  const errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";
  data.website = !isEmpty(data.website) ? data.website : "";
  data.tengxunkt = !isEmpty(data.tengxunkt) ? data.tengxunkt : "";
  data.wangyikt = !isEmpty(data.wangyikt) ? data.wangyikt : "";

  if (!Validator.isLength(data.handle,{min: 2,max: 40})){
      errors.handle = "用户名的长度不能小于2位且不能大于40位!";
  }
  if (Validator.isEmpty(data.handle)){
      errors.handle = "用户名不能为空!";
  }

  if (Validator.isEmpty(data.status)){
      errors.status = "职位不能为空!";
  }
  if (Validator.isEmpty(data.skills)){
      errors.skills = "技能不能为空!";
  }

  // 若可选项存在，则同样有一些限制，如URL
  if (!Validator.isEmpty(data.website)){
      if (!Validator.isURL(data.website)){
          errors.website = "url不合法!"
      }
  }
  if (!Validator.isEmpty(data.tengxunkt)){
      if (!Validator.isURL(data.tengxunkt)){
          errors.tengxunkt = "url不合法!";
      }
  }
  if (!Validator.isEmpty(data.wangyikt)){
      if (!Validator.isURL(data.wangyikt)){
          errors.wangyikt = "url不合法!";
      }
  }

  return {
      errors,
      isValid: isEmpty(errors)
  }

};
const { check, validationResult } = require("express-validator");

let userValCheck, idValCheck, blogValCheck, checkIfAdmin;

userValCheck = [

  check("username").notEmpty().withMessage("Username cannot be empty"),
  check("email").notEmpty().withMessage("Email cannot be empty"),
  check("password").notEmpty().withMessage("Password cannot be empty"),

  (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      return res.send({ status: 0, response: errors[0].msg });
    } else {
      return next();
    }
  },
];


blogValCheck = [

  check("title").notEmpty().withMessage("title cannot be empty"),
  check("desc").notEmpty().withMessage("description cannot be empty"),

  (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      return res.send({ status: 0, response: errors[0].msg });
    } else {
      return next();
    }
  },
];

idValCheck = [

  check("id").notEmpty().withMessage("id cannot be empty"),

  (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      return res.send({ status: 0, response: errors[0].msg });
    } else {
      return next();
    }
  },
];


checkIfAdmin = async (req, res, next) => {

  try {
    if (userInfo.user.admin !== true) {
      return res.send({ status: 0, response: "You're not an admin" })
    }
    else {
      next()
    }
  } catch (error) {
    return res.send({ status: 0, response: error.message })
  }

}

module.exports = { userValCheck, idValCheck, blogValCheck, checkIfAdmin };

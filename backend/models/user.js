const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  avatar: String,
  friends: { type: Array, default: [] },
  chats: { type: Array, default: [] },
  requestFriend: { type: Array, default: [] },
  confirm: {
    type: Boolean,
    default: false,
  },
  resetLink: {
    data: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
exports.UserModel = mongoose.model("users", userSchema);

////////// schema reagex Email
const emailRegExp = /^[a-z0-9\._\-\+]{2,50}@[a-z\-0-9]+(\.[a-z]{2,10})+$/i;

/////////// Schema Reagex Password
const lowerCaseRegExp = /(?=.*[a-z])/;
const upperCaseRegExp = /(?=.*[A-Z])/;
const numericRegExp = /(?=.*[0-9])/;

//// validate create user
exports.validateUser = (_user) => {
  let schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).required().regex(emailRegExp),
    password: Joi.string()
      .min(6)
      .max(1024)
      .regex(lowerCaseRegExp)
      .regex(upperCaseRegExp)
      .regex(numericRegExp)
      .required(),

    avatar: Joi.string(),
  });
  return schema.validate(_user, { abortEarly: false });
};

//// validate Edit user
exports.validateEditUser = (_user) => {
  let schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    avatar: Joi.string().required(),
  });
  return schema.validate(_user, { abortEarly: false });
};
exports.validateAddFriend = (_user) => {
  let schema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().min(2).max(255).required(),
    avatar: Joi.string().required(),
    message: Joi.string().min(2).max(50),
    date: Joi.object().required(),
    token: Joi.string(),
  });
  return schema.validate(_user, { abortEarly: false });
};
exports.validateRequestAnswer = (_user) => {
  let schema = Joi.object({
    _id: Joi.string().required(),
    answer: Joi.boolean().required(),
    myName: Joi.string().min(2).max(255),
    friendName: Joi.string().min(2).max(255),
  });
  return schema.validate(_user, { abortEarly: false });
};
exports.validateRemoveORBlock = (_user) => {
  let schema = Joi.object({
    _id: Joi.string().required(),
    answer: Joi.string().required(),
    token: Joi.string(),
  });
  return schema.validate(_user);
};

/// validate change password
exports.validatePassword = (password) => {
  const schema = Joi.object({
    password: Joi.string().max(1024).required(),
    newPassword: Joi.string()
      .min(6)
      .max(1024)
      .regex(lowerCaseRegExp)
      .regex(upperCaseRegExp)
      .regex(numericRegExp)
      .required(),
  });
  return schema.validate(password);
};

///validate Email
exports.validateEmail = (_email) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().regex(emailRegExp),
  });
  return schema.validate(_email);
};

///validate Reset Password
exports.validateResetPassword = (_password) => {
  const schema = Joi.object({
    newPassword: Joi.string()
      .min(6)
      .max(1024)
      .regex(lowerCaseRegExp)
      .regex(upperCaseRegExp)
      .regex(numericRegExp)
      .required(),
    resetLink: Joi.string().required(),
  });

  return schema.validate(_password);
};

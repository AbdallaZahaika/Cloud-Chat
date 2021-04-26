const mongoose = require("mongoose");
const Joi = require("joi");

const chatSchema = new mongoose.Schema({
  idUser1: String,
  idUser2: String,
  lestMessage: {
    type: Object,
    default: {},
  },
  timeForTheLastMessage: {
    type: Object,
    default: {},
  },
  messages: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

exports.ChatModel = mongoose.model("chats", chatSchema);

//// validate create Chat
exports.validateChat = (_chat) => {
  let schema = Joi.object({
    idUser2: Joi.string().required(),
    token: Joi.string(),
  });
  return schema.validate(_chat, { abortEarly: false });
};

exports.validateNewMessage = (_message) => {
  let schema = Joi.object({
    message: Joi.object().required(),
    _id: Joi.string(),
    token: Joi.string(),
  });
  return schema.validate(_message, { abortEarly: false });
};

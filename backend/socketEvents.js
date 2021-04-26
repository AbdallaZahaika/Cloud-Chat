const { validateNewMessage, ChatModel } = require("./models/chat");
const {
  validateRemoveORBlock,
  UserModel,
  validateAddFriend,
} = require("./models/user");

const jwt = require("jsonwebtoken");
const { secret } = require("./config/secret");
const { encrypt, decrypt } = require("./encryptionText");
exports = module.exports = function (io) {
  // io.use(function (socket, next) {
  //   if (socket.handshake.query && socket.handshake.query.token) {
  //     jwt.verify(
  //       socket.handshake.query.token,
  //       secret.JWTSecretKey,
  //       function (err, decoded) {
  //         if (err) return next(new Error("Authentication error"));
  //         socket.decoded = decoded;
  //         next();
  //       }
  //     );
  //   } else {
  //     next(new Error("Authentication error"));
  //   }
  // });

  //// verify - token
  const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret.JWTSecretKey, (err, payload) => {
        if (err) {
          return reject("this token does not exist");
        }
        const _id = payload._id;

        return resolve({ _id });
      });
    });
  };

  io.on("connection", (socket) => {
    /////////////////////////////////////*****CHAT*****////////////////////////////////////////////////////////
    socket.on("new-message", async (dataBody) => {
      const { error } = validateNewMessage(dataBody);
      if (error) {
        const listErrors = {};
        for (const detail of error.details) {
          listErrors[detail.path[0]] = detail.message;
        }
        io.emit("message-output-status", "message-output-error");
        return io.emit("message-output-error", { errors: listErrors });
      }

      try {
        const { _id } = await verifyToken(dataBody.token);

        const encryptMessage = await encrypt(dataBody.message.message);
        await ChatModel.updateOne(
          {
            _id: dataBody._id,
            $or: [{ idUser1: _id }, { idUser2: _id }],
          },
          {
            $push: {
              messages: {
                ...dataBody.message,
                message: encryptMessage,
                userId: _id,
              },
            },
            lestMessage: encryptMessage,
            timeForTheLastMessage: dataBody.message.date,
          }
        );
        dataBody.message = { ...dataBody.message, userId: _id };

        io.emit("message-output", dataBody);
        io.emit("message-output-status", "success");
      } catch (err) {
        io.emit("message-output-status", "message-output-error");
        return io.emit("message-output-error", err);
      }
    });

    socket.on("get-room-info", async (dataBody) => {
      try {
        const { _id } = await verifyToken(dataBody.token);
        const user = await UserModel.findOne(
          {
            _id: _id,
            chats: {
              $elemMatch: {
                friendId: dataBody.friendId,
              },
            },
          },
          {
            chats: {
              $elemMatch: {
                friendId: dataBody.friendId,
              },
            },
            friends: {
              $elemMatch: {
                _id: dataBody.friendId,
              },
            },
          }
        );
        const checkFreindStatus = await UserModel.findOne(
          {
            _id: dataBody.friendId,
            chats: {
              $elemMatch: {
                friendId: _id,
              },
            },
          },
          {
            friends: {
              $elemMatch: {
                _id: _id,
              },
            },
          }
        );

        const chatInfo = await ChatModel.findOne(
          {
            _id: String(user.chats[0].chatId),
          },
          { messages: 1 }
        );

        const decryptMessages = chatInfo.messages.map((messageObj) => {
          const decryptMessage = decrypt(messageObj.message);
          return { ...messageObj, message: decryptMessage };
        });
        chatInfo.messages = decryptMessages;
        socket.emit("output-room-info", {
          chatInfo,
          blockStatus:
            (user.friends[0] && user.friends[0].block) ||
            (checkFreindStatus && checkFreindStatus.friends[0].block),
          friendStatus: Boolean(user.friends[0]),
        });

        io.emit("get-room-info-status", "success");
      } catch (err) {
        io.emit("get-room-info-status", "get-room-info-error");
        return io.emit("get-room-info-error", err);
      }
    });
    /////////////////////////////////////*****CHAT*****////////////////////////////////////////////////////////
    /////////
    /////////
    /////////////////////////////////////*****USER*****////////////////////////////////////////////////////////
    socket.on("remove-or-block", async (dataBody) => {
      const { error } = validateRemoveORBlock(dataBody);
      if (error) {
        const listErrors = {};
        for (const detail of error.details) {
          listErrors[detail.path[0]] = detail.message;
        }
        io.emit("remove-or-block-status", "remove-or-block-error");
        return io.emit("remove-or-block-error", { errors: listErrors });
      }
      try {
        const { _id } = await verifyToken(dataBody.token);

        if (dataBody.answer === "remove") {
          await UserModel.updateOne(
            { _id: _id },
            {
              $pull: {
                friends: { _id: dataBody._id },
                chats: { friendId: dataBody._id },
              },
            }
          );
          await UserModel.updateOne(
            { _id: dataBody._id },
            { $pull: { friends: { _id: _id } } }
          );
        }

        if (dataBody.answer === "blockOrUnblock") {
          const user = await UserModel.findOne(
            {
              _id: _id,
              friends: { $elemMatch: { _id: dataBody._id } },
            },
            { friends: { $elemMatch: { _id: dataBody._id } } }
          );
          await UserModel.updateOne(
            {
              _id: _id,
              friends: { $elemMatch: { _id: dataBody._id } },
            },
            {
              $set: {
                "friends.$.block": !user.friends[0].block,
              },
            }
          );
        }
        io.emit("refresh-friend-status", {
          _id: _id,
          answer: dataBody.answer,
        });
        return io.emit("remove-or-block-status", "success");
      } catch (err) {
        io.emit("remove-or-block-status", "remove-or-block-error");
        return io.emit("remove-or-block-error", err);
      }
    });
    socket.on("add-friend", async (dataBody) => {
      const { error } = validateAddFriend(dataBody);
      if (error) {
        const listErrors = {};
        for (const detail of error.details) {
          listErrors[detail.path[0]] = detail.message;
        }
        io.emit("add-friend-status", "add-friend-error");
        return io.emit("add-friend-error", { errors: listErrors });
      }

      try {
        const { _id } = await verifyToken(dataBody.token);
        const data = await UserModel.updateOne(
          {
            _id: dataBody._id,
            requestFriend: {
              $not: {
                $elemMatch: {
                  _id: _id,
                },
              },
            },
            friends: {
              $not: {
                $elemMatch: {
                  _id: _id,
                },
              },
            },
          },
          {
            $addToSet: {
              requestFriend: {
                _id: _id,
                avatar: dataBody.avatar,
                message: dataBody.message,
                name: dataBody.name,
              },
            },
          }
        );
        if (data.nModified === 0) {
          io.emit("add-friend-status", "already-friends-error");
          return io.emit("already-friends-error", {
            errors: "you already sent request or you already friends",
          });
        }
        io.emit("refresh-notifications", {
          _id: dataBody._id,
          requestFriend: {
            _id: _id,
            avatar: dataBody.avatar,
            message: dataBody.message,
            name: dataBody.name,
          },
        });
        return io.emit("add-friend-status", "success");
      } catch (err) {
        io.emit("add-friend-status", "add-friend-error");
        return io.emit("add-friend-error", err);
      }
    });
  });
};

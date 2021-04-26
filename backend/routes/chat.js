const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { decrypt } = require("../encryptionText");
const {
  ChatModel,
  validateChat,
  validateNewMessage,
} = require("../models/chat");
const { UserModel } = require("../models/user");

//// alll chats of user
router.get("/", auth, async (req, res) => {
  try {
    const chats = await UserModel.findOne(
      {
        _id: req.userToken._id,
      },
      {
        chats: 1,
        _id: 0,
      }
    );
    const newArray = [];

    var promises = chats.chats.map(async (chat) => {
      let friendInfo = await UserModel.findOne(
        { _id: chat.friendId },
        { name: 1, avatar: 1 }
      );
      let chatInfo = await ChatModel.findOne(
        { _id: chat.chatId },
        { lestMessage: 1, timeForTheLastMessage: 1 }
      );
      if (chatInfo.lestMessage.iv) {
        chatInfo.lestMessage = decrypt(chatInfo.lestMessage);
      }

      return newArray.push({ friendInfo, chatInfo });
    });

    Promise.all(promises).then(() => {
      res.json(newArray);
    });
  } catch (errors) {
    res.status(400).json({ errors });
  }
});

/// create new chat
router.post("/", auth, async (req, res) => {
  const { error } = validateChat(req.body);
  if (error) {
    const listErrors = {};
    for (const detail of error.details) {
      listErrors[detail.path[0]] = detail.message;
    }
    return res.status(400).send({
      errors: listErrors,
    });
  }
  try {
    ////// check if the user have the friend in friend list and not have chat with it
    const check = await UserModel.findOne({
      _id: req.userToken._id,
      friends: {
        $elemMatch: {
          _id: req.body.idUser2,
        },
      },
      chats: {
        $not: {
          $elemMatch: {
            friendId: req.body.idUser2,
          },
        },
      },
    });

    if (!check) {
      return res
        .status(400)
        .json(
          "you have already have chat with this user or you are not friends"
        );
    } else {
      //// check if the user have chat befor with the friend
      const checkOldChat = await UserModel.findOne(
        {
          _id: req.body.idUser2,
          friends: {
            $elemMatch: {
              _id: req.userToken._id,
            },
          },
          chats: {
            $elemMatch: {
              friendId: req.userToken._id,
            },
          },
        },
        {
          chats: {
            $elemMatch: {
              friendId: req.userToken._id,
            },
          },
          _id: 0,
        }
      );
      if (checkOldChat) {
        await UserModel.updateOne(
          { _id: req.userToken._id },
          {
            $addToSet: {
              chats: {
                chatId: String(checkOldChat.chats[0].chatId),
                friendId: req.body.idUser2,
              },
            },
          }
        );
        return res.json({ message: "return the user to the old chat success" });
      }

      const dataBody = req.body;
      dataBody.idUser1 = req.userToken._id;
      const data = await ChatModel.insertMany(dataBody);
      //// user
      await UserModel.updateOne(
        { _id: req.userToken._id },
        {
          $addToSet: {
            chats: { chatId: String(data[0]._id), friendId: req.body.idUser2 },
          },
        }
      );
      //// freind
      await UserModel.updateOne(
        { _id: req.body.idUser2 },
        {
          $addToSet: {
            chats: { chatId: String(data[0]._id), friendId: req.userToken._id },
          },
        }
      );
      res.json(data);
    }
  } catch (errors) {
    res.status(400).json({ errors });
  }
});

/////////////// delete chat
router.delete("/:_id", auth, async (req, res) => {
  try {
    const _id = req.params._id;

    await UserModel.updateOne(
      { _id: req.userToken._id },
      { $pull: { chats: { chatId: _id } } }
    );

    const check = await UserModel.find({
      chats: {
        $elemMatch: {
          chatId: _id,
        },
      },
    });
    if (!check.length) {
      await ChatModel.deleteOne({ _id });
    }
    res.json("deleted");
  } catch (errors) {
    res.status(400).json({ errors });
  }
});
/////////////// new message
router.put("/newMessage/:_id", auth, async (req, res) => {
  const { error } = validateNewMessage(req.body);
  if (error) {
    const listErrors = {};
    for (const detail of error.details) {
      listErrors[detail.path[0]] = detail.message;
    }
    return res.status(400).send({
      errors: listErrors,
    });
  }

  try {
    const _id = req.params._id;
    const message = req.body.message;
    message.userId = req.userToken._id;
    const data = await ChatModel.updateOne(
      {
        _id,
        $or: [{ idUser1: req.userToken._id }, { idUser2: req.userToken._id }],
      },
      {
        $push: { messages: message },
        lestMessage: message.message,
        timeForTheLastMessage: message.date,
      }
    );
    res.json(data);
  } catch (errors) {
    res.status(400).json({ errors });
  }
});

// search in friends list
router.get("/search-in-chat-list", auth, async (req, res) => {
  let searchQ = req.query.searchValue;
  /// The RegExp is used to perform case-insensitive matching and if the value not 100% matching.
  let expSearchQ = new RegExp(searchQ, "i");
  try {
    const user = await UserModel.find(
      {
        _id: req.userToken._id,
        friends: { $elemMatch: { name: expSearchQ } },
      },
      { friends: 1, _id: 0 }
    );
    if (user.length) {
      const friendsNames = user[0].friends.filter((friend) =>
        friend.name.match(expSearchQ)
      );

      const friendsId = friendsNames.map((friend) => {
        return friend._id;
      });

      const newArray = [];

      const promises = friendsId.map(async (_id) => {
        let friendInfo = await UserModel.findOne(
          { _id },
          { name: 1, avatar: 1 }
        );
        let chatInfo = await ChatModel.findOne(
          {
            $or: [
              {
                $and: [
                  { idUser1: req.userToken._id },
                  { idUser2: friendInfo._id },
                ],
                $and: [
                  { idUser1: friendInfo._id },
                  { idUser2: req.userToken._id },
                ],
              },
            ],
          },
          { lestMessage: 1, timeForTheLastMessage: 1 }
        );
        return newArray.push({ friendInfo, chatInfo });
      });

      Promise.all(promises).then(() => {
        res.json(newArray);
      });
    } else {
      res.json([]);
    }
  } catch (errors) {
    console.log(errors);
    return res.status(400).json({ errors });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const _ = require("lodash");

const {
  UserModel,
  validateEditUser,
  validateEmail,
  validatePassword,
  validateResetPassword,
  validateUser,
  validateRequestAnswer,
} = require("../models/user");
const { secret } = require("../config/secret");
const { sendEmail } = require("./email");

const sendEmailForConfirm = async (email, id) => {
  const token = Jwt.sign({ id }, secret.EMAIL_CONFIRM);

  //////// Created Date
  const date = new Date();
  const Created =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    ":" +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();

  //// output of email
  const output = `
       <h3>Confirm Email </h3>
       <p>Thank you for signing up for cloud Chat.</p>
       <p>Please verify your email address by clicking the link below: </p>
       <a href="${secret.CLIENT_URL}/confirm-email/${token}">verify Email</a>
         <br/>
         <br/>
      <hr />
      <p>If you haven't applied for CamScanner account, please ignore this email.</p>
      <p>We wish you a pleasant time with us!</p>
      <p>CamScanner Team</p>
      <hr />
      <br/>
      <br/>
       UserEmail: ${email}
       <br/>
       Created:${Created}
       </p>
      `;

  //// mailOptions
  const mailOptions = {
    from: secret.EMAILACCOUNT,
    to: email,
    subject: "Confirm Email",
    html: output,
  };

  //// send email
  const emailResult = await sendEmail(mailOptions);
  return emailResult;
};

//// add new user
router.post("/", async (req, res) => {
  let { error } = validateUser(req.body);
  if (error) {
    const listErrors = {};
    for (const detail of error.details) {
      listErrors[detail.path[0]] = detail.message;
    }
    return res.status(400).json({
      errors: listErrors,
    });
  }
  try {
    let checkEmail = await UserModel.findOne({ email: req.body.email });
    if (checkEmail)
      return res.status(400).json({
        errors: {
          email: "User already registered.",
        },
      });
    let checkName = await UserModel.findOne({ name: req.body.name });
    if (checkName)
      return res.status(400).json({
        errors: {
          name: "name already taken",
        },
      });
    let user = new UserModel(req.body);
    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    let defaultImg = "/public/users_avatar/defula_avatir_image.png";
    user.avatar = user.avatar || defaultImg;

    sendEmailForConfirm(req.body.email, user._id);

    await user.save();
    res.json(_.pick(user, ["createdAt", "_id", "name", "email"]));
  } catch (err) {
    res.status(400).json({ err: err.errmsg });
  }
});

//// verify verify ConfirmEmail Token
const verifyConfirmEmailToken = (resetConfirmEmailToken) => {
  return new Promise((resolve, reject) => {
    Jwt.verify(resetConfirmEmailToken, secret.EMAIL_CONFIRM, (err, payload) => {
      if (err) {
        return reject("the request Incorrect ");
      }
      const id = payload.id;
      resolve({ id });
    });
  });
};

router.put("/confirm-email/:token", async (req, res) => {
  try {
    const { id } = await verifyConfirmEmailToken(req.params.token);
    if (!id) {
      return res.status(400).json({ error: "the request Incorrect" });
    }
    await UserModel.updateOne({ _id: id }, { confirm: true });

    res.json({ message: "your email if verify" });
  } catch (err) {
    res.status(400).json({ errors: err });
  }
});

//// user information
router.get("/me", auth, async (req, res) => {
  try {
    const userData = await UserModel.findOne(
      { _id: req.userToken._id },
      { password: 0, __v: 0, resetLink: 0, confirm: 0, createdAt: 0, email: 0 }
    );
    res.json(userData);
  } catch (error) {
    res.status(400).json(error);
  }
});

/// Edit user
router.put("/edit", auth, async (req, res) => {
  const { error } = validateEditUser(req.body);
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
    const user = await UserModel.updateOne(
      { _id: req.userToken._id },
      req.body
    );
    await UserModel.updateMany(
      {
        friends: {
          $elemMatch: {
            _id: req.userToken._id,
          },
        },
      },
      {
        $set: {
          "friends.$.name": req.body.name,
        },
      }
    );

    res.json(user);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

//// chagne user password
router.put("/changePassword", auth, async (req, res) => {
  const { error } = validatePassword(req.body);
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
    const { password } = await UserModel.findOne({ _id: req.userToken._id });
    const validPassword = await bcrypt.compare(req.body.password, password);
    if (!validPassword) {
      return res.status(400).json({ errors: { password: "Invalid password" } });
    }
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.newPassword, salt);
    const data = await UserModel.updateOne(
      { _id: req.userToken._id },
      { password: newPassword }
    );
    res.status(201).json(data);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

//// send forgot password email
router.put("/forgotPassword", async (req, res) => {
  ///// return errors
  let { error } = validateEmail(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details[0].message });
  }

  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        errors: "email not exists",
      });
    }
    const { email, _id } = user;

    /// token sign
    const token = Jwt.sign(
      { email: email, id: _id },
      secret.RESET_PASSWORD_KEY,
      {
        expiresIn: "20m",
      }
    );

    //////// Created Date
    const date = new Date();
    const Created =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getDate() +
      ":" +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds();

    //// output of email
    const output = `
       <h3>Reset Password</h3>
       <p>
       A password reset event has been triggered. The password reset window is limited to 20 minutes.
       </p>
        <p>
       If you do not reset your password within 20 minutes, you will need to submit a new request.
      </p>
       <p>
       To complete the password reset process, visit the following link:
      </p>
       <a href="${secret.CLIENT_URL}/reset-password/${token}">http://localhost:3000/reset-password/${token}</a>
         <br/>
         <br/>
       UserEmail: ${email}
       <br/>
       Created:${Created}
       </p>
      `;
    ///////  update user resetLink
    const data = await UserModel.updateOne({ _id }, { resetLink: token });

    ///// return error
    if (!data) {
      return res.status(400).json({ errors: "reset password linke error" });
    }

    //// mailOptions
    const mailOptions = {
      from: secret.EMAILACCOUNT,
      to: email,
      subject: "Reset Password",
      html: output,
    };

    //// send email
    const emailResult = await sendEmail(mailOptions);

    res.json(emailResult);
  } catch (error) {
    res.status(400).json({ errors });
  }
});

//// verify reset-password-token
const verifyResetPasswordToken = (resetPasswordToken) => {
  return new Promise((resolve, reject) => {
    Jwt.verify(
      resetPasswordToken,
      secret.RESET_PASSWORD_KEY,
      (err, payload) => {
        if (err) {
          return reject(
            "the request expired, you will need to submit a new request"
          );
        }
        const email = payload.email;
        const id = payload.id;
        resolve({ id, email });
      }
    );
  });
};

router.put("/reset-password", async (req, res) => {
  const { error } = validateResetPassword(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { resetLink, newPassword } = req.body;

  try {
    if (!resetLink) {
      return res.status(400).json({ error: "Authentication error" });
    }

    const { email, id } = await verifyResetPasswordToken(resetLink);

    if (email && id) {
      const user = await UserModel.findOne({ email, resetLink, _id: id });
      if (!user) {
        return res.status(400).json({
          error: "the request expired, you will need to submit a new request",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const newPasswordBcrypt = await bcrypt.hash(newPassword, salt);

      await UserModel.updateOne(
        { _id: id },
        { password: newPasswordBcrypt, resetLink: "" }
      );

      ///// send email to user
      const date = new Date();
      const Created =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        ":" +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();

      //// output of email
      const output = `
        <h3>	Password Change Confirmation </h3>
        <p>
        Your password was successfully changed.
        </p>  
        <br/>
        UserEmail: ${email}
        <br/>
        Created:${Created}
        </p>
        `;

      //// mailOptions
      const mailOptions = {
        from: secret.EMAILACCOUNT,
        to: email,
        subject: "Password Change Confirmation",
        html: output,
      };

      //// send email
      const emailResult = await sendEmail(mailOptions);
      res.json(emailResult);
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});
//newFriendsSearch
// search new friends and add him to your friends list
router.get("/newFriendsSearch", auth, async (req, res) => {
  let searchQ = req.query.searchValue;
  /// The RegExp is used to perform case-insensitive matching and if the value not 100% matching.
  let expSearchQ = new RegExp(searchQ, "i");

  try {
    const data = await UserModel.find(
      { name: expSearchQ, _id: { $not: { $eq: req.userToken._id } } },
      { name: 1, _id: 1, avatar: 1 }
    );

    res.json(data);
  } catch (errors) {
    return res.status(400).json({ errors });
  }
});

router.get("/get-friends-list", auth, async (req, res) => {
  try {
    const results = await UserModel.findOne(
      {
        _id: req.userToken._id,
      },
      { friends: { _id: 1 }, _id: 0 }
    );
    const friends = [];
    results.friends.map((friend) => {
      friends.push(friend._id);
    });

    const data = await UserModel.find(
      {
        _id: { $in: friends },
      },
      { name: 1, avatar: 1, _id: 1 }
    );

    res.json(data);
  } catch (errors) {
    return res.status(400).json({ errors });
  }
});
router.get("/notificetion", auth, async (req, res) => {
  try {
    const data = await UserModel.findOne(
      { _id: req.userToken._id },
      { requestFriend: 1, _id: 0 }
    );
    res.json(data);
  } catch (errors) {
    return res.status(400).json({ errors });
  }
});

// answer to the request about add friend
router.put("/requestanswer", auth, async (req, res) => {
  const { error } = validateRequestAnswer(req.body);
  if (error) {
    const listErrors = {};
    for (const detail of error.details) {
      listErrors[detail.path[0]] = detail.message;
    }
    return res.status(400).send({
      errors: listErrors,
    });
  }

  const answer = req.body.answer;
  try {
    if (answer) {
      await UserModel.updateOne(
        { _id: req.userToken._id },
        {
          $addToSet: {
            friends: {
              _id: req.body._id,
              block: false,
              name: req.body.friendName,
            },
          },
        }
      );
      await UserModel.updateOne(
        { _id: req.body._id },
        {
          $addToSet: {
            friends: {
              _id: req.userToken._id,
              block: false,
              name: req.body.myName,
            },
          },
        }
      );
    }
    await UserModel.updateOne(
      { _id: req.userToken._id },
      { $pull: { requestFriend: { _id: req.body._id } } }
    );
    res.json("success");
  } catch (errors) {
    return res.status(400).json({ errors });
  }
});

// search in friends list
router.get("/search-in-friend-list", auth, async (req, res) => {
  let searchQ = req.query.searchValue;
  /// The RegExp is used to perform case-insensitive matching and if the value not 100% matching.
  let expSearchQ = new RegExp(searchQ, "i");
  try {
    const userFriendList = await UserModel.findOne(
      {
        _id: req.userToken._id,
        friends: { $elemMatch: { name: expSearchQ } },
      },
      { friends: 1, _id: 0 }
    );
    if (userFriendList && userFriendList.friends.length) {
      const friendsNames = userFriendList.friends.filter((friend) =>
        friend.name.match(expSearchQ)
      );

      const friendsId = friendsNames.map((friend) => {
        return friend._id;
      });

      const data = await UserModel.find(
        {
          _id: { $in: friendsId },
        },
        { name: 1, avatar: 1, _id: 1 }
      );

      return res.json(data);
    }
    return res.json(
      userFriendList && userFriendList.friends.length
        ? userFriendList.friends
        : []
    );
  } catch (errors) {
    return res.status(400).json({ errors });
  }
});

module.exports = router;

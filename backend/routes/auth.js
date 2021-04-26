const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/secret");
const { UserModel } = require("../models/user");
const router = express.Router();

/// login
router.post("/", async (req, res) => {
  let { error } = validLoginUser(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }
  let user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }
  let validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const checkConfirm = await UserModel.findOne({ email: req.body.email });

  if (!checkConfirm.confirm) {
    return res.status(400).json({
      error:
        "you need to confirm your email  check your email to confirm your email ",
    });
  }

  res.json({
    token: generateToken(user._id),
    refreshToken: generateRefreshToken(user._id),
  });
});

//// generate Token
const generateToken = (_id) => {
  let token = jwt.sign({ _id: _id }, secret.JWTSecretKey, {
    expiresIn: "2h",
  });
  return token;
};

//// generate Refresh  Token
const generateRefreshToken = (_id) => {
  let token = jwt.sign({ _id: _id }, secret.REFRESH_TOKEN, {
    expiresIn: "1d",
  });
  return token;
};

//// verify refresh-token
const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, secret.REFRESH_TOKEN, (err, payload) => {
      if (err) {
        return reject("invalid refreshToken or expired refreshToken");
      }
      const _id = payload._id;
      resolve({ _id });
    });
  });
};

/// refresh token
router.post("/refreshToken", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).send("Unauthorized");
    }
    const { _id } = await verifyRefreshToken(refreshToken);

    const token = await generateToken(_id);
    const refToken = await generateRefreshToken(_id);
    res.json({
      token: token,
      refreshToken: refToken,
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

/// valid Login User
const validLoginUser = (_userBody) => {
  let schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(_userBody);
};

module.exports = router;

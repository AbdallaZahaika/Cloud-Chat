const jwt = require("jsonwebtoken");
const { secret } = require("../config/secret");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, secret.JWTSecretKey);
    req.userToken = decoded;
    next();
  } catch (ex) {
    return res
      .status(401)
      .json({ message: "invalid token or expired token, try login again" });
  }
};

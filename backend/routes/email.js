const nodemailer = require("nodemailer");
const { secret } = require("../config/secret");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: secret.EMAILACCOUNT,
    pass: secret.EMAILPASSWORD,
  },
});

///// send email function
/**
 * @param {object} mailOptions [mailOptions]
 * @returns {string} [status of email]
 */
exports.sendEmail = async (mailOptions) => {
  return new Promise((resolve, reject) => {
    //// send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error.message);
      } else {
        resolve("email sent");
      }
    });
  });
};

const express = require("express");
const router = express.Router();
const { sendEmail } = require("./email");
const Joi = require("joi");
const { secret } = require("../config/secret");
///validate
const validateContactUs = (_contactUs) => {
  ////////// schema reagex Email
  const emailRegExp = /^[a-z0-9\._\-\+]{2,50}@[a-z\-0-9]+(\.[a-z]{2,10})+$/i;

  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().regex(emailRegExp),
    subject: Joi.string().min(2).max(125).required(),
    message: Joi.string().min(2).max(1025).required(),
  });
  return schema.validate(_contactUs);
};

////// send a contact us email
router.post("/", async (req, res) => {
  ///// return errors
  let { error } = validateContactUs(req.body);
  if (error) {
    const listErrors = {};
    for (const detail of error.details) {
      listErrors[detail.path[0]] = detail.message;
    }
    return res.status(400).json({
      errors: listErrors,
    });
  }

  const subject = req.body.subject;
  const message = req.body.message;
  const email = req.body.email;

  //// output of email
  const output = `
  <h3>from:</h3>
  ${email}
  <h3>message:</h3>
  <p>${message}</p>
  `;
  //// mailOptions
  const mailOptions = {
    from: secret.EMAILACCOUNT,
    to: secret.EMAILACCOUNT,
    subject: subject,
    html: output,
  };

  //// output of email
  const outputEmailSend = `
  <h4>Thank you for Contact Us. We will reply to you as soon as possible</h4>
  `;
  //// mailOptions  EmailSend to user
  const mailOptionsEmailSend = {
    from: secret.EMAILACCOUNT,
    to: email,
    subject: `thanks you for Contact Us`,
    html: outputEmailSend,
  };
  try {
    //// send email
    const emailResult = await sendEmail(mailOptions);
    //// send email to user
    await sendEmail(mailOptionsEmailSend);
    res.json(emailResult);
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;

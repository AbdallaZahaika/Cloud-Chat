const fileUpload = require("express-fileupload");
const users = require("./users");
const auth = require("./auth");
const contactUs = require("./contactUs");
const uploadimage = require("./uploadImage");
const chat = require("./chat");

exports.routersInit = (app) => {
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/contactUs", contactUs);
  app.use("/api/uploadImage", uploadimage);
  app.use("/api/chat", chat);
  app.use((req, res) => {
    res.status(404).json({ msg: "404 url page not found" });
  });
};

exports.fileUploadAccess = (app) => {
  app.use(
    fileUpload({
      limits: { fileSize: 5 * (1024 * 1024) },
    })
  );
};

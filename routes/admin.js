const express = require("express");
const programRouter = require("./program");
const teacherRouter = require("./teacher");
const classRouter = require("./class");
const User = require("../Schema/userSchema");
const auth = require("../config/auth");

const router = express.Router();

// setup admin user
router.get("/", async (req, res) => {
  const response = {
    status: true,
    data: {},
    err: {},
    msg: "",
  };

  try {
    const adminSchema = {
      username: "admin",
      password: auth.hash("admin"),
    };

    // check if admin already exists
    let admin = await User.findOne(adminSchema);
    if (admin) {
      response.msg = "Admin user found.";
      return res.json(response);
    }

    admin = new User(adminSchema);

    if (admin.save()) {
      response.msg = "New Admin user created.";
    }

    return res.json(response);
  } catch (err) {
    return res.json({
      status: false,
      err,
      msg: "!!! Admin user not found",
    });
  }
});

// router.use(auth.isAdmin())

router.use("/api/teacher", auth.isLoggedIn, auth.isAdmin, teacherRouter);
router.use("/api/program", auth.isLoggedIn, auth.isAdmin, programRouter);
// router.use("/api/class", auth.isLoggedIn, auth.isAdmin, classRouter);

module.exports = router;

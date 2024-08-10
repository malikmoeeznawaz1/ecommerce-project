const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports.isLoggedIn = async function (req, res, next) {
  if (!req.cookies.token) {
    req.flash("error", "Please login to access this page");
    res.redirect("/");
  } else {
    try {
      let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);

      let user = await userModel
        .findOne({ email: decoded.email })
        .select("-password");        

      req.user = user;

      next();
    } catch (error) {
      req.flash("error", "Something went wrong, please login again");
      res.redirect("/");
    }
  }
};

const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const { createDemoData } = require("../middleware/createDemoData");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

exports.register = catchAsync(async (req, res, next) => {
  await User.create({
    username: req.body.username,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  res.status(200).json({
    status: "success",
    message: "User created",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // 1) Check if email and password exist
  if (!username || !password) {
    return res.status(400).json({
      status: "success",
      message: "Please provide email and password!",
    });
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ username }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: "success",
      message: "Incorrect email or password",
    });
  }

  await createDemoData();

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  return next();
});

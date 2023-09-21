const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

exports.auth = catchAsync(async (req, res, next) => {
  if (!req.headers || !req.headers.authorization) {
    return res.status(403).json({
      status: 'fail',
      message: 'Unauthenticated!',
    });
  }

  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return res.status(403).json({
        status: 'fail',
        message: 'Token Expired',
      });
    }
    next();
  });
});

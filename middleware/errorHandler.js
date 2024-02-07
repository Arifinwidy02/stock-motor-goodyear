function errorHandler(err, req, res, next) {
  let obj = { code: 500, response: { message: `Internal Server Error` } };
  if (
    err.name == `SequelizeValidationError` ||
    err.name == "SequelizeUniqueConstraintError"
  ) {
    obj.code = 400;
    obj.response = { message: err.errors[0].message };
  }
  res.status(obj.code).json(obj.response);
}

module.exports = errorHandler;

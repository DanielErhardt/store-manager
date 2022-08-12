const errorHandler = async (error, _req, res, _next) => {
  const { status, message } = error;
  res.status(status).json({ message });
};

module.exports = errorHandler;
const errorHandler = async (error, _req, res, _next) => {
  const { status, message } = error;
  return status
    ? res.status(status).json({ message })
    : res.status(500).json({ message: 'Something went wrong' });
};

module.exports = errorHandler;

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    error: "Error interno del servidor"
  });
};

export default errorMiddleware;
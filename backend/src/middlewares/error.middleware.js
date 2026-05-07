const errorMiddleware = (err, req, res, next) => {
  console.log(err);

  res.status(500).json({
    error: "Error interno del servidor"
  });
};

export default errorMiddleware;
export const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.send({ message: err.message || "Server Error...!" });
};

export default errorHandler;

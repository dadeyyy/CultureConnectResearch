import ExpressError from "./ExpressError.js";
export const errorHandler = (error, req, res, next) => {
    // Check if the error is an instance of ExpressError
    if (error instanceof ExpressError) {
        console.log(error);
        res.status(error.statusCode).json({ error: error.message });
    }
    else {
        // Handle other types of errors
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const catchAsync = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
};
//# sourceMappingURL=errorHandler.js.map
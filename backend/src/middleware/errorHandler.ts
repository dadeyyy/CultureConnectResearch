import { Request, Response, NextFunction } from "express"
import ExpressError from "./ExpressError.js"

type ErrorHandlerMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => void

export const errorHandler: ErrorHandlerMiddleware = (error, req,res, next) =>{
    // Check if the error is an instance of ExpressError
    if (error instanceof ExpressError) {
        res.status(error.statusCode).json({ error: error.message });
    } else {
        // Handle other types of errors
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const catchAsync = (fn: any) => {
    return function(req:Request, res:Response, next:NextFunction) {
        fn(req, res, next).catch(next);
    };
}
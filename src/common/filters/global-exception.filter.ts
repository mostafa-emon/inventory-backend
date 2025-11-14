import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from 'express';
import { MongoServerError } from 'mongodb';
import { Error as MongooseError } from "mongoose";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let res:any = [];
        let errorCode:any = 404;
        let exceptionType:string = 'Unknown';
        
        if(exception instanceof HttpException) {
            res             = exception.getResponse();
            errorCode       = exception.getStatus(); 
            exceptionType   = 'HttpException';
        } else if(exception instanceof MongoServerError) {
            res             = exception.errmsg;
            errorCode       = exception.code;
            exceptionType   = 'MongoException';
        } else if(exception instanceof MongooseError.CastError) {
            res             = exception.reason;
            errorCode       = 400;
            exceptionType   = 'CastError';
        }

        const message = typeof res === 'string'
            ? [res]
            : Array.isArray((res as any).message)
                ? (res as any).message
                : (res as any).message
                    ? [(res as any).message]
                    : ['Unknown error occured!'];

        response.json({
            success: false,
            errorCode,
            exceptionType,
            message,
            stackTrace: exception.stack
        });
    }
}
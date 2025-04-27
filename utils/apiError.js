class ApiError extends Error {
    constructor(statusCode, message, details = null, isOperational = true, stack = ""){
        message = typeof message === 'object' ? JSON.stringify(message) : message ;
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;

        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = ApiError;
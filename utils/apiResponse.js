const ApiError = require('./apiError');

const sendSucess = (
    res,
    {
        message = 'Success',
        data = null,
        statusCode = 200,
        method = 'json',
        ...others
    } = {}
) => {
    res.status(statusCode)[method]({
        success:true,
        message,
        data,
        ...others,
    });
}

export const successResponse = {
    created: (res, options = {}) => 
        sendSucess(res, {
            ...options,
            statusCode: 201,
            message: options.message ?? 'Resource created successfully'
        }),

    fetched: (res, options = {}) => 
        sendSucess(res, {
            ...options,
            statusCode: 200,
            message: options.message ?? 'Resource fetched successfully'
        }),

    updated: (res, options = {}) => 
        sendSucess(res, {
            ...options,
            statusCode: 200,
            message: options.message ?? 'Resource updated successfully'
        }),

    deleted: (res, options = {}) => 
        sendSucess(res, {
            ...options,
            statusCode: 200,
            message: options.message ?? 'Resource deleted successfully'
        })
};

export const errorResponse = ({
    statusCode = 500,
    message = 'Something went wrong, please try again.',
    details = null,
    isOperational = true,
    stack = '',
  } = {}) => {
    throw new ApiError(statusCode, message, details, isOperational, stack);
  };
const multer = require("multer");
const ApiError = require("../utils/apiError");
const { StatusCodes } = require('http-status-codes');

const buildUploadMiddleware = (fieldConfigs = {}) => {
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    const field = fieldConfigs[file.fieldname];
    if (!field) {
      return cb(new ApiError(StatusCodes.BAD_REQUEST, `Field '${file.fieldname}' is not allowed`), false);
    }
    if (!field.mimeTypes.includes(file.mimetype)) {
      return cb(new ApiError(StatusCodes.BAD_REQUEST, `Invalid type for '${file.fieldname}'`), false);
    }
    cb(null, true);
  };

  const multerInstance = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: Math.max(...Object.values(fieldConfigs).map(f => (f.maxSizeMB || 5) * 1024 * 1024)),
    },
  });

  const fields = Object.entries(fieldConfigs).map(([name, config]) => ({
    name,
    maxCount: config.maxCount || 1
  }));

  return (req, res, next) => {
    multerInstance.fields(fields)(req, res, err => {
      if (err instanceof multer.MulterError) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, err.message));
      } else if (err) {
        return next(err);
      }

      // Custom size validation per field
      for (const [fieldName, files] of Object.entries(req.files || {})) {
        const config = fieldConfigs[fieldName];
        for (const file of files) {
          const sizeMB = file.size / (1024 * 1024);
          if (sizeMB > config.maxSizeMB) {
            return next(new ApiError(StatusCodes.BAD_REQUEST, `${fieldName} file too large: max ${config.maxSizeMB}MB`));
          }
        }
      }

      next();
    });
  };
};

module.exports = buildUploadMiddleware;

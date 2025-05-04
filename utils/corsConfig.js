const cors = require("cors");

const defaultOrigins = ['*'];

const defaultHeaders = [
  'Content-Type',
  'Authorization'
];

const defaultMethods = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'OPTIONS'
];

const corsConfig = ({
  allowedOrigins = defaultOrigins,
  allowedHeaders = defaultHeaders,
  allowedMethods = defaultMethods,
  credentials = true
} = {}) => {
  return cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: Origin '${origin}' not allowed`), false);
    },
    methods: allowedMethods,
    allowedHeaders: allowedHeaders,
    credentials
  });
};

module.exports = corsConfig;

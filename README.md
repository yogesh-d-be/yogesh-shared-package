## node-mongo-core

A robust and production-ready core utility package for Node.js + MongoDB based projects. This package centralizes and abstracts common configurations, middleware, database setup, schema helpers, and utilities to streamline backend service development in monolithic or microservice architectures.

## Features

JWT Authentication Middleware

Multer File Upload Middleware Builder

Centralized Logging with Winston and Morgan

Joi-Based Schema Validation Utilities

Mongoose Connection and Model Builder

Centralized API Response Formatting

Configurable CORS Handling

Rate Limiting Middleware

Reusable Route Loader

Global Error Handler and Async Catcher

## Installation

npm install node-mongo-core

```

Or using yarn:

```
yarn add node-mongo-core
```

---

## Features

- ✅ Centralized configuration using `dotenv` & `Joi` schema validation
- ✅ Reusable middleware: logger, error handler, not found handler, CORS
- ✅ MongoDB connection with native retry strategy
- ✅ HTTP response utility with standard structure
- ✅ Async wrapper to eliminate repetitive `try/catch`
- ✅ Custom error classes for consistent error handling
- ✅ Secure headers & best practices pre-configured

---

## Project Structure Overview

node-mongo-core/
│
├── config/                  # App configuration & loggers
├── middleware/              # Reusable Express middleware
├── persistance/            # Mongoose connection & model builder
├── routes/                  # Route loader for auto-registering Express routes
├── schemas/                 # Schema field builder and registry
├── utils/                   # Utility functions (error, hash, response, etc.)
└── index.js                 # Exported module entrypoint

---


## Best Practices

- Place `node-mongo-core` as the first dependency in shared microservices
- Do not hard-code sensitive values; use `.env` with `Joi` validation
- Extend or override middleware as needed in each service
- Use centralized response structure for API consistency

---

## Security

- Includes `helmet`-like secure headers
- Built-in support for structured error messages
- Input validation should be handled at the service layer

---

## Future Enhancements

- Redis utilities for caching/session handling
- Rate limiting middleware
- Request schema validation middleware
- Multi-environment configuration loader

---

## Author

**Yogesh D** — MERN Stack Developer

---

## ðŸ“„ License

MIT Â© [Yogesh D]

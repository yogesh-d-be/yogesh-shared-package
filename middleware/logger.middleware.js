const loggerMiddleware = (req, res, next) => {
    const currentTime = new Date().toLocaleString();
    console.log(`[${currentTime}] ${req.method} ${req.originalUrl}`);
    

    if (Object.keys(req.body).length && config.app.env!=='production') {
      console.log('Request Body:', req.body);
    }
  
    next();
  };
  
  module.exports = loggerMiddleware;
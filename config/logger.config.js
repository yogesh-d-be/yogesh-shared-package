const path = require('path');
const {globalConfig} = require('./global.config');

const isDev = globalConfig.app.env !== 'production';

//common log rotation settings
const logOptions = {
   datePattern: 'DD-MM-YYYY',
   zippedArchive:true,
   maxSize:'20m',
   maxFiles:'30d' 
};


const logFiles ={
        info:path.join(__dirname, 'logs', 'app-%DATE%.log'),
        error:path.join(__dirname, 'logs', 'error-%DATE%.log')
    }


module.exports = {isDev, logOptions, logFiles};
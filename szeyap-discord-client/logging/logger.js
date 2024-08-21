const winston = require('winston');
const { combine, simple, colorize, printf, errors } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.APP_ENV === "DEVELOPMENT" ? combine(
    colorize(), 
    simple(),
    errors({ stack: true}),
    printf(info => {
      const { level, ...rest } = info;
      let rtn = "";
      // rtn += info.timestamp;
      rtn += "[" + info.level + "] ";
      if (rest.stack) {
        rtn += rest.message.replace(rest.stack.split("\n")[0].substr(7),"");
        rtn += "\n";
        rtn += "[" + level + "] ";
        rtn += rest.stack.replace(/\n/g, `\n[${level}]\t`);
      } else {
        rtn += rest.message;
      }
      return rtn;
    })
  )
    : 
    winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ],
  exceptionHandlers: [
    new winston.transports.Console()
  ],
  rejectionHandlers: [
    new winston.transports.Console()
  ]
});

module.exports = logger;
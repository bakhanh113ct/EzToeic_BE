import winston from "winston";

const { combine, timestamp, label, printf, colorize, prettyPrint } = winston.format;

const myFormat = printf(({ level, message, label, timestamp, service }) => {
  return `$[${timestamp}] [${service}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.label({ label: "Log!" }),
    winston.format.timestamp(),
    myFormat
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({
      // dirname: "../../logs/",
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      // dirname: "../../logs/",
      filename: "logs/info.log",
      level: "info",
    }),
    new winston.transports.File({
      // dirname: "../../logs/",
      filename: "logs/combined.log",
    }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.prettyPrint(),
  }));
}

export default logger;

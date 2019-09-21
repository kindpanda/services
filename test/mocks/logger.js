const logger = {
  debug: () => {},
  info: () => {},
  error: () => {},
  warn: () => {},
  context: () => logger,
  child: () => logger,
};

export default logger;

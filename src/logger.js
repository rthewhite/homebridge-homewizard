export class Logger {

  // Log levels:
  // 0: error/warn
  // 1: info
  // 2: debug
  logLevel = 1;

  constructor(log, logLevel) {
    if (!log) {
      throw new Error('No log function passed to logger constructor');
    }
    this.log = log;

    if (logLevel !== undefined) {
      this.logLevel = logLevel;
    }
  }

  error(msg) {
    this.log(msg);
  }

  warn(msg) {
    this.log(msg);
  }

  info(msg) {
    if (this.logLevel >= 1) {
      this.log(msg);
    }
  }

  debug(msg) {
    if (this.logLevel >= 2) {
      this.log(msg);
    }
  }
}

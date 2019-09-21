class Service {
  constructor(options = {}) {
    const { logger = console, services = {} } = options;
    this.logger = logger;
    this.services = services;
  }
}

export default Service;

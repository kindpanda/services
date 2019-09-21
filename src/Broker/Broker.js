import createError from 'http-errors';

class ServicesBroker {
  constructor(options) {
    const { logger } = options;
    this.logger = logger;
    this.middlewares = [];
    this.serviceOptionsFactory = () => {};

    this.services = new Map();
  }

  registerServices(servicesClasses) {
    servicesClasses.forEach(serviceClass => {
      const id = serviceClass.name.toLowerCase().replace(/^(.*)service$/, '$1');
      this.services.set(id, serviceClass);
    });

    this.logger && this.logger.info('Services registered', { services: this.services.keys() });
    return this.services.size;
  }

  registerServicesOptionsFactory(servicesOptionsFactory) {
    this.serviceOptionsFactory = servicesOptionsFactory;
  }

  async process({ service = '', action = '', args = {}, exposed = true } = {}) {
    const logger = this.logger && this.logger.context({ service, action, args, exposed });
    if (!this.services.has(service)) {
      logger && logger.error('Unknown service');
      throw createError(404, 'Unknown service');
    }

    const Service = this.services.get(service);

    const options = {
      ...this.serviceOptionsFactory(Service),
      exposed: true,
      logger: (this.logger && this.logger.child(service)) || console,
      services: new Proxy(
        {},
        {
          get: (obj1, serviceName) => {
            return new Proxy(
              {},
              {
                get: (obj2, actionName) => {
                  return (actionArgs = {}) =>
                    this.process({
                      service: serviceName,
                      action: actionName,
                      args: actionArgs,
                      exposed: false,
                    });
                },
              },
            );
          },
        },
      ),
    };

    const instance = new Service(options);
    if (!instance[action] || typeof instance[action] !== 'function') {
      logger && logger.error('Unknown action');
      throw createError(404, 'Unknown action');
    }

    const { expose = [] } = Service;
    if (exposed && !expose.includes(action)) {
      logger && logger.error('Unauthorized action');
      throw createError(403, 'Unauthorized action');
    }

    try {
      logger && logger.debug('Dispatch action');
      const rawResult = await instance[action](args);
      const result = this.middlewares.reduce((prev, middleware) => {
        return middleware(prev);
      }, rawResult);
      logger && logger.info('Dispatch action result', { result });
      return result;
    } catch (error) {
      logger && logger.error('Dispatching action error', { error });
      throw error;
    }
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }
}

export default ServicesBroker;

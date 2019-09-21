import Service from 'Service/Service';

class TestService extends Service {
  async publicAction(args = {}) {
    return { ok: 'public', args };
  }

  async privateAction(args = {}) {
    return { ok: 'private', args };
  }

  async publicActionCallingPrivateMethod(args = {}) {
    return this.privateAction(args);
  }

  async publicActionCallingAnotherServicePrivateMethod(args = {}) {
    return this.services.test.privateAction(args);
  }
}

TestService.expose = [
  'publicAction',
  'publicActionCallingPrivateMethod',
  'publicActionCallingAnotherServicePrivateMethod',
];

export default TestService;

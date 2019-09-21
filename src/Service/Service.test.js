import Service from './Service';
import TestService from 'test/services/TestService';

describe('Service works', () => {
  it('create a valid default instance', async () => {
    const instance = new Service();
    expect(instance).toBeInstanceOf(Service);
    expect(instance.logger).toBeDefined();
    expect(instance.services).toBeDefined();
  });

  it('return expected values on methods called ', async () => {
    const testInstance = new TestService();
    expect(testInstance.privateAction()).resolves.toEqual({ ok: 'private', args: {} });
    expect(testInstance.publicAction()).resolves.toEqual({ ok: 'public', args: {} });
    expect(testInstance.publicActionCallingPrivateMethod()).resolves.toEqual({ ok: 'private', args: {} });
  });
});

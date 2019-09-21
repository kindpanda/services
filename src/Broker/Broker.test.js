import Broker from './Broker';
import createError from 'http-errors';
import logger from 'test/mocks/logger';
import TestService from 'test/services/TestService';

describe('Broker works', () => {
  describe('Broker handle service actions', () => {
    let broker;

    beforeAll(() => {
      broker = new Broker({ logger });
      broker.registerServices([TestService]);
    });

    it('return a 404 error when calling an unknown service', () => {
      const options = { service: 'notExistingService', action: 'nonExistingAction', args: {} };
      expect(broker.process(options)).rejects.toEqual(createError(404, 'Unknown service'));
    });

    it('return a 404 error error when calling an unknown action', () => {
      const options = { service: 'test', action: 'nonExistingAction', args: {} };
      expect(broker.process(options)).rejects.toEqual(createError(404, 'Unknown action'));
    });

    it('return an 403 error when calling a private action', () => {
      const options = { service: 'test', action: 'privateAction', args: {} };
      expect(broker.process(options)).rejects.toEqual(createError(403, 'Unauthorized action'));
    });

    it('works when calling an action', async () => {
      const options = { service: 'test', action: 'publicAction', args: 'hello' };
      expect(broker.process(options)).resolves.toEqual({ ok: 'public', args: 'hello' });
    });

    it('works when calling an action with a private subaction', async () => {
      const options = { service: 'test', action: 'publicActionCallingPrivateMethod', args: 'hi' };
      expect(broker.process(options)).resolves.toEqual({ ok: 'private', args: 'hi' });
    });

    it('works when calling an action with a private subaction', async () => {
      const options = { service: 'test', action: 'publicActionCallingAnotherServicePrivateMethod', args: 'guten tag' };
      expect(broker.process(options)).resolves.toEqual({ ok: 'private', args: 'guten tag' });
    });
  });

  describe('Broker middlewares works', () => {
    let broker;

    beforeAll(() => {
      broker = new Broker({ logger });
      broker.registerServices([TestService]);
      broker.use(res => {
        return { middlewared: true };
      });
    });

    it('works when calling an action', async () => {
      const options = { service: 'test', action: 'publicAction', args: 'hello' };
      const res = await broker.process(options);
      expect(broker.process(options)).resolves.toEqual({ middlewared: true });
    });
  });
});

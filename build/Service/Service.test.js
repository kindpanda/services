"use strict";

var _Service = _interopRequireDefault(require("./Service"));

var _TestService = _interopRequireDefault(require("../../test/services/TestService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Service works', () => {
  it('create a valid default instance', async () => {
    const instance = new _Service.default();
    expect(instance).toBeInstanceOf(_Service.default);
    expect(instance.logger).toBeDefined();
    expect(instance.services).toBeDefined();
  });
  it('return expected values on methods called ', async () => {
    const testInstance = new _TestService.default();
    expect(testInstance.privateAction()).resolves.toEqual({
      ok: 'private',
      args: {}
    });
    expect(testInstance.publicAction()).resolves.toEqual({
      ok: 'public',
      args: {}
    });
    expect(testInstance.publicActionCallingPrivateMethod()).resolves.toEqual({
      ok: 'private',
      args: {}
    });
  });
});
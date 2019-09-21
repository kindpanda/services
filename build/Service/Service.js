"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Service {
  constructor(options = {}) {
    const {
      logger = console,
      services = {}
    } = options;
    this.logger = logger;
    this.services = services;
  }

}

var _default = Service;
exports.default = _default;
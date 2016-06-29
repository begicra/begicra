'use strict';

const middlewares = {};

module.exports = factory => (req, res, next) => {
  const id = req.baseUrl;

  const middleware = middlewares[id] = middlewares[id] || factory(id);
  middleware(req, res, next);
};

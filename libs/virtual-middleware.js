'use strict';

module.exports = factory => (req, res, next) => {
  const pathname = req.baseUrl;
  const middleware = factory(pathname);
  middleware(req, res, next);
};

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/api/login',
    handler: handler.postAuthenticationHandler,
  },
]);

module.exports = routes;

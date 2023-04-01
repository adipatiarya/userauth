const routes = (handler) => ([
  {
    method: 'POST',
    path: '/login',
    handler: handler.postAuthenticationHandler,
  },
]);

module.exports = routes;

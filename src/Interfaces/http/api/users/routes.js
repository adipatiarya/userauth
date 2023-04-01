const routes = (handler) => ([
  {
    method: 'POST',
    path: '/users',
    handler: (req, h) => handler.postUserHandler(req, h),
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: (req) => handler.getUserHandler(req),
  },
  {
    method: 'GET',
    path: '/users',
    handler: () => handler.getUsersHandler(),
  },
]);

module.exports = routes;

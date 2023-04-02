const routes = (handler) => ([
  {
    method: 'POST',
    path: '/api/users',
    handler: (req, h) => handler.postUserHandler(req, h),
  },
  {
    method: 'GET',
    path: '/api/users/{id}',
    handler: (req) => handler.getUserHandler(req),
  },
  {
    method: 'GET',
    path: '/api/users',
    handler: () => handler.getUsersHandler(),
  },
  {
    method: 'DELETE',
    path: '/api/users/{id}',
    handler: (req) => handler.deleteUsersHandler(req),
  },
]);

module.exports = routes;

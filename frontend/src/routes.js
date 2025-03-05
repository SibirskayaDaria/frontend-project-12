const apiPath = '/api/v1';

export default {
  loginPath: () => [apiPath, 'login'].join('/'),
  signupPath: () => [apiPath, 'signup'].join('/'),
  dataPath: () => [apiPath, 'channels'].join('/'),
  channelPath: (id) => `/api/v1/channels/${id}`,
  chatPagePath: () => '/',
  loginPagePath: () => '/login',
  signUpPagePath: () => '/signup', // Добавлено
  notFoundPagePath: () => '*',
};

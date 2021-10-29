const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:4400',
      changeOrigin: true,
      ws: true,
      secure: false,
    }),
  )
}

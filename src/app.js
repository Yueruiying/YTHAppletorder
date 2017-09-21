const express = require('express')
const app = express()
const log = require('debug')('app')
const path = require('path')
const {server} = require('./config')
const proxy = require('http-proxy-middleware');

const serve = express.static(path.join(__dirname, 'public'))

const mobileServe = express.static(path.join(__dirname, 'mobile_public'))

const wwwServe = express.static(path.join(__dirname, 'www_public'))

app.use(serve)
app.use('/m', mobileServe)

if (process.env.NODE_ENV === 'development') {
    app.use('/', wwwServe)
} else {
    app.use('/www', wwwServe)
}

app.use('/m/pages/2017-09-01', proxy(
  {
    target: 'http://u4695638.viewer.maka.im/', 
    changeOrigin: true,
    pathRewrite: {
      '^/m/pages/2017-09-01' : '/',     // rewrite path
    }
  }
));

app.listen(server.port, function () {
  log(`server running on port ${server.port}`)
})
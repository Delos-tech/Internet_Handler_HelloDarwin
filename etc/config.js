module.exports = {
  httpProxyServerAddress : {
    host: process.env.HTTP_FORWARDER_HOST || 'internet-forwarder.dwn-iot.com',
    port: process.env.HTTP_FORWARDER_PORT || 8080
  },
  httpServerAddress : {
    host: process.env.HTTP_HOST || 'localhost',
    port: process.env.HTTP_PORT || 8092
  }
}

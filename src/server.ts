// @ts-nocheck
const app = require("./app");
const mongoose = require('mongoose')
const debug = require('debug')('server:server');
const http = require('http');

const port = normalizePort(process.env.PORT);
app.set('port', port);

const server = http.createServer(app);

server.listen(port, (error) => {
  if (error) {
    console.error("Error in server setup:", error.message);
    process.exit(1);
  }
  console.log("Server listening on Port", port);
});
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error: { syscall; code}) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then((x: { connections: { name }[]; }) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

module.exports = app;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
import mysql from "mysql2";
import app from './app.js';
import fs from 'fs';
import debug from 'debug';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();
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
function onError(error) {
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
export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 13137,
    ssl: {
        ca: fs.readFileSync('public/ca.pem'),
    }
});
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
    }
    else {
        console.log('Connected to MySQL database');
        connection.release();
    }
});

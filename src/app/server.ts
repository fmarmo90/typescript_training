import http from 'http';
import routing from '../routes';

const server = http.createServer(routing);

export default server;
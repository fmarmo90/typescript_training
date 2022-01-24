import http from 'http';
import routing from '../presentation/routes';

const server = http.createServer(routing);

export default server;
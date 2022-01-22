import http from 'http';
import routing from './routes';

const PORT: number = 3000;

const server = http.createServer(routing);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
import server from './infrastructure/server';
import config from 'config';

const PORT: number = config.get('port') || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
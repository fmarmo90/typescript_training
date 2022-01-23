import { ServerResponse } from 'http';
import server from '../../src/app/server';
import request from 'supertest';

describe('Testing upload functionality', () => {
    it('Expect get upload route return html', async (done: Function) : Promise<void> => {
      const res: Response & ServerResponse = await request(server).get('/upload');
    
      console.log(res.headers);

      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toBe('text/html');
    
      done();
    });
  });
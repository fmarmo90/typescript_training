import { ServerResponse } from 'http';
import server from '../../src/infrastructure/server';
import request from 'supertest';

describe('Testing http server functionality', () => {
  it('The main route return valid response', async (done: Function) : Promise<void> => {
    const res: ServerResponse = await request(server).get('/');
  
    expect(res.statusCode).toBe(200);
  
    done();
  });

  it('The server response is 404 when given route is not found', async (done: Function) : Promise<void> => {
    const res: ServerResponse = await request(server).get('/notValidRoute');

    expect(res.statusCode).toBe(404);
    
    done();
  });
});
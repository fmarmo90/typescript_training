import { ServerResponse } from 'http';
import server from '../../src/app/server';
import request from 'supertest';

it("Gets the test endpoint", async (done: Function) : Promise<void> => {
  const res: ServerResponse = await request(server).get('/');

  expect(res.statusCode).toBe(200);

  done();
});
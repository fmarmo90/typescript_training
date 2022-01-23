import { ServerResponse } from 'http';
import server from '../../src/app/server';
import request from 'supertest';
import UploadFileController from '../../src/controller/uploadFileController';
import { UploadFileService } from '../../src/services/uploadFileService';
import { HttpCodes } from '../../src/types/enums';

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('Testing upload functionality', () => {
    it('Expect get upload route return html', async (done: Function) : Promise<void> => {
      const res: Response & ServerResponse = await request(server).get('/upload');

      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toBe('text/html');
    
      done();
    });

    it('Expect uploadFileController to be call on hit POST /upload route', async (done: Function) : Promise<void> => {
      jest.spyOn(UploadFileController, 'saveUploadFile');
      jest.spyOn(UploadFileService, 'saveUploadFile').mockResolvedValue(true);

      await request(server).post('/upload');

      expect(UploadFileController.saveUploadFile).toBeCalled();

      done();
    });

    it ('Expect uploadFileController to throw error on reject for saveUploadFile method of upload service', async (done: Function) : Promise<void> => {
      jest.spyOn(UploadFileController, 'saveUploadFile');
      jest.spyOn(UploadFileService, 'saveUploadFile').mockRejectedValue(false);

      const res: Response & ServerResponse = await request(server).post('/upload');

      expect(UploadFileController.saveUploadFile).toBeCalled();
      expect(UploadFileController.saveUploadFile).rejects;
      expect(res.statusCode).toBe(HttpCodes.SERVER_ERROR);

      done();
    });
});
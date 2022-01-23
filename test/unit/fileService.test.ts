import { ServerResponse } from 'http';
import server from '../../src/app/server';
import request from 'supertest';
import UploadFileController from '../../src/controller/uploadFileController';
import { FileService } from '../../src/services/FileService';
import { HttpCodes } from '../../src/types/enums';
import fetch from 'node-fetch';

jest.mock('node-fetch');

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
      const mockUserInputData: UserInputData = {
        phone: '',
        initDate: '',
        endDate: '',
        fileName: '' 
      }

      jest.spyOn(UploadFileController, 'saveUploadFile');
      jest.spyOn(FileService, 'saveUpload').mockResolvedValue(mockUserInputData);
      jest.spyOn(FileService, 'process').mockResolvedValue(true);

      await request(server).post('/upload');

      expect(UploadFileController.saveUploadFile).toBeCalled();

      done();
    });

    it ('Expect uploadFileController to throw error on reject for saveUploadFile method of upload service', async (done: Function) : Promise<void> => {
      jest.spyOn(UploadFileController, 'saveUploadFile');
      jest.spyOn(FileService, 'saveUpload').mockRejectedValue(false);

      const res: Response & ServerResponse = await request(server).post('/upload');

      expect(UploadFileController.saveUploadFile).toBeCalled();
      expect(UploadFileController.saveUploadFile).rejects;
      expect(res.statusCode).toBe(HttpCodes.SERVER_ERROR);

      done();
    });
});

describe('Testing process functionality', () => {
  it ('Upload must return 500 if phone number is not provided to process method', async (done: Function) : Promise<void> => {
    jest.spyOn(FileService, 'saveUpload').mockResolvedValue({
      phone: '',
      initDate: '2021-01-23',
      endDate: '2022-01-23',
      fileName: 'test.csv'
    });

    const res: Response & ServerResponse = await request(server).post('/upload');
    
    expect(res.statusCode).toBe(500);

    done();
  })
});
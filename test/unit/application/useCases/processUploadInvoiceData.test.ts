import GenerateInvoiceFromFile from '../../../../src/application/useCases/generateInvoiceFromFile';
import ProcessUploadInvoiceData from '../../../../src/application/useCases/processUploadInvoiceData';
import CsvAdapter from '../../../../src/interface/adapter/files/csvAdapter';
import UserAdapter from '../../../../src/interface/adapter/rest/userAdapter';

jest.mock('../../../../src/interface/adapter/files/csvAdapter');
jest.mock('../../../../src/interface/adapter/rest/userAdapter');
jest.mock('../../../../src/application/useCases/generateInvoiceFromFile');

let uploadData: UploadResult;

let processUploadInvoceData = null;

beforeEach(() => {
    jest.clearAllMocks();

    uploadData = {
        body: {
            phone: '+191167980953',
            initDate: '2020-02-19',
            endDate: '2020-02-19'
        },
        filePath: 'csvData.csv'
    };

    processUploadInvoceData = new ProcessUploadInvoiceData(uploadData);
});

describe('Process upload invoice data functionality', () => {
    it('Should new instance of ProcessUploadInvoiceData init and save required data', async (done: Function) : Promise<void> => {
        expect(CsvAdapter).toBeCalled();
        expect(UserAdapter).toBeCalled();
        expect(processUploadInvoceData.userData).toBeDefined();
        expect(processUploadInvoceData.filePath).toBeDefined();
        
        done();
    });

    it('Should invoke throw error when phone is not provided', async (done: Function) : Promise<void> => {
        uploadData.body.phone = '';
        
        processUploadInvoceData = new ProcessUploadInvoiceData(uploadData);
        
        expect(processUploadInvoceData.invoke()).rejects.toThrow();
        
        done();
    });

    it ('Should invoke call user adapter on correct input', async (done: Function) : Promise<void> => {
        const userAdapterMock = jest.spyOn(processUploadInvoceData['userAdapter'], 'get').mockResolvedValue('ok');
        const readAdapterMock = jest.spyOn(processUploadInvoceData['fileAdapter'], 'readStream').mockResolvedValue('ok');

        processUploadInvoceData.invoke();

        expect(userAdapterMock).toBeCalled();
        //expect(readAdapterMock).toBeCalled();
        //expect(GenerateInvoiceFromFile).toBeCalled();
        
        done();
    });
});
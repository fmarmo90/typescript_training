import GenerateInvoiceFromFile from '../../../../src/application/useCases/generateInvoiceFromFile';
import Invoice from '../../../../src/application/domain/invoice';

jest.mock('../../../../src/application/domain/invoice');

let csvData: InvoiceRecordData;

let testUser: User;

let generateInvoiceUseCase = null;

beforeEach(() => {
    jest.clearAllMocks();

    csvData = {
        origin: '+191167980953',
        destination: '+5491167930920',
        revert: 'N',
        duration: 150,
        date: '2020-08-27T05:55:43Z'
    }

    testUser = {
        phone: '+5491167940999',
        name: 'Helene Auer',
        address: '022 Elmore Highway',
        firendsList: [
            "+5491167980953",
            "+5491167980951",
            "+191167980953"
        ]
    };

    generateInvoiceUseCase = new GenerateInvoiceFromFile(testUser);
});

describe('Generate invoice use case functionality', () => {
    it.skip('Should invoke create an instance of Invoice', async (done: Function) : Promise<void> => {
        //const mockInvoice = jest.spyOn(Invoice.prototype, 'generate');

        //generateInvoiceUseCase.addRecord(csvData);
        generateInvoiceUseCase.invoke();

        expect(Invoice).toBeCalled();
        //expect(mockInvoice).toBeCalled();

        done();
    });

    it('Should addRecord call formatData and push in filteredData', async (done: Function) : Promise<void> => {
        const mockformatData = jest.spyOn(generateInvoiceUseCase, 'formatData');

        generateInvoiceUseCase.addRecord(csvData);

        expect(mockformatData).toBeCalled();
        expect(generateInvoiceUseCase['filteredData'].length).toBe(1);

        done();
    });

    it('Should formatData call formatDuration and formatCallType', async (done: Function) : Promise<void> => {
        const mockformatDuration = jest.spyOn(generateInvoiceUseCase, 'formatDuration');
        const formatCallType = jest.spyOn(generateInvoiceUseCase, 'formatCallType');

        generateInvoiceUseCase.addRecord(csvData);

        expect(mockformatDuration).toBeCalled();
        expect(formatCallType).toBeCalled();
        
        done();
    });

    it('Should formatDuration return seconds to minutes', async (done: Function) : Promise<void> => {
        const mockformatDuration = jest.spyOn(generateInvoiceUseCase, 'formatDuration');

        generateInvoiceUseCase.addRecord(csvData);

        expect(mockformatDuration).toBeCalled();
        expect(csvData.duration).toBe(2);

        done();
    });

    it('Should formatCallType return type I for international calls', async (done: Function) : Promise<void> => {
        const mockFormatCallType = jest.spyOn(generateInvoiceUseCase, 'formatCallType');

        generateInvoiceUseCase.addRecord(csvData);

        expect(mockFormatCallType).toBeCalled();
        expect(csvData.type).toBe('I');

        done();
    });

    it('Should formatCallType return type N for national calls', async (done: Function) : Promise<void> => {
        const mockFormatCallType = jest.spyOn(generateInvoiceUseCase, 'formatCallType');

        csvData.origin = '+549167980953';

        generateInvoiceUseCase.addRecord(csvData);

        expect(mockFormatCallType).toBeCalled();
        expect(csvData.type).toBe('N');

        done();
    });

    it('Should formatCallType return type F if number is in friends list', async (done: Function) : Promise<void> => {
        testUser.firendsList.push('+5491167930920');

        generateInvoiceUseCase = new GenerateInvoiceFromFile(testUser);

        const mockFormatCallType = jest.spyOn(generateInvoiceUseCase, 'formatCallType');

        generateInvoiceUseCase.addRecord(csvData);

        expect(mockFormatCallType).toBeCalled();
        expect(csvData.isFriend).toBe(true);

        done();
    });
});
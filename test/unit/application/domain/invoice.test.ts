import Invoice from '../../../../src/application/domain/invoice';

const csvDataArrayMock: Array<CSVData> = [
    {
        origin: '+191167980953',
        destination: '+5491167930920',
        revert: 'N',
        duration: 10,
        date: '20200827',
        type: 'N',
        isFriend: true
    }
]

const testUser: User = {
    phone: '+5491167940999',
    name: 'Helene Auer',
    address: '022 Elmore Highway',
    firendsList: [
        "+5491167980953",
        "+5491167980951",
        "+191167980953"
    ]
};

let testInvoice = null;

beforeEach(() => {
    testInvoice = new Invoice(testUser);

    jest.clearAllMocks();
});

describe('Invoice functionality', () => {
    it('Expect generate return object with data', async (done: Function) : Promise<void> => {
        jest.spyOn(testInvoice, 'generate');
      
        const result = testInvoice.generate(csvDataArrayMock);

        expect(result).toBeDefined();
        expect(result).toHaveProperty('address');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('total');
        expect(result).toHaveProperty('totalNationalMinutes');
        expect(result).toHaveProperty('totalFriendsMinutes');
        expect(result).toHaveProperty('movements');

        done();
    });

    it('Expect calculatePrice to be call when generate invoice', async (done: Function) : Promise<void> => {
        const proto = Object.getPrototypeOf(testInvoice);

        const mockCalculatePrice = jest.spyOn(proto, 'calculatePrice');

        testInvoice.generate(csvDataArrayMock);

        expect(mockCalculatePrice).toHaveBeenCalled();
        expect(mockCalculatePrice).toHaveBeenCalledWith({
            origin: '+191167980953',
            destination: '+5491167930920',
            revert: 'N',
            duration: 10,
            date: '20200827',
            price: 0,
            type: 'N',
            isFriend: true
        });

        done();
    });

    it('Should sum total friend minutes usage', async (done: Function) : Promise<void> => {
        testInvoice.generate(csvDataArrayMock);

        expect(testInvoice['friendMinutesAcumulated']).toBe(10);

        done();
    });

    it('Should calculatePrice return price 0 when friendMinutesAcumulated <= 150', async (done: Function) : Promise<void> => {
        const proto = Object.getPrototypeOf(testInvoice);

        const mockCalculatePrice = jest.spyOn(proto, 'calculatePrice');

        testInvoice.generate(csvDataArrayMock);

        expect(mockCalculatePrice).toReturnWith(0);

        done();
    });

    it('Should call calculateCallPrice when calculatePrice is called if friendMinutesAcumulated > 150', async (done: Function) : Promise<void> => {
        const proto = Object.getPrototypeOf(testInvoice);

        const mockCalculateCallPrice = jest.spyOn(proto, 'calculateCallPrice');
        
        csvDataArrayMock[0].duration = 151;

        testInvoice.generate(csvDataArrayMock);

        expect(mockCalculateCallPrice).toBeCalled();

        done();
    });

    it('Should calculateCallPrice return 0 when is revert call', async (done: Function) : Promise<void> => {
        const proto = Object.getPrototypeOf(testInvoice);

        const mockCalculateCallPrice = jest.spyOn(proto, 'calculateCallPrice');

        csvDataArrayMock[0].revert = 'S';

        testInvoice.generate(csvDataArrayMock);

        expect(mockCalculateCallPrice).toReturnWith(0);
        
        done();
    });
});
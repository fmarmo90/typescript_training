import UseCase from './useCase';
import GenerateInvoiceFromFile from './generateInvoiceFromFile';
import CsvFileAdapter from '../../interface/adapter/files/csvAdapter';
import UserAdapter from '../../interface/adapter/rest/userAdapter';
import RestAdapter from '../../interface/adapter/rest/restAdapter';
import { FileAdapter } from '../../interface/adapter/files/fileAdapter';

export default class ProcessUploadInvoiceData extends UseCase {
    private fileAdapter: FileAdapter;
    private restAdapter: RestAdapter;

    userData: UserInputData;
    filePath: string;

    constructor(uploadData: UploadResult) {
        super();

        this.userData = {
            phone: uploadData.body.phone,
            initDate: String(uploadData.body.initDate).replace(/-/g, ''),
            endDate: String(uploadData.body.endDate).replace(/-/g, '')
        };

        this.filePath = uploadData.filePath;

        this.fileAdapter = new CsvFileAdapter();
        this.restAdapter = new UserAdapter();
    };
    
    async invoke() {
        if (!this.userData.phone) {
            throw Error('No phone for user');
        }

        try {
            const userData = await this.restAdapter.get(this.userData.phone);
            const generateInvoice = new GenerateInvoiceFromFile(userData);

            const resultInvoice = await this.fileAdapter.readStream(this.filePath, 
            {
                headers: [
                    'origin',
                    'destination',
                    'revert',
                    'duration',
                    'date'
                ]
            },
            (data: InvoiceRecordData) => {
                if (data.origin === this.userData.phone && data.destination !== this.userData.phone) {
                    data.date = data.date.split('T')[0].replace(/-/g, '');

                    if (data.date >= this.userData.initDate && data.date <= this.userData.endDate) {
                        generateInvoice.addRecord(data);
                    }
                }
            },
            () => {
                return generateInvoice.invoke();
            });

            return resultInvoice as unknown as Invoice;
        } catch (err) {
            throw err;
        }
    }
}
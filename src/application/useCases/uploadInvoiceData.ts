import UseCase from "./useCase";
import CsvAdapter from '../../interface/adapter/files/csvAdapter';
import { FileAdapter } from '../../interface/adapter/files/fileAdapter';

export default class UploadInvoiceData extends UseCase {
    fileAdapter: FileAdapter;
    filePath: any;

    constructor(filePath: string) {
        super();

        this.filePath = filePath;
        
        this.fileAdapter = new CsvAdapter();
    }
    
    invoke() {
        return this.fileAdapter.save(this.filePath);
    }
}
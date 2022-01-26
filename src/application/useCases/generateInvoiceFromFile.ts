import { Utils } from '../../common/utils/utils';
import Invoice from '../domain/invoice';
import UseCase from './useCase';

export default class GenerateInvoiceFromFile extends UseCase {
    private user: User;
    private filteredData: Array<InvoiceRecordData> = [];

    constructor(user: User) {
        super();
        
        this.user = user;
    }
    
    addRecord(invoiceRecord: InvoiceRecordData) {
        this.formatData(invoiceRecord);

        this.filteredData.push(invoiceRecord);
    }

    invoke() {
        const invoice = new Invoice(this.user);
        
        invoice.generate(this.filteredData);

        return {
            'address': invoice.user.address,
            'name': invoice.user.name,
            'total': invoice.total,
            'totalInternationalMinutes': invoice.totalInternationalMinutes,
            'totalNationalMinutes': invoice.totalNationalMinutes,
            'totalFriendsMinutes': invoice.totalFriendsMinutes,
            'movements': invoice.movementList
        }
    }

    private formatData(invoiceRecord: InvoiceRecordData) {
        this.formatDuration(invoiceRecord);
        this.formatCallType(invoiceRecord, this.user);
    }

    private formatDuration(invoiceRecord: InvoiceRecordData) {
        invoiceRecord.durationCalculated = Utils.calculateMinutesAndSeconds(invoiceRecord.seconds);
    }

    private formatCallType(invoiceRecord: InvoiceRecordData, userInfo: User) {
        let countryOrigin = invoiceRecord.origin.substring(1,3);
        let countryDestination = invoiceRecord.destination.substring(1,3);

        if (countryOrigin === countryDestination) {
            invoiceRecord.type = 'N';
        }

        if (countryOrigin !== countryDestination) {
            invoiceRecord.type = 'I';
        }

        if (userInfo.firendsList.find(element => element === invoiceRecord.destination)) {
            invoiceRecord.isFriend = true;
        } else {
            invoiceRecord.isFriend = false;
        }
    }
}
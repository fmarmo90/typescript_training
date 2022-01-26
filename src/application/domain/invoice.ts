import { Utils } from '../../common/utils/utils';
export default class Invoice {
    user: User;
    movementList: Array<Movement> = [];
    
    totalInternationalMinutes: number = 0;
    totalNationalMinutes: number = 0;
    totalFriendsMinutes: number = 0;
    total: number = 0;

    private friendMinutesAcumulated: number = 0;

    constructor(user: User) {
        this.user = user;
    }

    generate(data: Array<InvoiceRecordData>) {
        data.forEach(record => {
            this.accumulateCallMinutes(record);

            record.price = this.calculatePrice(record);

            this.total += record.price;

            this.movementList.push({
                duration: record.durationCalculated.minutes,
                date: record.date,
                price: record.price,
                type: record.type,
                friend: record.isFriend
            })
        });
    }

    private accumulateCallMinutes(invoiceRecord: InvoiceRecordData) {
        if (invoiceRecord.type === 'N') {
            this.totalNationalMinutes += invoiceRecord.durationCalculated.minutes;
        }

        if (invoiceRecord.type === 'I') {
            this.totalInternationalMinutes += invoiceRecord.durationCalculated.minutes;
        }

        if (invoiceRecord.isFriend) {
            this.friendMinutesAcumulated += invoiceRecord.durationCalculated.minutes;
            this.totalFriendsMinutes += invoiceRecord.durationCalculated.minutes;
        }
    }

    private calculatePrice(invoiceRecord: InvoiceRecordData) {
        if (invoiceRecord.isFriend) {
            if (this.friendMinutesAcumulated <= 150) {
                return 0;
            }
        }
    
        return this.calculateCallPrice(invoiceRecord);
    }

    private calculateCallPrice(invoiceRecord: InvoiceRecordData) : number {
        if (invoiceRecord.revert === 'S') return 0;
        
        if (invoiceRecord.type === 'N') {
            return 2.5;
        }
    
        if (invoiceRecord.type === 'I') {
            let totalExactMinutes = invoiceRecord.durationCalculated.minutes * 20;
            let totalSecondsRemanent = (invoiceRecord.durationCalculated.seconds * 20) / 60;

            return Utils.formatNumberToFix(totalExactMinutes + totalSecondsRemanent, 2);
        }
    }
}
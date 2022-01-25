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
            record.price = this.calculatePrice(record);

            this.total += record.price;

            this.movementList.push({
                destination: record.destination,
                duration: record.duration,
                date: record.date,
                price: record.price
            })
        });
    }

    private calculatePrice(invoiceRecord: InvoiceRecordData) {
        if (invoiceRecord.isFriend) {
            this.friendMinutesAcumulated += invoiceRecord.duration;
            this.totalFriendsMinutes += invoiceRecord.duration;
            
            if (this.friendMinutesAcumulated <= 150) {
                return 0;
            }
        }
    
        return this.calculateCallPrice(invoiceRecord);
    }

    private calculateCallPrice(invoiceRecord: InvoiceRecordData) : number {
        if (invoiceRecord.revert === 'S') return 0;
        
        if (invoiceRecord.type === 'N') {
            this.totalNationalMinutes += invoiceRecord.duration;

            return invoiceRecord.duration * 2.5;
        }
    
        if (invoiceRecord.type === 'I') {
            this.totalInternationalMinutes += invoiceRecord.duration;

            return invoiceRecord.duration * 20;
        }
    }
}
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

    generate(data: Array<CSVData>) {
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

        return {
            'address': this.user.address,
            'name': this.user.name,
            'total': this.total,
            'totalInternationalMinutes': this.totalInternationalMinutes,
            'totalNationalMinutes': this.totalNationalMinutes,
            'totalFriendsMinutes': this.totalFriendsMinutes,
            'movements': this.movementList
        }
    }

    private calculatePrice(csvRecord: CSVData) {
        if (csvRecord.isFriend) {
            this.friendMinutesAcumulated += csvRecord.duration;
            this.totalFriendsMinutes += csvRecord.duration;
            
            if (this.friendMinutesAcumulated <= 150) {
                return 0;
            }
        }
    
        return this.calculateCallPrice(csvRecord);
    }

    private calculateCallPrice(csvRecord: CSVData) : number {
        if (csvRecord.revert === 'S') return 0;
        
        if (csvRecord.type === 'N') {
            this.totalNationalMinutes += csvRecord.duration;

            return csvRecord.duration * 2.5;
        }
    
        if (csvRecord.type === 'I') {
            this.totalInternationalMinutes += csvRecord.duration;

            return csvRecord.duration * 20;
        }
    }
}
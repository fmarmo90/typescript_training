import Invoice from '../domain/invoice';

export default class GenerateInvoiceUseCase {
    private user: User;
    filteredData: Array<CSVData> = [];

    constructor(user: User) {
        this.user = user;
    }
    
    addRecord(csvData: CSVData) {
        this.formatData(csvData)

        this.filteredData.push(csvData);
    }

    invoke() {
        const invoice = new Invoice(this.user);

        return invoice.generate(this.filteredData);
    }

    private formatData(data: CSVData) {
        this.formatDuration(data);
        this.formatCallType(data, this.user);
    }

    private formatDuration(data: CSVData) {
        data.duration = Math.floor(Number(data.duration) / 60);
    }

    private formatCallType(data: CSVData, userInfo: User) {
        let countryOrigin = data.origin.substring(1,3);
        let countryDestination = data.destination.substring(1,3);

        if (countryOrigin === countryDestination) {
            data.type = 'N';
        }

        if (countryOrigin !== countryDestination) {
            data.type = 'I';
        }

        if (userInfo.firendsList.find(element => element === data.destination)) {
            data.isFriend = true;
        } else {
            data.isFriend = false;
        }
    }
}
type UserInputData = {
    phone: string,
    initDate: string,
    endDate: string
}

type UploadResult = {
    body: UserInputData,
    filePath: string
}

type UserApiResponse = {
    phone_number: string,
    name: string,
    friends: Array<string>,
    address:string
}
interface User {
    phone: string,
    name: string,
    address: string,
    firendsList: Array<UserFriend | string>
}

interface UserFriend {
    phone: string
}

interface Invoice {
    address: string,
    name: string,
    movements: Array<Movement>,
    totalCharged: string,
    totalNationalMinutes: string,
    totalInternationalMinutes: string,
    totalFriendsMinutes: string
}

interface Movement {
    destination?: string,
    duration: number,
    date: string,
    price: number,
    type?: string,
    friend?: boolean
}

interface CSVData {
    origin: string,
    destination: string,
    revert: string,
    duration: number,
    date: string,
    type?: string,
    isFriend?: boolean,
    price?: number
}

interface InvoiceRecordData {
    origin: string,
    destination: string,
    revert: string,
    seconds: number,
    date: string,
    durationCalculated?: Duration,
    type?: string,
    isFriend?: boolean,
    price?: number
}

interface Duration {
    minutes: number,
    seconds: number
}
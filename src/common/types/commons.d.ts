type UserInputData = {
    phone: string,
    initDate: string,
    endDate: string,
    fileName: string
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
    user: User,
    movements: Array<Movement>,
    totalCharged: string,
    totalNationalMinutes: string,
    totalInternationalMinutes: string,
    totalFriendsMinutes: string
}

interface Movement {
    destination: string,
    duration: number,
    date: string,
    price: number
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
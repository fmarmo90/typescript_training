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
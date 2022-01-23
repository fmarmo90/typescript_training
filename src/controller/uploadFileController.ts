
import { IncomingMessage, ServerResponse } from 'http';
import { FileService } from '../services/fileService';
import { HttpCodes } from '../types/enums';
import { Utils } from '../utils/utils';

export default class UploadFileController {
    static saveUploadFile = async (req: IncomingMessage, res: ServerResponse) => {
        try {
            const userInputData: UserInputData = await FileService.saveUpload(req);
            await FileService.process(userInputData);

            Utils.responseJson(res, {
                status: 'File Uploaded!'
            }, HttpCodes.OK);
        } catch (err) {
            Utils.responseJson(res, {
                error: err.message
            }, HttpCodes.SERVER_ERROR);
        }
    }
}
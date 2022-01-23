
import { IncomingMessage, ServerResponse } from 'http';
import { UploadFileService } from '../services/uploadFileService';
import { HttpCodes } from '../types/enums';
import { Utils } from '../utils/utils';

export default class UploadFileController {
    static saveUploadFile = async (req: IncomingMessage, res: ServerResponse) => {
        try {
            await UploadFileService.saveUploadFile(req);

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
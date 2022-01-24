
import { IncomingMessage, ServerResponse } from 'http';
import { FileService } from '../../services/fileService';
import { HttpCodes } from '../../common/types/enums';
import { Utils } from '../../common/utils/utils';

export default class UploadFileController {
    static saveUploadFile = async (req: IncomingMessage, res: ServerResponse) => {
        try {
            const userInputData: UserInputData = await FileService.saveUpload(req);
            const result = await FileService.process(userInputData);

            Utils.responseJson(res, {
                status: 'Invoice generated!',
                result
            }, HttpCodes.OK);
        } catch (err) {
            Utils.responseJson(res, {
                error: err.message
            }, HttpCodes.SERVER_ERROR);
        }
    }
}
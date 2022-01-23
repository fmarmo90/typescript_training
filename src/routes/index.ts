import { IncomingMessage, ServerResponse } from 'http';
import { HttpCodes, HttpMethods, Layouts } from '../types/enums';
import UploadFileController from '../controller/uploadFileController';
import { Utils } from '../utils/utils';

const routing = async (req: IncomingMessage, res: ServerResponse) : Promise<void> => {
    if (req.url === '/') {
        return Utils.responseJson(res, {
            hello: 'world'
        }, HttpCodes.OK);
    }
    
    if (req.url === '/upload') {
        if (req.method === HttpMethods.GET) {
            return Utils.responseLayout(res, Layouts.UPLOAD_FILE);
        }

        if (req.method === HttpMethods.POST) {
            return await UploadFileController.saveUploadFile(req, res);
        }
    }

    return Utils.responseJson(res, {
        error: 'Route not found'
    }, HttpCodes.NOT_FOUND);
};

export default routing;
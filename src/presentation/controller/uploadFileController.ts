
import { IncomingMessage, ServerResponse } from 'http';
import { HttpCodes } from '../../common/types/enums';
import { Utils } from '../../common/utils/utils';
import formidable from 'formidable';
import UploadInvoiceData from '../../application/useCases/uploadInvoiceData';
import ProcessUploadInvoiceData from '../../application/useCases/processUploadInvoiceData';

export default class UploadFileController {
    static saveUploadFile = async (req: IncomingMessage, res: ServerResponse) => {
        try {
            const form = new formidable.IncomingForm();
            
            const uploadResult: UploadResult = await new Promise((resolve, reject) => {
                form.parse(req, function (err, body, file) {
                    if (err) {
                        reject(err);
                    }

                    const filePath = new UploadInvoiceData(file.uploadFile.filepath).invoke();

                    resolve({
                        body,
                        filePath
                    })
                });
            });

            const resultInvoice: Invoice = await (new ProcessUploadInvoiceData(uploadResult)).invoke();

            Utils.responseJson(res, {
                status: 'Invoice generated!',
                resultInvoice
            }, HttpCodes.OK);
        } catch (err) {
            Utils.responseJson(res, {
                error: err.message
            }, HttpCodes.SERVER_ERROR);
        }
    }
}
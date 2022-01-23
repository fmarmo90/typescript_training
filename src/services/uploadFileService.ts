
import { IncomingMessage } from 'http';
import formidable from 'formidable';
import fs from 'fs';
import appRoot from 'app-root-path';

export class UploadFileService {
    static saveUploadFile(req: IncomingMessage) {
        return new Promise((resolve, reject) => {
            const form = new formidable.IncomingForm();

            form.parse(req, function (err, fields, files) {
                if (err) {
                    reject(err);
                }
                
                const oldPath = files.csvFile.filepath;
    
                if (!fs.existsSync(appRoot + '/dist/uploads/')){
                    fs.mkdirSync(appRoot + '/dist/uploads/');
                }
    
                const newPath = appRoot + '/dist/uploads/' + files.csvFile.originalFilename;
    
                fs.rename(oldPath, newPath, function (err) {
                    if (err) {
                        reject(err);
                    }

                    resolve(true);
                });
            });
        })
    }
}
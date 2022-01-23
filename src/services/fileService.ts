
import { IncomingMessage } from 'http';
import formidable from 'formidable';
import fs from 'fs';
import appRoot from 'app-root-path';
import csv from'csv-parser';
import { Transform } from 'stream';

export class FileService {
    static saveUpload(req: IncomingMessage) : Promise<UserInputData> {
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

                    resolve({
                        phone: fields.phone,
                        initDate: fields.initDate,
                        endDate: fields.endDate,
                        fileName: files.csvFile.originalFilename
                    });
                });
            });
        })
    }

    static process(userInputData: UserInputData) {
        return new Promise((resolve, reject) => {
            const filePath = appRoot + `/dist/uploads/${userInputData.fileName}`;

            fs.createReadStream(filePath)
            .pipe(csv({
                headers: [
                    'origin',
                    'destination',
                    'revert',
                    'duration',
                    'date'
                ]
            }))
            .on('data', (data) => {
                if (data.origin === userInputData.phone) {
                    console.log(data);
                }
            })
            .on('end', () => {
                fs.unlinkSync(filePath);
                console.log('finish');
                resolve(true);
            });
        });
    }
}
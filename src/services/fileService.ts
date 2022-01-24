
import { IncomingMessage } from 'http';
import formidable from 'formidable';
import fs from 'fs';
import appRoot from 'app-root-path';
import csv from'csv-parser';
import { UserService } from './userServices';
import uniqueFileName from 'unique-filename';

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
    
                const newPath = uniqueFileName(appRoot + '/dist/uploads/', 'file') + '.csv';
    
                fs.rename(oldPath, newPath, function (err) {
                    if (err) {
                        reject(err);
                    }

                    resolve({
                        phone: fields.phone,
                        initDate: String(fields.initDate).replace(/-/g, ''),
                        endDate: String(fields.endDate).replace(/-/g, ''),
                        fileName: newPath
                    });
                });
            });
        })
    }
    
    static async process(userInputData: UserInputData) {
        if (!userInputData.phone) {
            throw Error('No phone for user');
        }

        try {
            const userInfo: User = await UserService.getInfo(userInputData.phone);

            let count = 0;

            return new Promise((resolve, reject) => {
                const filePath = userInputData.fileName;

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
                .on('data', (data: CSVData) => {
                    if (data.origin === userInputData.phone && data.destination !== userInputData.phone) {
                        data.date = data.date.split('T')[0].replace(/-/g, '');

                        if (data.date >= userInputData.initDate && data.date <= userInputData.endDate) {
                            this.formarData(data, userInfo);

                            //console.log(data);
                            count++;
                        }
                    }
                })
                .on('end', () => {
                    fs.unlinkSync(filePath);
                    console.log(`finish, process ${count} fields`);
                    count = 0;
                    resolve(true);
                });
            });
        } catch (err) {
            throw err;
        }
    }

    static formarData(data: CSVData, userInfo: User) {
        this.formatDuration(data);
        this.formatCallType(data, userInfo);
    }

    static formatDuration(data: CSVData) {
        data.duration = Math.floor(Number(data.duration) / 60);
    }

    static formatCallType(data: CSVData, userInfo: User) {
        let countryOrigin = data.origin.substring(1,3);
        let countryDestination = data.destination.substring(1,3);

        if (countryOrigin === countryDestination) {
            data.type = 'N';
        }

        if (countryOrigin !== countryDestination) {
            data.type = 'I';
        }

        if (userInfo.firendsList.find(element => element === data.destination)) {
            data.type = 'F';
        }
    }
}
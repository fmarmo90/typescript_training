
import { IncomingMessage } from 'http';
import formidable from 'formidable';
import fs from 'fs';
import appRoot from 'app-root-path';
import csv from'csv-parser';
import GenerateInvoiceUseCase from '../application/useCases/generateInvoice';
import { UserService } from '../services/userServices';

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
    
                const uniqueFileName = Math.random().toString(36).slice(2);

                const newPath = `${appRoot}/dist/uploads/${uniqueFileName}.csv`;
    
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
            const user = await UserService.getInfo(userInputData.phone);
            const generateInvoiceCase = new GenerateInvoiceUseCase(user);

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
                .on('error', (err) => {
                    reject(err);
                })
                .on('data', (data: CSVData) => {
                    if (data.origin === userInputData.phone && data.destination !== userInputData.phone) {
                        data.date = data.date.split('T')[0].replace(/-/g, '');

                        if (data.date >= userInputData.initDate && data.date <= userInputData.endDate) {
                            generateInvoiceCase.addRecord(data);
                        }
                    }
                })
                .on('end', () => {
                    fs.unlinkSync(filePath);

                    const result = generateInvoiceCase.invoke();
                    
                    resolve(result);
                });
            });
        } catch (err) {
            throw err;
        }
    }
}
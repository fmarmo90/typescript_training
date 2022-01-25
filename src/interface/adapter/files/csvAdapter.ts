import fs from 'fs';
import appRoot from 'app-root-path';
import { FileAdapter } from './fileAdapter';
import { Utils } from '../../../common/utils/utils';
import csv, { Options } from'csv-parser';

export default class CsvAdapter implements FileAdapter {
    get(): void {
        throw new Error('Method not implemented.');
    }

    readStream(filePath: string, options?: Options, onRead?: Function, onEnd?: Function) : Promise<void> {
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
            .pipe(csv({
                headers: options.headers
            }))
            .on('error', (err) => {
                reject(err);
            })
            .on('data', (data: CSVData) => {
                if (onRead) {
                    onRead(data);
                }
            })
            .on('end', () => {
                fs.unlinkSync(filePath);

                if (onEnd) {
                    const result = onEnd();

                    resolve(result);
                } else {
                    resolve();
                }
            });
        });
    }
    
    save(filePath: string) : string {
        if (!fs.existsSync(appRoot + '/dist/uploads/')){
            fs.mkdirSync(appRoot + '/dist/uploads/');
        }
        
        const uploadPath = `${appRoot}/dist/uploads/${Utils.generateUniqueID()}.csv`;

        fs.renameSync(filePath, uploadPath);

        return uploadPath
    }
}
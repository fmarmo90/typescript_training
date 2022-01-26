import { ServerResponse } from 'http';
import { HttpCodes } from '../types/enums';
import fs from 'fs';
import path from 'path';

export class Utils {
    static responseJson = (res: ServerResponse, response: object, statusCode: number) : void => {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(JSON.stringify(response));
    };

    static responseLayout = (res: ServerResponse, layoutName: string) => {
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(HttpCodes.OK);
        res.write(fs.readFileSync(path.join(__dirname, `../../presentation/layouts/${layoutName}`)));
        res.end();
    }

    static generateUniqueID = () : string => {
        return Math.random().toString(36).slice(2);
    }

    static formatNumberToFix(value: number, fix: number) : number {
        return Number(Number.parseFloat(value.toString()).toFixed(fix));
    }

    static calculateMinutesAndSeconds(seconds: number = 0, minutes: number = 0) : Duration {
        if (seconds < 60) {
            return {
                minutes,
                seconds
            }
        }
        
        seconds -= 60;
        minutes++;
        
        return this.calculateMinutesAndSeconds(seconds, minutes);
    }
}
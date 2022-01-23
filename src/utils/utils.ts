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
        res.write(fs.readFileSync(path.join(__dirname, `../layouts/${layoutName}`)));
        res.end();
    }
}
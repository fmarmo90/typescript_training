import { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';
import { HttpCodes, HttpMethods } from '../types/http';
import formidable from 'formidable';
import appRoot from 'app-root-path';

const responseJson = (res: ServerResponse, response: object, statusCode: number) : void => {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(statusCode);
    res.end(JSON.stringify(response));
};

const routing = (req: IncomingMessage, res: ServerResponse) : void => {
    if (req.url === '/') {
        return responseJson(res, {
            hello: 'world'
        }, HttpCodes.OK);
    }
    
    if (req.url === '/upload') {
        if (req.method === HttpMethods.GET) {
            res.setHeader('Content-Type', 'text/html');
            res.writeHead(HttpCodes.OK);
            res.write(fs.readFileSync(path.join(__dirname, '../layouts/uploadFile.html')));
            res.end();
            return;
        }

        if (req.method === HttpMethods.POST) {
            var form = new formidable.IncomingForm();

            form.parse(req, function (err, fields, files) {
                var oldPath = files.csvFile.filepath;

                if (!fs.existsSync(appRoot + '/dist/uploads/')){
                    fs.mkdirSync(appRoot + '/dist/uploads/');
                }

                var newPath = appRoot + '/dist/uploads/' + files.csvFile.originalFilename;

                fs.rename(oldPath, newPath, function (err) {
                  if (err) throw err;

                  res.writeHead(HttpCodes.OK);
                  res.write('File uploaded!');
                  res.end();
                });
            });

            return;
        }
    }

    return responseJson(res, {
        error: 'Route not found'
    }, HttpCodes.NOT_FOUND);
};

export default routing;
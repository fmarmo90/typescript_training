import { IncomingMessage, ServerResponse } from 'http';

const responseJson = (res: ServerResponse, response: object) : void => {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(response));
};

const routing = (req: IncomingMessage, res: ServerResponse) : void => {
    if (req.url === '/') {
        responseJson(res, {
            hello: 'world'
        });
    }
};

export default routing;
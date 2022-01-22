import { IncomingMessage, ServerResponse } from 'http';

const responseJson = (res: ServerResponse, response: object, statusCode: number) : void => {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(statusCode);
    res.end(JSON.stringify(response));
};

const routing = (req: IncomingMessage, res: ServerResponse) : void => {
    if (req.url === '/') {
        return responseJson(res, {
            hello: 'world'
        }, 200);
    }

    return responseJson(res, {
        error: 'Route not found'
    }, 404);
};

export default routing;
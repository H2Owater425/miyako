/// <reference types="node" />
import { Server as _Server, IncomingMessage, ServerResponse } from 'http';
import { BodyParser, Method, Request, Response, Route, ServerOptions } from './type';
import { Logger } from './logger';
export declare class Server extends _Server<Request & typeof IncomingMessage, Response & typeof ServerResponse> {
    #private;
    constructor(options?: Partial<ServerOptions>);
    get logger(): Logger;
    setRoute(method: Method, path: string, route: Route): Server;
    setBodyParser(contentType: string, bodyParser: BodyParser): Server;
}

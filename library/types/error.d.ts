import { HttpErrorCode } from './type';
export declare class ValidationError extends Error {
    constructor(path: string, condition: string);
}
declare class HttpError<K extends HttpErrorCode> extends Error {
    statusCode: K;
    constructor(statusCode: K, message?: string);
}
export declare class BadRequest extends HttpError<400> {
    constructor(message?: string);
}
export declare class Unauthorized extends HttpError<401> {
    constructor(message?: string);
}
export declare class Forbidden extends HttpError<403> {
    constructor(message?: string);
}
export declare class NotFound extends HttpError<404> {
    constructor(message?: string);
}
export declare class MethodNotAllowed extends HttpError<405> {
    constructor(message?: string);
}
export declare class Conflict extends HttpError<409> {
    constructor(message?: string);
}
export declare class UnsupportedMediaType extends HttpError<415> {
    constructor(message?: string);
}
export declare class ImAteapot extends HttpError<418> {
    constructor(message?: string);
}
export declare class TooManyRequests extends HttpError<429> {
    constructor(message?: string);
}
export declare class InternalServerError extends HttpError<500> {
    constructor(message?: string);
}
export declare class NotImplemented extends HttpError<501> {
    constructor(message?: string);
}
export {};

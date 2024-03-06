import { ALL, NAME, PARAMETER, ROUTE, SCHEMA_TYPE } from './constant';
import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'http';
import { Server } from './server';

export type NumberSchema = {
	type: SCHEMA_TYPE.NUMBER;
	enum?: undefined;
	minimum?: number;
	maximum?: number;
	isInteger?: true;
	isOptional?: undefined;
} | {
	type: SCHEMA_TYPE.NUMBER;
	enum?: undefined;
	minimum?: number;
	maximum?: number;
	isInteger?: true;
	default?: number;
	isOptional: true;
} | {
	type: SCHEMA_TYPE.NUMBER;
	minimum?: undefined;
	maximum?: undefined;
	isInteger?: undefined;
	enum: number[];
	isOptional?: undefined;
} | {
	type: SCHEMA_TYPE.NUMBER;
	minimum?: undefined;
	maximum?: undefined;
	isInteger?: undefined;
	enum: number[];
	default?: number;
	isOptional: true;
};

export type StringSchema = {
	type: SCHEMA_TYPE.STRING;
	pattern?: undefined;
	enum?: undefined;
	minimum?: number;
	maximum?: number;
	isOptional?: undefined;
} | {
	type: SCHEMA_TYPE.STRING;
	pattern?: undefined;
	enum?: undefined;
	minimum?: number;
	maximum?: number;
	default?: string;
	isOptional: true;
} | {
	type: SCHEMA_TYPE.STRING;
	pattern: RegExp;
	enum?: undefined;
	minimum?: undefined;
	maximum?: undefined;
	isOptional?: undefined;
} | {
	type: SCHEMA_TYPE.STRING;
	pattern: RegExp;
	enum?: undefined;
	minimum?: undefined;
	maximum?: undefined;
	default?: string;
	isOptional: true;
} | {
	type: SCHEMA_TYPE.STRING,
	enum: string[];
	pattern?: undefined;
	minimum?: undefined;
	maximum?: undefined;
	isOptional?: undefined;
} | {
	type: SCHEMA_TYPE.STRING,
	enum: string[];
	pattern?: undefined;
	minimum?: undefined;
	maximum?: undefined;
	default?: string;
	isOptional: true;
}

export type BooleanSchema = {
	type: SCHEMA_TYPE.BOOLEAN;
	isOptional?: undefined;
} | {
	type: SCHEMA_TYPE.BOOLEAN;
	default?: boolean;
	isOptional: true;
};

export type NullSchema = {
	type: SCHEMA_TYPE.NULL;
	isOptional?: undefined;
} | {
	type: SCHEMA_TYPE.NULL;
	default?: null;
	isOptional: true;
};

export type ObjectSchema = {
	type: SCHEMA_TYPE.OBJECT;
	properties: Record<string, Schema>;
	allowAdditionalProperties?: true;
	isOptional?: undefined;
} | {
	type: SCHEMA_TYPE.OBJECT;
	properties: Record<string, Schema>;
	isOptional: true;
	default?: {};
	allowAdditionalProperties?: true;
};

export type ArraySchema = {
	type: SCHEMA_TYPE.ARRAY;
	items: Schema | Schema[];
	minimum?: number;
	maximum?: number;
	isOptional?: undefined;
} | {
	type: SCHEMA_TYPE.ARRAY;
	items: Schema | Schema[];
	minimum?: number;
	maximum?: number;
	isOptional: true;
	default?: {}[];
};

export type NotSchema = {
	type: SCHEMA_TYPE.NOT;
	isOptional?: true;
	schema: Schema;
};

export type AndSchema = {
	type: SCHEMA_TYPE.AND;
	isOptional?: true;
	schemas: Schema[];
};

export type OrSchema = {
	type: SCHEMA_TYPE.OR;
	isOptional?: true;
	schemas: Schema[];
};

export type GenericKey = 'parameters' | 'query' | 'headers' | 'body';

export type Schema = NumberSchema | StringSchema | BooleanSchema | NullSchema | ObjectSchema | ArraySchema | AndSchema | OrSchema | NotSchema;

export interface Request<T extends Partial<Record<GenericKey, unknown>> = Partial<Record<GenericKey, unknown>>> extends Omit<IncomingMessage, 'method' | 'url' | 'statusCode' | 'statusMessage'>, Required<Pick<IncomingMessage, 'url'>> {
	method: Method;
	server: Server;
	response: Response<T>;
	ip: string;
	startTime: number;
	parameters: T['parameters'];
	query: T['query'];
	headers: T['headers'] & IncomingHttpHeaders;
	body: T['body'];
}

export interface Response<T extends Partial<Record<GenericKey, unknown>> = Partial<Record<GenericKey, unknown>>> extends Omit<ServerResponse, 'req'> {
	server: Server;
	request: Request<T>;
	send: (data?: unknown) => void;
	setStatus: (code: number) => void;
	redirect: (url: string, code?: number) => void;
}

export type Handler = (request: Request, response: Response) => Promise<unknown> | unknown;

export interface Route {
	handlers: Handler[];
	schema?: Partial<Record<GenericKey, Schema>>;
}

export type Tree = Map<typeof ROUTE, Route> & Map<typeof ALL | typeof PARAMETER | string, Tree> & Map<typeof NAME, string>;

export interface ServerOptions {
	isProxied: boolean;
}

export type BodyParser = (request: Request) => Promise<unknown> | unknown;

export type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

//export type HttpErrorCode = 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 510 | 511;
export type HttpErrorCode = 400 | 401 | 403 | 404 | 405 | 409 | 415 | 418 | 429 | 500 | 501;
import { HttpErrorCode } from './type';

export const ALL: unique symbol = Symbol('all');

export const PARAMETER: unique symbol = Symbol('parameter');

export const NAME: unique symbol = Symbol('name');

export const ROUTE: unique symbol = Symbol('route');

export const enum SCHEMA_TYPE {
	NUMBER,
	STRING,
	BOOLEAN,
	NULL,
	OBJECT,
	ARRAY,
	AND,
	OR,
	NOT
}

export const SCHEMA_TYPES: {
	readonly NUMBER: SCHEMA_TYPE.NUMBER;
	readonly STRING: SCHEMA_TYPE.STRING;
	readonly BOOLEAN: SCHEMA_TYPE.BOOLEAN;
	readonly NULL: SCHEMA_TYPE.NULL;
	readonly OBJECT: SCHEMA_TYPE.OBJECT;
	readonly ARRAY: SCHEMA_TYPE.ARRAY;
	readonly AND: SCHEMA_TYPE.AND;
	readonly OR: SCHEMA_TYPE.OR;
	readonly NOT: SCHEMA_TYPE.NOT;
} = {
	NUMBER: SCHEMA_TYPE.NUMBER,
	STRING: SCHEMA_TYPE.STRING,
	BOOLEAN: SCHEMA_TYPE.BOOLEAN,
	NULL: SCHEMA_TYPE.NULL,
	OBJECT: SCHEMA_TYPE.OBJECT,
	ARRAY: SCHEMA_TYPE.ARRAY,
	AND: SCHEMA_TYPE.AND,
	OR: SCHEMA_TYPE.OR,
	NOT: SCHEMA_TYPE.NOT
};

export const HTTP_ERROR_CODES: Readonly<Map<HttpErrorCode, string>> = new Map<HttpErrorCode, string>([
	[400, 'Bad Request'],
	[401, 'Unauthorized'],
	//[402, 'Payment Required'],
	[403, 'Forbidden'],
	[404, 'Not Found'],
	[405, 'Method Not Allowed'],
	//[406, 'Not Acceptable'],
	//[407, 'Proxy Authentication Required'],
	//[408, 'Request Timeout'],
	[409, 'Conflict'],
	//[410, 'Gone'],
	//[411, 'Length Required'],
	//[412, 'Precondition Failed'],
	//[413, 'Payload Too Large'],
	//[414, 'URI Too Long'],
	[415, 'Unsupported Media Type'],
	//[416, 'Range Not Satisfiable'],
	//[417, 'Expectation Failed'],
	[418, 'I\'m a teapot'],
	//[421, 'Misdirected Request'],
	//[425, 'Too Early'],
	//[426, 'Upgrade Required'],
	//[428, 'Precondition Required'],
	[429, 'Too Many Requests'],
	//[431, 'Request Header Fields Too Large'],
	//[451, 'Unavailable For Legal Reasons'],
	[500, 'Internal Server Error'],
	[501, 'Not Implemented'],
	//[502, 'Bad Gateway'],
	//[503, 'Service Unavailable'],
	//[504, 'Gateway Timeout'],
	//[505, 'HTTP Version Not Supported'],
	//[506, 'Variant Also Negotiates'],
	//[510, 'Not Extended'],
	//[511, 'Network Authentication Required']
]);
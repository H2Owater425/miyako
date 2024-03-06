import { HttpErrorCode } from './type';
export declare const ALL: unique symbol;
export declare const PARAMETER: unique symbol;
export declare const NAME: unique symbol;
export declare const ROUTE: unique symbol;
export declare const enum SCHEMA_TYPE {
    NUMBER = 0,
    STRING = 1,
    BOOLEAN = 2,
    NULL = 3,
    OBJECT = 4,
    ARRAY = 5,
    AND = 6,
    OR = 7,
    NOT = 8
}
export declare const SCHEMA_TYPES: {
    readonly NUMBER: SCHEMA_TYPE.NUMBER;
    readonly STRING: SCHEMA_TYPE.STRING;
    readonly BOOLEAN: SCHEMA_TYPE.BOOLEAN;
    readonly NULL: SCHEMA_TYPE.NULL;
    readonly OBJECT: SCHEMA_TYPE.OBJECT;
    readonly ARRAY: SCHEMA_TYPE.ARRAY;
    readonly AND: SCHEMA_TYPE.AND;
    readonly OR: SCHEMA_TYPE.OR;
    readonly NOT: SCHEMA_TYPE.NOT;
};
export declare const HTTP_ERROR_CODES: Readonly<Map<HttpErrorCode, string>>;

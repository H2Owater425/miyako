import { HTTP_ERROR_CODES } from './constant';
import { HttpErrorCode } from './type';

export class ValidationError extends Error {
	constructor(path: string, condition: string) {
		super(path + ' must ' + condition);
	}
}

class HttpError<K extends HttpErrorCode> extends Error {
	public statusCode: K;
	
	constructor(statusCode: K, message?: string) {
		super(message);
		this.statusCode = statusCode;
		this.name = HTTP_ERROR_CODES.get(statusCode) as string;
	}
}

export class BadRequest extends HttpError<400> {
	constructor(message?: string) {
		super(400, message);
	}
}

export class Unauthorized extends HttpError<401> {
	constructor(message?: string) {
		super(401, message);
	}
}

//export class PaymentRequired extends HttpError<402> {
//	constructor(message?: string) {
//		super(402, message);
//	}
//}

export class Forbidden extends HttpError<403> {
	constructor(message?: string) {
		super(403, message);
	}
}

export class NotFound extends HttpError<404> {
	constructor(message?: string) {
		super(404, message);
	}
}

export class MethodNotAllowed extends HttpError<405> {
	constructor(message?: string) {
		super(405, message);
	}
}

//export class NotAcceptable extends HttpError<406> {
//	constructor(message?: string) {
//		super(406, message);
//	}
//}

//export class ProxyAuthenticationRequired extends HttpError<407> {
//	constructor(message?: string) {
//		super(407, message);
//	}
//}

//export class RequestTimeout extends HttpError<408> {
//	constructor(message?: string) {
//		super(408, message);
//	}
//}

export class Conflict extends HttpError<409> {
	constructor(message?: string) {
		super(409, message);
	}
}

//export class Gone extends HttpError<410> {
//	constructor(message?: string) {
//		super(410, message);
//	}
//}

//export class LengthRequired extends HttpError<411> {
//	constructor(message?: string) {
//		super(411, message);
//	}
//}

//export class PreconditionFailed extends HttpError<412> {
//	constructor(message?: string) {
//		super(412, message);
//	}
//}

//export class PayloadTooLarge extends HttpError<413> {
//	constructor(message?: string) {
//		super(413, message);
//	}
//}

//export class URITooLong extends HttpError<414> {
//	constructor(message?: string) {
//		super(414, message);
//	}
//}

export class UnsupportedMediaType extends HttpError<415> {
	constructor(message?: string) {
		super(415, message);
	}
}

//export class RangeNotSatisfiable extends HttpError<416> {
//	constructor(message?: string) {
//		super(416, message);
//	}
//}

//export class ExpectationFailed extends HttpError<417> {
//	constructor(message?: string) {
//		super(417, message);
//	}
//}

export class ImAteapot extends HttpError<418> {
	constructor(message?: string) {
		super(418, message);
	}
}

//export class MisdirectedRequest extends HttpError<421> {
//	constructor(message?: string) {
//		super(421, message);
//	}
//}

//export class TooEarly extends HttpError<425> {
//	constructor(message?: string) {
//		super(425, message);
//	}
//}

//export class UpgradeRequired extends HttpError<426> {
//	constructor(message?: string) {
//		super(426, message);
//	}
//}

//export class PreconditionRequired extends HttpError<428> {
//	constructor(message?: string) {
//		super(428, message);
//	}
//}

export class TooManyRequests extends HttpError<429> {
	constructor(message?: string) {
		super(429, message);
	}
}

//export class RequestHeaderFieldsTooLarge extends HttpError<431> {
//	constructor(message?: string) {
//		super(431, message);
//	}
//}

//export class UnavailableForLegalReasons extends HttpError<451> {
//	constructor(message?: string) {
//		super(451, message);
//	}
//}

export class InternalServerError extends HttpError<500> {
	constructor(message?: string) {
		super(500, message);
	}
}

export class NotImplemented extends HttpError<501> {
	constructor(message?: string) {
		super(501, message);
	}
}

//export class BadGateway extends HttpError<502> {
//	constructor(message?: string) {
//		super(502, message);
//	}
//}

//export class ServiceUnavailable extends HttpError<503> {
//	constructor(message?: string) {
//		super(503, message);
//	}
//}

//export class GatewayTimeout extends HttpError<504> {
//	constructor(message?: string) {
//		super(504, message);
//	}
//}

//export class HTTPVersionNotSupported extends HttpError<505> {
//	constructor(message?: string) {
//		super(505, message);
//	}
//}

//export class VariantAlsoNegotiates extends HttpError<506> {
//	constructor(message?: string) {
//		super(506, message);
//	}
//}

//export class NotExtended extends HttpError<510> {
//	constructor(message?: string) {
//		super(510, message);
//	}
//}

//export class NetworkAuthenticationRequired extends HttpError<511> {
//	constructor(message?: string) {
//		super(511, message);
//	}
//}
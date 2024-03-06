import { Server as _Server, IncomingMessage, ServerResponse } from 'http';
import { BodyParser, GenericKey, Method, Request, Response, Route, Schema, ServerOptions } from './type';
import { Router } from './router';
import { Logger } from './logger';
import { BadRequest, MethodNotAllowed, NotFound, UnsupportedMediaType, ValidationError } from './error';
import { parse, UrlWithParsedQuery } from 'url';
import { validate } from './validator';

export class Server extends _Server<Request & typeof IncomingMessage, Response & typeof ServerResponse> {
	#options: ServerOptions;
	#routers: Map<Method, Router> = new Map<Method, Router>([
		['POST', new Router()],
		['GET', new Router()],
		['PATCH', new Router()],
		['DELETE', new Router()]
	]);
	#logger: Logger = Logger['instance'];
	#bodyParsers: Map<string, BodyParser> = new Map([['application/json', function (request: Request): Promise<unknown> {
		return new Promise<unknown>(function (resolve: (body: unknown) => void, reject: (error: unknown) => void): void {
			try {
				const buffers: Buffer[] = [];

				request.on('data', function (buffer: Buffer): void {
					buffers.push(buffer);

					return;
				})
				.once('end', function (): void {
					resolve(JSON.parse(String(Buffer.concat(buffers))));
					
					return;
				})
				.once('error', reject);
			} catch(error: unknown) {
				reject(error);
			}
			return;
		});
	}]]);

	static #send(this: Response, data?: unknown, contentType?: string): void {
		if(!this['writableEnded']) {
			let isEmpty: boolean = false;

			switch(typeof(data)) {
				case 'object': {
					if(typeof(contentType) !== 'string') {
						contentType = 'application/json';
					}

					if(data instanceof Error) {
						// @ts-expect-error
						this['statusCode'] = typeof(data['statusCode']) === 'number' ? data['statusCode'] : data instanceof ValidationError ? 400 : 500;

						const isClientError: boolean = this['statusCode'] < 500;

						if(!isClientError && typeof(data['stack']) === 'string') {
							data['stack'] += '\n';

							let currentIndex: number = 0;
							let nextIndex: number = data['stack'].indexOf('\n');

							while(nextIndex !== -1) {
								this['server']['logger'].warn(data['stack'].slice(currentIndex, nextIndex));

								currentIndex = nextIndex + 1;
								nextIndex = data['stack'].indexOf('\n', currentIndex);
							}
						}

						data = '{"status":"' + (isClientError ? 'fail","data":{"title":"' + data['message'].replace(/"/g, '\\"') + '"}' : 'error","code":' + this['statusCode'] + ',"message":"' + data['message'].replace(/"/g, '\\"') + '"') + '}';
					} else {
						data = '{"status":"success","data":' + JSON.stringify(data) + '}';
					}

					break;
				}

				case 'undefined': {
					isEmpty = true;
				
					break;
				}

				default: {
					if(typeof(contentType) !== 'string') {
						contentType = 'text/plain';
					}

					data = String(data);
				}
			}

			if(!isEmpty) {
				this.setHeader('Content-Type', contentType + ';charset=utf-8');
				this.setHeader('Content-Length', Buffer.byteLength(data as string));
				this.write(data);
			}

			this.end();

			this['server']['logger'].info(this['request']['ip'] + ' "' + this['request']['method'] + ' ' + decodeURIComponent(this['request']['url'] as string) + ' HTTP/' + this['request']['httpVersion'] + '" ' + this['statusCode'] + ' "' + this['request']['headers']['user-agent'] + '" (' + (Date.now() - this['request']['startTime']) + 'ms)');
		} else {
			this['server']['logger'].warn('Send must not be called after end');
		}
	}

	static #setStatus(this: Response, code: number): void {
		this['statusCode'] = code;

		return;
	}

	static #redirect(this: Response, url: string, code: number = 307): void {
		this['statusCode'] = code;

		this.setHeader('location', url);
		this.end();

		return;
	}

	static #requestHandler(handlers: Route['handlers'], request: Request, response: Response): Promise<unknown> {
		return handlers.slice(1)
		.reduce(function (promise: Promise<unknown>, handler: Route['handlers'][number]): Promise<unknown> {
			return promise.then(function (): Promise<unknown> {
				return Promise.resolve(handler(request, response));
			});
		}, Promise.resolve(handlers[0](request, response)));
	}

	constructor(options: Partial<ServerOptions> = {}) {
		// @ts-expect-error
		super(function (this: Server, request: Request, response: Response): void {
			try {
				Object.assign(request, {
					server: this,
					startTime: Date.now()
				});

				if(this.#options['isProxied'] && typeof(request['headers']['x-forwarded-for']) === 'string') {
					const index: number = request['headers']['x-forwarded-for'].indexOf(',');
					
					request['ip'] = request['headers']['x-forwarded-for'].slice(0, index !== -1 ? index : undefined);
				} else {
					request['ip'] = (request['socket']['remoteAddress'] as string)[0] !== ':' ? request['socket']['remoteAddress'] as string : '127.0.0.1';
				}
				
				// @ts-expect-error
				delete response['req'];
				
				Object.assign(response, {
					server: this,
					request: request,
					setStatus: Server.#setStatus,
					send: Server.#send,
					redirect: Server.#redirect
				});

				const router: Router | undefined = this.#routers.get(request['method'] as Method);

				if(typeof(router) !== 'undefined') {
					const url: UrlWithParsedQuery = parse(request['url'] as string, true);
					const routerResult: [Route, Record<string, unknown>] | undefined = router.getRoute(url['pathname'] as string);

					if(typeof(routerResult) !== 'undefined') {
						Object.assign(request, {
							query: url['query'],
							parameter: routerResult[1]
						});

						for(const key in routerResult[0]['schema']) {
							if(key !== 'body') {
								for(const _key in request[key as GenericKey] as Record<string, string>) {
									if(typeof((request[key as GenericKey] as Record<string, string>)[_key]) === 'string') {
										(request[key as GenericKey] as Record<string, string>)[_key] = decodeURIComponent((request[key as GenericKey] as Record<string, string>)[_key]);
									}
								}

								if(typeof(routerResult[0]['schema'][key as GenericKey]) !== 'undefined') {
									const validationResult: unknown = validate(routerResult[0]['schema'][key as GenericKey] as Schema, request[key as GenericKey], key[0].toUpperCase() + key.slice(1), true);

									if(typeof(validationResult) !== 'undefined') {
										// @ts-expect-error
										request[key as GenericKey] = validationResult;
									}
								}
							}
						}

						if(typeof(request['headers']['content-type']) === 'string') {
							switch(request['method']) {
								case 'POST':
								case 'PATCH': {
									const endIndex: number = request['headers']['content-type'].indexOf(';');
									const contentType: string = request['headers']['content-type'].slice(0, endIndex !== -1 ? endIndex : undefined);

									const bodyParser: BodyParser | undefined = this.#bodyParsers.get(contentType);

									if(typeof(bodyParser) === 'function') {
										Promise.resolve(bodyParser(request))
										.then(function (body: unknown): Promise<unknown> {
											request['body'] = body;

											if(typeof(routerResult[0]['schema']) !== 'undefined' && typeof(routerResult[0]['schema']['body']) !== 'undefined') {
												const validationResult: unknown = validate(routerResult[0]['schema']['body'], request['body'], 'Body', false);
											
												if(typeof(validationResult) !== 'undefined') {
													request['body'] = validationResult;
												}
											}

											return Server.#requestHandler(routerResult[0]['handlers'], request, response);
										})
										.catch(response.send.bind(response));
									} else {
										throw new UnsupportedMediaType('BodyParser must be exist');
									}

									break;
								}

								default: {
									throw new BadRequest('Body must be empty');
								}
							}
						} else {
							if(typeof(routerResult[0]['schema']) !== 'undefined' && typeof(routerResult[0]['schema']['body']) !== 'undefined') {
								const validationResult: unknown = validate(routerResult[0]['schema']['body'], request['body'], 'Body', false);
							
								if(typeof(validationResult) !== 'undefined') {
									request['body'] = validationResult;
								}
							}

							Server.#requestHandler(routerResult[0]['handlers'], request, response);
						}
					} else {
						throw new NotFound('Path must be exist');
					}
				} else {
					throw new MethodNotAllowed('Method must be one of GET, POST, PATCH, DELETE');
				}
			} catch(error: unknown) {
				response.send(error);
			}

			return;
		});

		if(typeof(options['isProxied']) !== 'boolean') {
			options['isProxied'] = false;
		}

		this.#options = options as ServerOptions;
	}

	get logger(): Logger {
		return this.#logger;
	}

	public setRoute(method: Method, path: string, route: Route): Server {
		const router: Router | undefined = this.#routers.get(method);

		if(typeof(router) !== 'undefined') {
			router.setRoute(path, route);

			return this;
		} else {
			throw new MethodNotAllowed('Method must be one of GET, POST, PATCH, DELETE');
		}
	}

	public setBodyParser(contentType: string, bodyParser: BodyParser): Server {
		this.#bodyParsers.set(contentType, bodyParser);

		return this;
	}
}
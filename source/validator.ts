import { SCHEMA_TYPE } from './constant';
import { ValidationError } from './error';
import { Schema } from './type';

export function validate(schema: Schema, target: unknown, path: string = '', shouldConvertType: boolean = false): unknown {		
	switch(schema['type']) {
		case SCHEMA_TYPE['NUMBER']: {
			shouldConvertType = shouldConvertType === true && typeof(target) !== 'undefined';
			
			if(shouldConvertType) {
				target = Number(target);
			}

			if(typeof(target) === 'number') {
				if(Number.isNaN(target)) {
					throw new ValidationError(path, 'be number');
				}

				if(Array.isArray(schema['enum'])) {
					if(!schema['enum'].includes(target)) {
						throw new ValidationError(path, 'be one of ' + JSON.stringify(schema['enum']));
					}
				} else {
					if(schema['isInteger'] === true && !Number.isInteger(target)) {
						throw new ValidationError(path, 'be integer');
					}
	
					if(typeof(schema['maximum']) === 'number' && target > schema['maximum']) {
						throw new ValidationError(path, 'be smaller than ' + schema['maximum']);
					}
	
					if(typeof(schema['minimum']) === 'number' && target < schema['minimum']) {
						throw new ValidationError(path, 'be bigger than ' + schema['minimum']);
					}
				}

				if(shouldConvertType) {
					return target;
				} else {
					return;
				}
			} else if(typeof(target) === 'undefined') {
				if(schema['isOptional'] === true) {
					return schema['default'];
				} else {
					throw new ValidationError(path, 'exist');
				}
			} else {
				throw new ValidationError(path, 'be number');
			}
		}

		case SCHEMA_TYPE['STRING']: {
			shouldConvertType = shouldConvertType === true && typeof(target) !== 'undefined';

			if(shouldConvertType) {
				target = String(target);
			}

			if(typeof(target) === 'string') {
				if(Array.isArray(schema['enum'])) {
					if(!schema['enum'].includes(target)) {
						throw new ValidationError(path, 'be one of ' + JSON.stringify(schema['enum']));
					}
				} else if(typeof(schema['pattern']) === 'undefined') {
					if(typeof(schema['maximum']) === 'number' && target['length'] > schema['maximum']) {
						throw new ValidationError(path, 'be shorter than ' + schema['maximum']);
					}

					if(typeof(schema['minimum']) === 'number' && target['length'] < schema['minimum']) {
						throw new ValidationError(path, 'be longer than ' + schema['minimum']);
					}
				} else {
					if(!schema['pattern'].test(target)) {
						throw new ValidationError(path, 'match ' + schema['pattern']);
					}
				}

				if(shouldConvertType) {
					return target;
				} else {
					return;
				}
			} else if(typeof(target) === 'undefined') {
				if(schema['isOptional'] === true) {
					return schema['default'];
				} else {
					throw new ValidationError(path, 'exist');
				}
			} else {
				throw new ValidationError(path, 'be string');
			}
		}

		case SCHEMA_TYPE['BOOLEAN']: {
			if(shouldConvertType === true) {
				switch(target) {
					case 'true':
					case '1': {
						return true;
					}

					case 'false':
					case '0': {
						return false;
					}

					case '': {
						target = undefined;
					}
				}
			}

			if(typeof(target) === 'boolean') {
				return;
			} else if(typeof(target) === 'undefined') {
				if(schema['isOptional'] === true) {
					return schema['default'];
				} else {
					throw new ValidationError(path, 'exist');
				}
			} else {
				throw new ValidationError(path, 'be boolean');
			}
		}

		case SCHEMA_TYPE['NULL']: {
			if(shouldConvertType === true && target === 'null') {
				return null;
			}

			if(target === null) {
				return;
			} else if(typeof(target) === 'undefined') {
				if(schema['isOptional'] === true) {
					return schema['default'];
				} else {
					throw new ValidationError(path, 'exist');
				}
			} else {
				throw new ValidationError(path, 'be null');
			}
		}

		case SCHEMA_TYPE['OBJECT']: {
			if(typeof(target) === 'object' && target !== null) {
				for(const key in schema['properties']) {
					// @ts-expect-error
					const result: unknown = validate(schema['properties'][key], target[key], path + '["' + key.replace(/"/g, '\\"') + '"]', shouldConvertType);
					
					if(typeof(result) !== 'undefined') {
						// @ts-expect-error
						target[key] = result;
					}
				}

				if(schema['allowAdditionalProperties'] !== true) {
					for(const key in target) {
						if(typeof(schema['properties'][key]) === 'undefined') {
							throw new ValidationError(path, 'not have additional property');
						}
					}
				}

				return;
			} else if(typeof(target) === 'undefined') {
				if(schema['isOptional'] === true) {
					return schema['default'];
				} else {
					throw new ValidationError(path, 'exist');
				}
			} else {
				throw new ValidationError(path, 'be object');
			}
		}

		case SCHEMA_TYPE['ARRAY']: {
			if(Array.isArray(target)) {
				if(typeof(schema['maximum']) === 'number' && target['length'] > schema['maximum']) {
					throw new ValidationError(path, 'be shorter than ' + schema['maximum']);
				}

				if(typeof(schema['minimum']) === 'number' && target['length'] < schema['minimum']) {
					throw new ValidationError(path, 'be longer than ' + schema['minimum']);
				}

				if(Array.isArray(schema['items'])) {
					for(let i: number = 0; i < target['length']; i++) {
						const result: unknown = validate(schema['items'][i], target[i], path + '[' + i + ']', shouldConvertType);

						if(typeof(result) !== 'undefined') {
							target[i] = result;
						}
					}
				} else {
					for(let i: number = 0; i < target['length']; i++) {
						const result: unknown = validate(schema['items'], target[i], path + '[' + i + ']', shouldConvertType);

						if(typeof(result) !== 'undefined') {
							target[i] = result;
						}
					}
				}

				return;
			} else if(typeof(target) === 'undefined') {
				if(schema['isOptional'] === true) {
					return schema['default'];
				} else {
					throw new ValidationError(path, 'exist');
				}
			} else {
				throw new ValidationError(path, 'be array');
			}
		}

		case SCHEMA_TYPE['AND']: {
			if(schema['schemas']['length'] > 1) {
				if(typeof(target) !== 'undefined') {
					let _shouldConvertType: boolean = shouldConvertType === true;

					for(let i: number = 0; i < schema['schemas']['length']; i++) {
						const result: unknown = validate(schema['schemas'][i], target, path, _shouldConvertType);

						if(typeof(result) !== 'undefined') {
							target = result;
							_shouldConvertType = false;
						}
					}

					if(shouldConvertType === true) {
						return target;
					}
				} else if(schema['isOptional'] !== true) {
					throw new ValidationError(path, 'exist');
				}
				
				return;
			} else {
				throw new ValidationError(path, 'be all of schemas');
			}
		}

		case SCHEMA_TYPE['OR']: {
			if(schema['schemas']['length'] > 1) {
				if(typeof(target) !== 'undefined') {
					for(let i: number = 0; i < schema['schemas']['length']; i++) {
						try {
							const result: unknown = validate(schema['schemas'][i], target, path, shouldConvertType);

							if(typeof(result) !== 'undefined') {
								return result;
							} else {
								return;
							}
						} catch {};
					}
				} else if(schema['isOptional'] !== true) {
					throw new ValidationError(path, 'exist');
				} else {
					return;
				}
			}

			throw new ValidationError(path, 'be one of schemas');
		}

		case SCHEMA_TYPE['NOT']: {
			if(typeof(target) === 'undefined') {
				try {
					validate(schema['schema'], target, path);
				} catch {
					return;
				}
				
				throw new ValidationError(path, 'not be schema');
			} else if(schema['isOptional'] !== true) {
				throw new ValidationError(path, 'exist');
			} else {
				return;
			}
		}

		default: {
			throw new Error('Schema must be valid');
		}
	}
}
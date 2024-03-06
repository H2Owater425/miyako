import { Socket } from 'net';
import { inspect } from 'util';

export class Logger {
	public static instance: Logger = new Logger();

	static #log(level: 'FATAL' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE', _arguments: unknown[]): void {
		let print: Socket['write'];
		let levelColor: number = 32;

		switch(level) {
			case 'ERROR':
			case 'FATAL': {
				print = process['stderr'].write.bind(process['stderr']);
				levelColor--;

				break;
			}

			case 'WARN': {
				levelColor++;
			}

			default: {
				print = process['stdout'].write.bind(process['stdout']);
			}
		}

		for(let i: number = 0; i < _arguments['length']; i++) {
			if(typeof(_arguments[i]) === 'object') {
				_arguments[i] = inspect(_arguments[i], false, null, true);
			}
		}

		print('[\x1b[36m' + new Date().toTimeString().slice(0, 8) + '\x1b[37m][\x1b[' + levelColor + 'm' + level + '\x1b[37m]' + ' '.repeat(6 - level['length']) + _arguments.join(' ') + '\n');

		return;
	}

	public fatal(..._arguments: unknown[]): void {
		Logger.#log('FATAL', _arguments);

		return;
	}

	public error(..._arguments: unknown[]): void {
		Logger.#log('ERROR', _arguments);

		return;
	}

	public warn(..._arguments: unknown[]): void {
		Logger.#log('WARN', _arguments);

		return;
	}

	public info(..._arguments: unknown[]): void {
		Logger.#log('INFO', _arguments);

		return;
	}

	public debug(..._arguments: unknown[]): void {
		Logger.#log('DEBUG', _arguments);

		return;
	}

	public trace(..._arguments: unknown[]): void {
		Logger.#log('TRACE', _arguments);

		return;
	}
}
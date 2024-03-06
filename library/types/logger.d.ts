export declare class Logger {
    #private;
    static instance: Logger;
    fatal(..._arguments: unknown[]): void;
    error(..._arguments: unknown[]): void;
    warn(..._arguments: unknown[]): void;
    info(..._arguments: unknown[]): void;
    debug(..._arguments: unknown[]): void;
    trace(..._arguments: unknown[]): void;
}

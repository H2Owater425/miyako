import { Route } from './type';
export declare class Router {
    #private;
    setRoute(path: string, route: Route): void;
    getRoute(path: string, parameter?: Record<string, unknown>): [Route, Record<string, unknown>] | undefined;
}

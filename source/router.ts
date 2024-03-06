import { ALL, NAME, PARAMETER, ROUTE } from './constant';
import { Route, Tree } from './type';

export class Router {
	#staticRoutes: Map<string, Route> = new Map<string, Route>();
	#tree: Tree = new Map();

	public setRoute(path: string, route: Route): void {
		if(path[0] === '/') {
			let tree: Tree = this.#tree;
			let isStatic: boolean = true;

			if(path['length'] !== 1) {
				if(path[path['length'] - 1] !== '/') {
					path += '/';

					let currentIndex: number = 1;
					let nextIndex: number = path.indexOf('/', 1);
					let treePath: typeof ALL | typeof PARAMETER | string;
					let targetTree: Tree | undefined;
	
					while(nextIndex !== -1) {
						treePath = path.slice(currentIndex, nextIndex);
						targetTree = tree.get(treePath);
	
						if(typeof(targetTree) !== 'object') {
							if(treePath[0] === ':') {
								targetTree = tree.get(PARAMETER);
								treePath = treePath.slice(1);
	
								if(typeof(targetTree) !== 'object') {
									targetTree = new Map([[NAME, treePath]]) as Tree;
	
									tree.set(PARAMETER, targetTree);

									if(isStatic) {
										isStatic = false;
									}
								} else if(targetTree.get(NAME) !== treePath) {
									throw new Error('Parameter name must match');
								}
							} else if(treePath === '*') {
								if(path['length'] === nextIndex + 1) {
									targetTree = tree.get(ALL);
		
									if(typeof(targetTree) !== 'object') {
										targetTree = new Map();
		
										tree.set(ALL, targetTree);

										if(isStatic) {
											isStatic = false;
										}
									}
								} else {
									throw new Error('All must be end of the path');
								}
							} else {
								targetTree = new Map();
	
								tree.set(treePath, targetTree);
							}
						}
	
						tree = targetTree;
						currentIndex = nextIndex + 1;
						nextIndex = path.indexOf('/', currentIndex);
					}
				} else {
					throw new Error('Path must not ends with /');
				}
			}

			if(!tree.has(ROUTE)) {
				tree.set(ROUTE, route);

				if(isStatic) {
					this.#staticRoutes.set(path, route);
				}
	
				return;
			} else {
				throw new Error('Path must be unique');
			}
		} else {
			throw new Error('Path must starts with /');
		}
	}

	public getRoute(path: string, parameter: Record<string, unknown> = {}): [Route, Record<string, unknown>] | undefined {
		if(path[0] === '/') {
			const staticRoute: Route | undefined = this.#staticRoutes.get(path);
			
			if(typeof(staticRoute) !== 'object') {
				let tree: Tree = this.#tree;

				if(path['length'] !== 1) {
					if(path[path['length'] - 1] !== '/') {
						path += '/';
	
						let currentIndex: number = 1;
						let nextIndex: number = path.indexOf('/', 1);
						let treePath: typeof ALL | typeof PARAMETER | string;
						let targetTree: Tree | undefined;
						let lastAllTree: Tree | undefined;
	
						while(nextIndex !== -1) {
							treePath = path.slice(currentIndex, nextIndex);
							targetTree = tree.get(treePath);
	
							if(typeof(lastAllTree) !== 'object') {
								lastAllTree = tree.get(ALL);
	
								if(typeof(lastAllTree) !== 'undefined' && !tree.has(ROUTE)) {
									lastAllTree = undefined;
								}
							}
	
							if(typeof(targetTree) !== 'object') {
								targetTree = tree.get(PARAMETER);
	
								if(typeof(targetTree) !== 'object') {
									targetTree = tree.get(ALL);
	
									if(typeof(targetTree) !== 'object') {
										if(typeof(lastAllTree) !== 'undefined') {
											tree = lastAllTree;
	
											break;
										} else {
											return;
										}
									} else {
										lastAllTree = targetTree;
									}
								} else {
									parameter[targetTree.get(NAME) as string] = treePath;
								}
							}

							tree = targetTree;
							currentIndex = nextIndex + 1;
							nextIndex = path.indexOf('/', currentIndex);
						}
					} else {
						return;
					}
				} else if(!tree.has(ROUTE)) {
					const allTree: Tree | undefined = tree.get(ALL);

					if(typeof(allTree) !== 'undefined' && allTree.has(ROUTE)) {
						tree = allTree;
					}
				}
	
				const route: Route | undefined = tree.get(ROUTE);
	
				return typeof(route) !== 'undefined' ? [route, parameter] : undefined;
			} else {
				return [staticRoute, parameter];
			}
		} else {
			throw new Error('Path must starts with /');
		}
	}
}
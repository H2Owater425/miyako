/**
 * @type {import('rollup').RollupOptions}
 */
exports.default = {
	input: 'source/index.ts',
	output: {
		file: 'library/index.js',
		format: 'cjs',
		generatedCode: {
			constBindings: true
		}
	},
	plugins: [require('@rollup/plugin-typescript')({
		module: 'ESNext'
	}), require('@rollup/plugin-terser')()],
	external: ['http', 'url', 'net', 'util']
};
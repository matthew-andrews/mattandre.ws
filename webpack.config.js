'use strict';

const config = require('./n-makefile.json');
const packageJson = require('./package.json');
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ExtractCssBlockPlugin = require('extract-css-block-webpack-plugin');

function AssetHashesPlugin() {
	const fs = require('fs');
	const crypto = require('crypto');

	return function () {
		this.plugin('done', stats => {
			const hashable = Object.keys(stats.compilation.assets)
				.filter(asset => !/\.map$/.test(asset))
				.map(fullPath => {
					const name = path.basename(fullPath);
					const file = fs.readFileSync(fullPath, 'utf8');
					const hash = crypto.createHash('sha1').update(file).digest('hex');
					const hashedName = `${hash.substring(0, 8)}/${name}`;

					return { name, hashedName };
				})
				.reduce((previous, current) => {
					previous[current.name] = current.hashedName;
					previous[current.name + '.map'] = current.hashedName + '.map';
					return previous;
				}, {});

			fs.writeFileSync('./public/asset-hashes.json', JSON.stringify(hashable, undefined, 2), { encoding: 'UTF8' });
		});
	};
}

/**
 * NOTE: need to use `require.resolve` due to a bug in babel that breaks when linking modules
 */
module.exports = {
	devtool: 'source-map',
	entry: config.assets.entry,
	output: { filename: '[name]' },
	module: {
		loaders: [
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract(
					process.argv.indexOf('--dev') === -1
						? [ 'css?minimize&-autoprefixer&sourceMap', 'postcss', 'sass' ]
						: [ 'css?sourceMap', 'postcss', 'sass' ]
				)
			}
		]
	},
	sassLoader: {
		sourcemap: true,
		// NOTE: This line is important for preservation of comments needed by the css-extract-block plugin
		outputStyle: 'expanded'
	},
	postcss: () => {
		return [ autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'ie >= 8', 'ff ESR', 'bb >= 7'] }) ];
	},
	plugins: (() => {
		const plugins = [
			new ExtractTextPlugin('[name]'),
			new ExtractCssBlockPlugin({ match: /main\.css$/ })
		];

		if (process.argv.indexOf('--dev') === -1) {
			plugins.push(new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': '"production"' } }));
			plugins.push(new webpack.optimize.UglifyJsPlugin({ 'compress': { 'warnings': false } }));
			plugins.push(new AssetHashesPlugin());
		}

		return plugins;
	})(),
	resolve: {
		root: [
			path.resolve('./node_modules')
		]
	}
};

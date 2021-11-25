import { join, resolve } from 'path';
import { env } from 'process';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ReactRefreshTypescript from 'react-refresh-typescript';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
// import { platformCfg } from './config.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const smp = new SpeedMeasurePlugin();

dotenv.config();

const runInMode = env.NODE_ENV;

console.log(runInMode);

// + 10s per build / re-build
const analyzeBundle = false;

const root = join(__dirname, '../');
const app = join(root, 'src/index');
const wire = join(root, 'wireWebapp');
const wireScripts = join(wire, 'src/script');

// TODO : Figure out where the version is coming from.
const config = { version: 'todo' };

console.log('ROOT', root);

if (runInMode !== 'development')
	throw new Error(`BAD ENVIRONMENT, EXPECTED TO RUN IN DEV MODE GOT ${runInMode}`);

export default {
	entry: { app },
	output: {
		path: join(root, 'dist'),
		publicPath: '/',
		filename: 'public/js/[name].bundle.js',
	},
	devtool: 'eval-source-map',
	devServer: {
		devMiddleware: {
			writeToDisk: true,
		},
		allowedHosts: ['0.0.0.0'],
		https: true,
		hot: true,
		historyApiFallback: true,
		compress: true,
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/,
				include: [/src/, /Forms/],
				exclude: [/node_modules/, /cypress/, /server/],
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/preset-env',
								[
									'@babel/preset-react',
									{
										runtime: 'automatic',
									},
								],
								'@emotion/babel-preset-css-prop',
							],
							plugins: ['@babel/plugin-transform-runtime'],
							compact: false,
							cacheDirectory: true,
							cacheCompression: false,
							sourceMaps: true,
							inputSourceMap: true,
						},
					},
					{
						loader: 'ts-loader',
						options: {
							getCustomTransformers: () => ({
								before: [ReactRefreshTypescript()],
							}),
							transpileOnly: true,
							compilerOptions: {
								sourceMap: true,
								module: 'esnext',
								target: 'esnext',
								lib: ['esnext', 'dom', 'dom.iterable'],
								allowSyntheticDefaultImports: true,
								jsx: 'react-jsxdev',
								allowJs: false,
								baseUrl: './',
								esModuleInterop: false,
								resolveJsonModule: true,
								moduleResolution: 'node',
								downlevelIteration: true,
								jsxImportSource: '@emotion/react',
								types: ['node', '@emotion/react/types/css-prop'],
								skipLibCheck: true,
								forceConsistentCasingInFileNames: true,
								strict: true,
								strictNullChecks: true,
								noEmit: false,
								typeRoots: ['@types'],
								removeComments: true,
								useDefineForClassFields: true,
								alwaysStrict: true,
								isolatedModules: true,
								noUncheckedIndexedAccess: true,
							},
						},
					},
				],
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
				generator: {
					filename: 'public/css/[name][ext]',
				},
			},
			{
				// eslint-disable-next-line security/detect-unsafe-regex
				test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
				type: 'asset/resource',
				generator: {
					filename: 'public/fonts/[name][ext]',
				},
			},
			{
				test: /\.(jpg|jpeg|png|webp)?$/,
				type: 'asset',
				generator: { filename: 'public/images/[name][ext]' },
			},
			{
				test: /\.gif?$/,
				type: 'asset',
				generator: { filename: 'public/gif/[name][ext]' },
			},
			{
				test: /\.m4v?$/,
				type: 'asset',
				generator: { filename: 'public/video/[name][ext]' },
			},
			{
				test: /\.pdf$/,
				type: 'asset',
				generator: { filename: 'public/pdf/[name][ext]' },
			},

			{
				test: /\.svg$/,
				use: [
					'babel-loader',
					{
						loader: 'react-svg-loader',
						options: {
							svgo: {
								plugins: [{ removeDimensions: true, removeViewBox: false }],
								floatPrecision: 2,
							},
						},
					},
				],
			},
		],
	},
	externals: {
		'fs-extra': '{}',
		worker_threads: '{}',
	},
	resolve: {
		modules: ['node_modules', 'src'],
		extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '...'],
		// ** wire START **
		alias: {
			Components: join(wireScripts, 'components'),
			Util: join(wireScripts, 'util'),
			I18n: join(wire, 'src/i18n'),
			Resource: join(wire, 'resource'),
			react: join(root, 'node_modules/react'),
			'react-dom': join(root, 'node_modules/react-dom'),
			'@types/react-router-dom': join(root, 'node_modules/@types/react-router-dom'),
			'react-router-dom': join(root, 'node_modules/react-router-dom'),
			'ts-node': join(root, 'node_modules/ts-node'),
			'@babel/core': join(root, 'node_modules/@babel/core'),
			'@babel/preset-env': join(root, 'node_modules/@babel/preset-env'),
			'@babel/preset-react': join(root, 'node_modules/@babel/preset-react'),
			'@emotion/babel-preset-css-prop': join(
				root,
				'node_modules/@emotion/babel-preset-css-prop'
			),
			'@types/react': join(root, 'node_modules/@types/react'),
			'@types/react-dom': join(root, 'node_modules/@types/react-dom'),
			'@typescript-eslint/eslint-plugin': join(
				root,
				'node_modules/@typescript-eslint/eslint-plugin'
			),
			'@typescript-eslint/parser': join(root, 'node_modules/@typescript-eslint/parser'),
			'babel-loader': join(root, 'node_modules/babel-loader'),
			dotenv: join(root, 'node_modules/dotenv'),
			eslint: join(root, 'node_modules/eslint'),
			'eslint-plugin-react': join(root, 'node_modules/eslint-plugin-react'),
			'eslint-plugin-react-hooks': join(root, 'node_modules/eslint-plugin-react-hooks'),
			typescript: join(root, 'node_modules/typescript'),
			webpack: join(root, 'node_modules/webpack'),
			'webpack-cli': join(root, 'node_modules/webpack-cli'),
			'react-feather': join(root, 'node_modules/react-feather'),
		},
		fallback: {
			crypto: false,
			fs: false,
			os: join(wire, 'node_modules/os-browserify/main.js'),
			path: join(wire, 'node_modules/path-browserify/index.js'),
			stream: join(wire, 'node_modules/stream-browserify/index.js'),
			constants: join(wire, 'node_modules/constants-browserify/constants.json'),
		},
		// ** wire END **
	},
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
		},
	},
	plugins: [
		new ReactRefreshWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: join(root, 'src/index.html'),
			filename: 'index.html',
			//source: `https://localhost:8081/config.js?${config.version}`,
			chunksSortMode: 'manual',
			chunks: ['platformConfig', 'app'],
		}),
		new CleanWebpackPlugin(),
		analyzeBundle && new BundleAnalyzerPlugin(),
		/* new webpack.DefinePlugin(
			Object.entries(platformCfg).reduce((acc, [key, val]) => {
				acc[String(key)] = JSON.stringify(val);
				return acc;
			}, {})
		), */
	].filter(Boolean),
};

const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        background: path.join(__dirname, 'src/ts/background.js'),
        index: path.join(__dirname, 'src/ts/index.ts'),
        options: path.join(__dirname, 'src/ts/options.ts'),
        ui: path.join(__dirname, 'src/ts/ui.ts'),
        vendor: ['moment', 'jquery', 'brace']
    },
    output: {
        path: path.join(__dirname, 'dist/js'),
        filename: '[name].js'
    },
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                exclude: /node_modules/,
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            {
                test: /\.jpe?g$|\.gif$|\.png$|\.ttf$|\.eot$|\.svg$/,
                use: 'file-loader?name=[name].[ext]?[hash]'
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000&mimetype=application/fontwoff'
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        // exclude locale files in moment
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new CopyPlugin([
            {
                from: 'src/manifest.json',
                to: path.resolve('dist')
            },
            {
                from: 'src/pages',
                to: path.resolve('dist/pages')
            },
            {
                from: 'src/ts/util',
                to: path.resolve('dist/js/util')
            },
            {
                from: 'node_modules/jq-web/jq.wasm.wasm',
                to: path.resolve('dist/')
            },
            {
                from: 'src/css/',
                to: path.resolve('dist/css')
            }
        ])

        // minify
        // new webpack.optimize.UglifyJsPlugin()
    ]
};

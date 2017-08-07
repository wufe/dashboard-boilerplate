const externals = require('webpack-node-externals');
const { resolve } = require('path');
const { optimize, DefinePlugin, HashedModuleIdsPlugin } = require('webpack');

const production = process.env.NODE_ENV == 'production';

const commonsChunkPlugin = new optimize.CommonsChunkPlugin({
    names: ['vendor', 'manifest']
});

const hashedModuleIdsPlugin = new HashedModuleIdsPlugin();

const plugins = production ? [
    new optimize.OccurrenceOrderPlugin(),
    new optimize.UglifyJsPlugin({
        debug: false,
        minimize: true,
        sourceMap: false,
        output: {
            comments: false
        },
        compressor: {
            warnings: false
        },
        mangle: true,
        beautify: true
    }),
    new DefinePlugin({ "global.GENTLY": false })
] : [
    new DefinePlugin({ "global.GENTLY": false })
];

module.exports = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: [
            './src',
            './node_modules'
        ]
    },

    devtool: 'source-map',

    entry: {
        server: './src/server/index.ts'
    },

    output: {
        filename: production ? '[name].[chunkhash:8].js' : '[name].js',
        path: resolve(__dirname, production ? 'dist' : 'build')
    },

    node: {
        __dirname: true,
        __filename: false
    },

    module: {
        loaders: [{
            test: /\.tsx?$/,
            exclude: /node_modules/i,
            use: ['ts-loader']
        }, {
            enforce: 'pre',
            test: /\.js$/,
            exclude: /node_modules/i,
            use: ['source-map-loader']
        }]
    },

    target: 'node',

    externals: [externals()],

    plugins
};
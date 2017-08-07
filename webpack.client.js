const { resolve, join } = require('path');
const { optimize, DefinePlugin, HashedModuleIdsPlugin, ProvidePlugin } = require('webpack');

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
    new DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    }),
    commonsChunkPlugin,
    hashedModuleIdsPlugin
] : [
    commonsChunkPlugin,
    hashedModuleIdsPlugin
];

module.exports = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: [
            './src',
            './node_modules'
        ]
    },

    devtool: 'eval',

    entry: {
        frontend: production ? [
            './src/frontend/index.tsx'
        ] : [
            'react-hot-loader/patch',
            './src/frontend/index.tsx'
        ],
        vendor: ['react', 'react-dom', 'redux', 'react-redux', 'react-icons/md', 'react-icons/fa', 'redux-saga', 'react-router', 'react-router-redux', 'reselect'],
        dev_vendor: ['redux-logger', 'redux-immutable-state-invariant', 'redux-devtools-extension']
    },

    output: {
        publicPath: '/build/static',
        filename: production ? '[name].[chunkhash:8].js' : '[name].js',
        path: join(resolve(__dirname, production ? 'dist' : 'build'), 'static')
    },

    node: {
        __dirname: false,
        __filename: false
    },

    module: {
        loaders: [{
                test: /react-icons\/(.)*(.js)$/,
                loader: 'babel-loader',
                include: [
                    resolve(__dirname, './node_modules/react-icons/md'),
                    resolve(__dirname, './node_modules/react-icons/fa')
                ],
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react'],
                    plugins: ['transform-export-extensions']
                }
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/i,
                use: ['react-hot-loader/webpack', 'ts-loader']
            },
            {
                test: /\.scss$/i,
                exclude: /node_modules/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },

    target: 'web',

    plugins
};
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const EventHooksPlugin = require('event-hooks-webpack-plugin');
const { CallbackTask } = require('event-hooks-webpack-plugin/lib/tasks');
//const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const fs = require('fs'); 
const path = require('path');
const webpack = require('webpack');

function isProduction(env) {
    return typeof env != 'undefined' && env.production;
}
const babel = {
    loader: 'babel-loader',
    options: {
        presets: ['@babel/preset-react'],
        plugins: [ '@babel/plugin-transform-regenerator', '@babel/plugin-transform-async-to-generator', '@babel/plugin-proposal-optional-chaining', '@babel/plugin-proposal-nullish-coalescing-operator', '@babel/plugin-transform-arrow-functions', "@babel/plugin-transform-classes", '@babel/plugin-transform-block-scoping', '@babel/plugin-transform-parameters', '@babel/plugin-transform-destructuring', '@babel/plugin-transform-shorthand-properties', '@babel/plugin-transform-template-literals' ]
    }
};

module.exports = env => { return {
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components|phaser\.min\.js)/,
                use: [
                    babel
                ]
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: { allowTsInNodeModules: true, transpileOnly: true }
                    }
                ],
            }
        ]
    },
    resolve: {
        extensions: [ '.js', '.jsx', '.ts', '.tsx' ],
        alias: {
            'material-ui': 'material-ui/es',
        },
        modules: [path.resolve(__dirname, 'modules'), 'node_modules']
    },
    entry: path.resolve(__dirname, 'src', 'script.tsx'),
    mode: isProduction(env) ? 'production' : 'development',
    output: {
        filename: 'core_script_compiled.js',
        path: __dirname,
        pathinfo: false
    },
    devtool: isProduction(env) ? false : 'source-map',
    optimization: {
        usedExports: true,
        concatenateModules: isProduction(env),
        removeAvailableModules: isProduction(env),
        removeEmptyChunks: isProduction(env),
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            automaticNameMaxLength: 30,
            name: true,
            cacheGroups: {
              vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10
              },
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
              }
            }
        }
    },
    externals: {
        "react-cache": 'ReactCache',
        'babylonjs': 'BABYLON'
    },
    plugins: [
        //new ForkTsCheckerWebpackPlugin(),
        //new BundleAnalyzerPlugin(), 
        new webpack.ProvidePlugin({
            'React':     'react',
            'Phaser': "./phaser.min.js"
        }),
        new EventHooksPlugin({
            done: new CallbackTask((compiler, callback) => {
                const filename = 'built.txt';
                fs.closeSync(fs.openSync(filename, 'w'))
                callback();
            })
        })
    ]
}};
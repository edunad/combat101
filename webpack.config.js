
const path = require('path');
const glob = require("glob");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');

const webpack = require('webpack');
const production = process.env.NODE_ENV != null && process.env.NODE_ENV.trim() === 'production';

if(production) {
    console.warn('=================================');
    console.warn('======== PRODUCTION MODE ========');
    console.warn('=================================');
}

let config = {
    mode: production ? 'production' : 'development',

    devtool: 'source-map',
    entry: ['./src/index.tsx'],

    output: {
        path: path.resolve(__dirname, './docs'),
        filename: '[name].js'
    },

    performance: {
        hints: false
    },

    resolve: {
        extensions: ['.js', '.css', '.ts', '.tsx', '.sass', '.scss'],
        modules: ['node_modules']
    },

    devServer: {
        historyApiFallback: true,
        port: 1337
    },

    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },

    module: {
        rules: [
            {
                test: /\.(html|htm)?$/,
                loader: 'file-loader',
                options: {
                    name: './[name].[ext]'
                }
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },

            {
                test: /\.(woff2?|ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]?[hash]'
                }
            },

            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { url: false } }
                ]
            },

            {
                test: /\.(scss|sass)/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1, url: false } }, // translates CSS into CommonJS
                    { loader: 'sass-loader', options: { sourceMap: true } }
                ]
            },

            {
                test: /\.ts(x?)$/,
                exclude: [/\.(spec|e2e)\.ts(x?)$/],
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: './styles.css',
            chunkFilename: './styles.css'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', {}],
            },
            canPrint: true
        }),
        new CopyPlugin([
            { from: './src/assets', to: './assets' }
        ]),
    ]
};

function findPlugins(callback) {
    glob(path.resolve(__dirname, './src/plugins/') + '/*.ts', function (er, files) {
        let locations = [];
        files.forEach((file) => {
            let pth = file.split('src/');
            locations.push('./' + file.replace(pth[0], '')); // Fix the path for webpack and injected
        });

        return callback(locations);
    });
}

module.exports = new Promise(function (resolve, reject) {
    findPlugins((locations) => {
        console.warn(`==== PLUGINS FOUND :`);
        console.warn(locations);
        console.warn(`============= ======`)

        config.plugins.push(
            new webpack.DefinePlugin({
                '__PLUGINS__': JSON.stringify(locations),
                '__PRODUCTION__': production
            })
        );

        if(production){
            config.plugins.push(new RemovePlugin({
                before: {
                    include: [
                        './docs'
                    ]
                },
                watch: {
                    include: [
                        './docs'
                    ]
                }
            }));
        }

        return resolve(config);
    });
});
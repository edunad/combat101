
const path = require('path');
const glob = require("glob");

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');

const webpack = require('webpack');

let config = {
    devtool: 'source-map',
    entry: ['./src/index.tsx'],

    output: {
        path: path.resolve(__dirname, './docs'),
        filename: '[name][contenthash].js'
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
            /*{
                test: /\.(html|htm)?$/,
                loader: 'file-loader',
                options: {
                    name: './[name].[ext]'
                }
            },*/
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
            filename: './styles[contenthash].css',
            chunkFilename: './styles[contenthash].css'
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
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
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

module.exports = (env, argv) => {
    const production = argv.mode === 'production';

    if(production) {
        console.warn("\n  ,-.       _,---._ __  / \\");
        console.warn(" /  )    .-'       `./ /   \\");
        console.warn("(  (   ,'            `/    /|");
        console.warn(" \  `-'             \\'\\   / |");
        console.warn("  `.              ,  \\ \\ /  |");
        console.warn("   /`.          ,'-`----Y   |");
        console.warn("  (            ;        |   '");
        console.warn("  |  ,-.    ,-'         |  /");
        console.warn("  |  | (   | PRODUCTION | /");
        console.warn("  )  |  \  `.___MODE____|/");
        console.warn("  `--'   `--'\n");
    }

    return new Promise(function (resolve, reject) {
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
};
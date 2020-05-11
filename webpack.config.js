const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: ['./src/css/index.scss','./src/index.tsx'],

    output: {
        path: path.resolve(__dirname, './docs'),
        filename: '[name].js'
    },

    performance: {
        hints: false
    },

    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.css', '.sass', '.scss'],
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
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },

            {
                test: /\.(scss|sass)/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } }, // translates CSS into CommonJS
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
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.ProvidePlugin({
            'React': 'react',
            'ReactDOM': 'react-dom',
        }),
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
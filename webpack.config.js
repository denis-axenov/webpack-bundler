const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const config = {
    target: "web",
    entry: [
        "./src/js/index.js",
        "./src/scss/style.scss"
    ],
    output: {
        pathinfo: false,
        filename: 'js/bundle.js',
        path: path.resolve(__dirname, 'dist'),
        hotUpdateChunkFilename: 'tmp/hot-update.js',
        hotUpdateMainFilename: 'tmp/hot-update.json'
    },
    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '..'
                        }
                    }, {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    'autoprefixer',
                                    'cssnano',
                                    'postcss-preset-env'
                                ]
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass')
                        },
                    }
                ],
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/i,
                exclude: [/img/],
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                exclude: [/fonts/],
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'img/'
                        },
                    },
                ],
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/style.css'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html'
        })
    ],
    optimization: {
        minimize: false,
        minimizer: [
            new TerserPlugin()
        ],
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        liveReload: true,
        compress: true,
        open: true,
        watchContentBase: true,
        writeToDisk: true,
        hot: true,
        inline: true,
        port: 9000
    },
    stats: {
        entrypoints: false,
        children: false,
        performance: false,
        assets: false,
        chunks: false,
        hash: false,
        modules: false,
    }
};

module.exports = (env, argv) => {
    if (argv.mode === "production") {
        config.plugins.push(
            new CleanWebpackPlugin()
        );
        config.optimization['minimize'] = true;
    } else {
        config.plugins.push(
            new webpack.HotModuleReplacementPlugin()
        );
    }

    return config;
};
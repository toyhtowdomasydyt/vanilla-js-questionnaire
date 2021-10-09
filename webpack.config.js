const path = require("path");

// Plugins
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { HotModuleReplacementPlugin } = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const CSSMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const filename = ext => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const optimize = () => {
    const configObj = {
        splitChunks: {
            chunks: "all"
        }
    };

    if (isProd) {
        configObj.minimizer = [
            new CSSMinimizerPlugin(),
            new TerserWebpackPlugin({
                parallel: true,
            }),
        ];
    }

    return configObj;
};

const getPlugins = () => {
    return [
        new CleanWebpackPlugin,
        new HotModuleReplacementPlugin(),
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, "./src/index.html"),
            filename: "index.html",
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new MiniCSSExtractPlugin({
            filename: `styles/${filename('css')}`,
        }),
    ];
};


module.exports = {
    mode: "development",

    entry: {
        main: path.resolve(__dirname, "./src/js/index.js")
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: `js/${filename('js')}`,
    },

    devtool: isProd ? false : "source-map",
    optimization: optimize(),

    plugins: getPlugins(),

    module: {
        rules: [
            // JavaScript
            {
                test: /\.js$/,
                exclude: /node_modules/,
            },
            // HTML
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            // CSS, SCSS, PostCSS
            {
                test: /\.(s[ac]|c)ss$/i,
                use: [
                    MiniCSSExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ]
            },
            // Images
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: "asset/resource",
                generator: {
                    filename: "img/[name].[hash][ext]"
                }
            },
            // Fonts
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: "fonts/[name].[hash][ext]"
                }
            }
        ]
    },

    devServer: {
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        open: "google-chrome-stable",
        hot: true,
        port: 8080,
    },
}

var path = require('path');
var webpack = require('webpack');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// var CompressionPlugin = require("compression-webpack-plugin");

// https://hackernoon.com/optimising-your-application-bundle-size-with-webpack-e85b00bab579
module.exports = {
    entry: {
        index:'./webpage/index/index.jsx',
        song: './webpage/song/index.jsx',
        submit: './webpage/submit/index.jsx',
        about: './webpage/about/index.jsx'
    },
    output: {path: __dirname + '/dist', filename: '[name].bundle.js', pathinfo: true},
    watch: true,
    // devtool: 'cheap-source-map', // https://webpack.github.io/docs/configuration.html#devtool
    devtool: "eval",
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node-modules/,
                query: {
                    presets: ['env', 'react']
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            "React": "react",
        })
        // ,
        // new BundleAnalyzerPlugin()
    //     ,
    //     new webpack.optimize.DedupePlugin(),
    //     new webpack.optimize.UglifyJsPlugin({
    //           mangle: true,
    //           compress: {
    //             warnings: false, // Suppress uglification warnings
    //             pure_getters: true,
    //             unsafe: true,
    //             unsafe_comps: true,
    //             screw_ie8: true
    //           },
    //           output: {
    //             comments: false,
    //           },
    //           exclude: [/\.min\.js$/gi] // skip pre-minified libs
    //         }), 
    //     new CompressionPlugin({
    //   asset: "[path].gz[query]",
    //   algorithm: "gzip",
    //   test: /\.js$|\.css$|\.html$/,
    //   threshold: 10240,
    //   minRatio: 0
    // })

    ],
};
var path = require('path');
var webpack = require('webpack');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// var CompressionPlugin = require("compression-webpack-plugin");

// const ExtractTextPlugin = require("extract-text-webpack-plugin");
// var HtmlWebpackPlugin = require('html-webpack-plugin');

// https://hackernoon.com/optimising-your-application-bundle-size-with-webpack-e85b00bab579
module.exports = {
    entry: {
        index:'./webpage/index/index.jsx',
        song: './webpage/song/index.jsx',
        submit: './webpage/submit/index.jsx',
        about: './webpage/about/index.jsx',
        timepicker: './webpage/timepicker/index.jsx'
    },
    output: {
    	path: __dirname + '/dist',
    	filename: '[name].bundle.js',
    	pathinfo: true
    },
    watch: true,
    devtool: "eval",
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use:[{
                	loader:'babel-loader',
	                query: {
	                    presets: ['env', 'react']
	                }
                }],
				exclude: /node-modules/
             
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
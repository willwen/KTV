var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {index:'./webpage/index/index.jsx', song: './webpage/song/index.jsx'},
    output: {path: __dirname + '/dist', filename: '[name].bundle.js', pathinfo: true},
    watch: true,
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node-modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            "React": "react",
        }),
    ],
};
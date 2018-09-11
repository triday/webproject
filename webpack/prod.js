const webpack = require('webpack');
const merge = require('webpack-merge');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./base.js');

module.exports = merge(common, {
    mode: "production",
    devtool: 'inline-source-map',
    plugins: [
        new webpack.BannerPlugin('hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]'),
        new UglifyJSPlugin({
            sourceMap: true
        })
    ]
});
const merge = require('webpack-merge');
const common = require('./base.js');

module.exports = merge(common, {
    mode: "development",
    devtool: 'inline-source-map',
    devServer: {
        contentBase: common.output.path,
        host: '127.0.0.1',
        compress: false,
        port: 8080
    }
});
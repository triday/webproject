const gulp = require('gulp');
const path = require('path');

const PluginError = require('plugin-error');
const log = require('fancy-log');
const clean = require('gulp-clean')
const zip = require('gulp-zip');
const ftp=require('gulp-ftp');
var sequence = require('gulp-sequence')
const webpack = require('webpack');
const deploy_dir_name = 'deploy';
var package = require('../package.json')
var webpackConfDev = require('../webpack/dev.js');
var webpackConfProd = require('../webpack/prod.js');


gulp.task('pack-dev', (done) => {
    return webpack(webpackConfDev, function (err, stats) {
        if (err) throw new PluginError('webpack', err);
        log('[webpack]', stats.toString({ colors: true }));
        done();
    });
});
gulp.task('pack-prod', (done) => {
    return webpack(webpackConfProd, function (err, stats) {
        if (err) throw new PluginError('webpack', err);
        log('[webpack]', stats.toString({ colors: true }));
        done();
    });
});
gulp.task('zip-dev', ['pack-dev'], () => {
    const timeStamp=dateFtt('yyMMdd_hhmmss',new Date())
    return gulp.src(path.resolve(webpackConfDev.output.path, '*'))
        .pipe(zip(`${package.name}_SNAPSHOT_${package.version}_${timeStamp}.zip`))
        .pipe(gulp.dest(deploy_dir_name))
});
gulp.task('zip-prod', ['pack-prod'], () => {
    const timeStamp=dateFtt('yyMMdd_hhmmss',new Date())
    return gulp.src(path.resolve(webpackConfProd.output.path, '*'))
        .pipe(zip(`${package.name}_RC${package.version}_${timeStamp}.zip`))
        .pipe(gulp.dest(deploy_dir_name))
});
gulp.task('clean', function () {
    return gulp.src([path.resolve(deploy_dir_name, '*')], { read: false })
        .pipe(clean());
});
gulp.task('ftp',function(){
   return gulp.src(path.resolve(deploy_dir_name, '*.zip'))
    .pipe(ftp({
      host: '127.0.0.1',
      port: 21,
    //   user: 'anonymous',
    //   pass:'@anonymous',
      remotePath: package.name
    }));
});
gulp.task('deploy-dev', (cb) => {
    log('do dev deploy ...');
    return sequence('clean','zip-dev','ftp',cb);
});
gulp.task('deploy-prod', (cb) => {
    log('do prod deploy ...');
    return sequence('clean','zip-prod','ftp',cb);
});

function dateFtt(fmt, date) {
    var o = {
        "M+": date.getMonth() + 1,                 //月份   
        "d+": date.getDate(),                    //日   
        "h+": date.getHours(),                   //小时   
        "m+": date.getMinutes(),                 //分   
        "s+": date.getSeconds(),                 //秒   
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
} 
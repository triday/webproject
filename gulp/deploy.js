const gulp=require('gulp');
const path = require('path');

const PluginError = require('plugin-error');
const log = require('fancy-log');
const clean = require('gulp-clean')
const zip = require('gulp-zip');
const webpack = require('webpack');
const deploy_dir_name='deploy';
var package = require('../package.json')
var webpackConfDev = require('../webpack/dev.js');
var webpackConfProd = require('../webpack/prod.js');


gulp.task('pack-dev',(done)=>{
    webpack(webpackConfDev, function (err, stats) {
        if (err) throw new PluginError('webpack', err);
        log('[webpack]', stats.toString({colors: true}));
        done();
    });
});
gulp.task('pack-prod',(done)=>{
    webpack(webpackConfProd, function (err, stats) {
        if (err) throw new PluginError('webpack', err);
        log('[webpack]', stats.toString({colors: true}));
        done();
    });
});
gulp.task('zip-dev',['pack-dev'],()=>{
    gulp.src(path.resolve(webpackConfDev.output.path ,'*'))
    .pipe(zip(`${package.name}_dev_${package.version}.zip`))
    .pipe(gulp.dest(deploy_dir_name))
});
gulp.task('zip-prod',['pack-prod'],()=>{
    gulp.src(path.resolve(webpackConfProd.output.path ,'*'))
    .pipe(zip(`${package.name}_prod_${package.version}.zip`))
    .pipe(gulp.dest(deploy_dir_name))
});
gulp.task('clean', function() {
    gulp.src([path.resolve(deploy_dir_name ,'*')], {read: false})
        .pipe(clean());
});
gulp.task('deploy-dev',['clean','zip-dev'],()=>{
    log('do dev deploy ...');
});
gulp.task('deploy-prod',['clean', 'zip-prod'],()=>{
    log('do prod deploy ...');
});

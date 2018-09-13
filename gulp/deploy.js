const gulp = require('gulp');



// const log = require('fancy-log');



const sequence = require('gulp-sequence')








gulp.task('deploy-dev', (cb) => {
    return sequence('clean', 'zip-dev', 'ftp', cb);
});
gulp.task('deploy-prod', (cb) => {
    return sequence('clean', 'zip-prod', 'ftp', cb);
});



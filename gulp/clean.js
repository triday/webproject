const gulp = require('gulp');
const path = require('path');
const clean = require('gulp-clean');

gulp.task('clean-deploy', function () {
    return cleanDir('deploy/*');
});
gulp.task('clean-dist', function () {
    return cleanDir('dist/*');
});
function cleanDir(src) {
    return gulp.src([src], { read: false })
        .pipe(clean());
}
var gulp = require('gulp'),
    vulcanize = require('gulp-vulcanize');

gulp.task('default', ['bundle']);

gulp.task('bundle', function () {
    return gulp.src('./public/index.html')
        .pipe(vulcanize({
            dest: './dist',
            strip: true,
            abspath: './public'
        }))
        .pipe(gulp.dest('./dist'));
});

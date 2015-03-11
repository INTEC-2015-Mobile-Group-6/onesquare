var gulp = require('gulp'),
    vulcanize = require('gulp-vulcanize'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');

gulp.task('default', ['bundle']);

gulp.task('bundle', ['optimize-images'], function () {
    return gulp.src('./public/index.html')
        .pipe(vulcanize({
            dest: './dist',
            strip: true,
            abspath: './public',
            inline: true
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('optimize-images', function () {
    return gulp.src('./public/images/*.png')
        .pipe(imagemin({
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./dist/images'));
});

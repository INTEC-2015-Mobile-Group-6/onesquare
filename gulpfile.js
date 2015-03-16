'use strict';

require('dotenv').load();

var pkg = require('./package.json'),
    path = require('path'),
    http = require('http'),
    ecstatic = require('ecstatic');

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    inject = require('gulp-inject'),
    plumber = require('gulp-plumber'),
    pgbuild = require('gulp-phonegap-build'),
    bowerFiles = require('main-bower-files'),
    livereload = require('gulp-livereload');

var dir = {
    out: path.join(__dirname, './out'),
    dist: path.join(__dirname, './dist'),
    assets: path.join(__dirname, './public'),
};

gulp.task('default', ['inject', 'build'], function () {
    gutil.log('Building... This might take a while.');
});

gulp.task('build', function () {
    gulp.src(dir.assets + '/**')
        .pipe(plumber())
        .pipe(pgbuild({
            appId: process.env.PG_BUILD_APP_ID,
            download: {
                android: dir.out + '/onesquare-' + pkg.version + '.apk'
            },
            user: {
                token: process.env.PG_BUILD_AUTH_TOKEN
            }
        }));
});

gulp.task('inject', ['copy'], function () {
    var sources = [
        dir.dist + '/lib/**/*.html'
    ];

    return gulp.src(dir.dist + '/index.html')
        .pipe(inject(gulp.src(sources, {read: false}), {relative: true}))
        .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower', relative: true}))
        .pipe(gulp.dest(dir.dist))
        .pipe(livereload());
});

gulp.task('copy', function () {
    var sources = [
        dir.assets + '/**'
    ];

    return gulp.src(sources)
        .pipe(gulp.dest(dir.dist));
});

gulp.task('watch', function () {
    var sources = [
        dir.assets + '/index.html',
        dir.assets + '/lib/**'
    ];

    livereload.listen();
    
    return gulp.watch(sources, ['inject']);
});

gulp.task('serve', ['inject'], function () {
    var port = process.env.NODE_PORT || 3000;

    http.createServer(
        ecstatic({root: dir.dist})
    ).listen(port);

    gutil.log('Listening at http://localhost:' + port);
});

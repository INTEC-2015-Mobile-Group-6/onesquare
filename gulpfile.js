'use strict';

require('dotenv').load();

var pkg = require('./package.json'),
    path = require('path');

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    inject = require('gulp-inject'),
    plumber = require('gulp-plumber'),
    pgbuild = require('gulp-phonegap-build'),
    bowerFiles = require('main-bower-files');

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

gulp.task('inject', function () {
    var sources = [
        dir.assets + '/lib/**/*.html'
    ];

    return gulp.src(dir.assets + '/index.html')
        .pipe(inject(gulp.src(sources, {read: false}), {addRootSlash: false}))
        .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower', addRootSlash: false}))
        .pipe(gulp.dest(dir.dist));
});

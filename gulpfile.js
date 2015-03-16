'use strict';

require('dotenv').load();

var pkg = require('./package.json'),
    path = require('path');

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    pgbuild = require('gulp-phonegap-build');

var dir = {
    out: path.join(__dirname, './out'),
    dist: path.join(__dirname, './dist'),
    assets: path.join(__dirname, './public'),
};


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

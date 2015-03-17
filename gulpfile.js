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
    livereload = require('gulp-livereload'),
    vulcanize = require('gulp-vulcanize'),
    bowerinstall = require('gulp-bower'),
    del = require('del');

var dir = {
    out: path.join(__dirname, './out'),
    dist: path.join(__dirname, './dist'),
    assets: path.join(__dirname, './public'),
};

gulp.task('default', ['build'], function () {});

gulp.task('build', ['strip-bundle'],  function () {
    gulp.src(dir.dist + '/*')
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
    
    gutil.log('APK will be at', gutil.colors.cyan(dir.out), 'directory.');
});

gulp.task('inject', ['setup'], function () {
    var sources = [
        dir.dist + '/lib/**/*.html'
    ];

    return gulp.src(dir.dist + '/index.html')
        .pipe(plumber())
        .pipe(inject(gulp.src(sources, {read: false}), {relative: true}))
        .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower', relative: true}))
        .pipe(gulp.dest(dir.dist))
        .pipe(livereload());
});

gulp.task('setup', ['install-deps'], function () {
    var sources = [
        dir.assets + '/**'
    ];

    return gulp.src(sources)
        .pipe(plumber())
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

gulp.task('bundle', ['inject'], function () {
    return gulp.src(dir.dist + '/index.html')
        .pipe(plumber())
        .pipe(vulcanize({
            strip: true,
            inline: true,
            dest: dir.dist
        }))
        .pipe(gulp.dest(dir.dist));
});

gulp.task('install-deps', function () {
    return bowerinstall();
});

gulp.task('strip-bundle', ['bundle'], function () {
    del.sync(dir.dist + '/bower_components');
});

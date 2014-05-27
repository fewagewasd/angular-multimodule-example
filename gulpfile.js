'use strict';

var gulp = require('gulp'),
    bower = require('gulp-bower'),
    gutil = require('gulp-util'),
    debug = require('gulp-debug'),
    gulpif = require('gulp-if'),
    ngmin = require('gulp-ngmin'),
    newer = require('gulp-newer'),
    ngHtml2js = require('gulp-ng-html2js'),
    minifyhtml = require('gulp-htmlmin'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    karma = require('gulp-karma'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    livereload = require('gulp-livereload'),
    cssmin = require('gulp-cssmin');

var lazypipe = require('lazypipe');
var path = require('path');
var fs = require('fs');
var es = require('event-stream');
var lodash_template = require('lodash.template');
var connect = require('connect');
var connect_livereload = require('connect-livereload');
var proxy_middleware = require('proxy-middleware');

var config = {
    paths: {
        // configurable paths
        app: 'angular-multimodule-server/src/main/webapp',
        test: 'src/test/javascript',
        dist: 'angular-multimodule-server/build/web'
    },
    ports: {
        proxy: 9000,
        app: 8080
    },
    jshint: {
        jshintrc: '.jshintrc',
        reporter: 'jshint-stylish'
    }
};


var uiModules;

function template(templateString) {
    var compiled =  lodash_template(templateString, config.paths);
    return compiled;
}

function getUiModules() {
    if (!uiModules) {
        uiModules = fs.readdirSync('./')
            .filter(function (file) {
                return fs.statSync(file).isDirectory() && file.match('^angular-multimodule-.*-ui$');
            });
    }
    return uiModules;
}

function multiModuleTask(globs, globOpts, cb) {
    if (typeof globOpts === 'function') {
        cb = globOpts;
        globOpts = null;
    }

    globOpts = globOpts || {};
    var cwd = globOpts.cwd;


    var tasks = getUiModules().map(function (module) {
        globOpts.module = module;
        globOpts.cwd = lodash_template(cwd || '<%= module %>', globOpts);
        var moduleGlobs = globs.map(function (glob) {
            return lodash_template(glob, globOpts);
        });
        return cb(gulp.src(moduleGlobs, globOpts), module);
    });

    return es.concat.apply(null, tasks);
}

var proxy = function (staticDir, next) {
    connect()
        .use(connect_livereload())
        .use(connect.static(staticDir))
        .use('/api', proxy_middleware({
            pathname: '/api',
            host: 'localhost',
            port: config.ports.app,
            https: false,
            changeOrigin: false
        }))
        .use('/auth', proxy_middleware({
            pathname: '/auth',
            host: 'localhost',
            port: config.ports.app,
            https: false,
            changeOrigin: false
        }))
        .listen(config.ports.proxy, next);
};

gulp.task('proxy', function (next) {
    proxy(config.paths.app, next);
});

gulp.task('proxy_production', function (next) {
    proxy(config.paths.dist, next);
});

var watchLog = function (event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
};

gulp.task('serve', ['test', 'proxy'], function () {
    getUiModules().forEach(function (module) {
        console.log('Watching ' + module + '/src/main/**/*');
        gulp.watch(module + '/src/main/**/*', ['test'])
            .on('change', watchLog);
    });

    console.log('Watching ' + 'src/main/webapp/**/*.less');
    gulp.watch('src/main/webapp/**/*.less', ['lessToCss'])
        .on('change', watchLog);

    var server = livereload();
    gulp.watch([config.paths.app + '/**', config.paths.app + '/**/*.less'])
        .on('change', function (file) {
            console.log('File ' + file.path + ' changed, reloading browser...');
            server.changed(file.path);
        });
});

gulp.task('bower_install', function () {
    return bower().pipe(gulp.dest(template('<%= app %>/lib')));
});

gulp.task('default', ['build_development']);

gulp.task('build_production', ['test_production', 'lessToCss']);

gulp.task('build_development', ['test', 'lessToCss']);

// some code to fix console output problem<s under windows
var log = console.log;
console.log = function(){
    var args = arguments;
    if (args.hasOwnProperty('0')) {
        args['0'] = '\r'+args['0'];
    }
    log(Object.keys(args).map(function(key) {return args[key];}).join(' '));
};

var testTask = function () {
    var cwd_tempalte = './<%= module %>/src/test/javascript';
    return multiModuleTask(['unused'], {cwd: cwd_tempalte}, function (src, module) {
        var configFilePath = lodash_template(cwd_tempalte, {module: module}) + '/karma.conf.js';
        return src
            .pipe(karma({configFile: configFilePath, action: 'run'}))
            .on('error', function (err) {
                console.log('ERROR: ' + err);
                throw err;
            });
    });
};

gulp.task('test', ['angular'], testTask);
gulp.task('test_production', ['angular_production'], testTask);

gulp.task('lessToCss', function () {
    var dest = template('<%= app %>/styles/generated');
    return gulp.src([template('<%= app %>/styles/*.less')])
        .pipe(newer(dest))
        .pipe(less({sourceMap: true}))
        .pipe(gulp.dest(dest));
});

gulp.task('angular', ['angular-js', 'angular-templates']);
gulp.task('angular_production', ['angular', 'lessToCss', 'copyStatic', 'copySelect2Images'], function () {
    gulp.src(template('<%= app %>/index.html'))
        .pipe(usemin({
            js: [ngmin(), uglify({outSourceMap: true}), rev()],
            css: [rev()]
        }))
        .pipe(gulp.dest('build/web'));
});

gulp.task('copySelect2Images', function () {
    return gulp.src([template('<%= app %>/bower_components/select2/*.{png,gif}')])
        .pipe(gulp.dest(config.paths.dist + '/styles'));
});

gulp.task('copyStatic', function () {
    return gulp.src([template('<%= app %>/{fonts,views}/**/*')])
        .pipe(gulp.dest(config.paths.dist));
});

var bannerPipe = lazypipe()
    .pipe(header, '(function(window, document, undefined) {\n\'use strict\';\n')
    .pipe(footer, '\n})(window, document);\n');

gulp.task('angular-js', function () {
    return multiModuleTask(['<%= module %>/src/main/**/*.js'], function (src, module) {
        var dest = template('<%= app %>/scripts/modules');
        return src
            .pipe(debug())
            .pipe(jshint(config.jshint.jshintrc))
            .pipe(jshint.reporter(config.jshint.reporter))
            .pipe(newer(dest + '/' + module + '.js'))
            .pipe(concat(module + '.js'))
            .pipe(replace('\'use strict\';', ''))
            .pipe(bannerPipe())
            .pipe(gulp.dest(dest));
    });
});

gulp.task('clean_modules', function () {
    return multiModuleTask(['./<%= module %>/target/generated/javascript'], function (src, module) {
        return src.pipe(clean());
    });
});

gulp.task('clean', ['clean_modules'], function () {
    return gulp.src([template('<%= app %>/scripts/modules'),template('<%= dist %>'), template('<%= app %>/styles/generated')])
        .pipe(clean());
});

gulp.task('angular-templates', function () {
    return multiModuleTask(['./<%= module %>/src/main/**/*.html'], function (src, module) {
        var angularModuleName = 'multimodule.example.'+module.split('-')[2];
        var dest = './' + module + '/target/generated/javascript/scripts/modules';
        return src
            .pipe(newer(template('<%= app %>/scripts/modules/' + module + '.tpl.js')))
            .pipe(minifyhtml())
            .pipe(ngHtml2js({moduleName: angularModuleName, stripPrefix: 'javascript/'}))
            .pipe(concat(module + '.tpl.js'))
            .pipe(bannerPipe())
            .pipe(gulp.dest(template('<%= app %>/scripts/modules')))
            .pipe(gulp.dest(dest));
    });
});
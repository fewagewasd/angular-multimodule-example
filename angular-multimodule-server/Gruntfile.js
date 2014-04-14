// Generated on 2014-03-06 using generator-angular 0.7.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var globalConfig = {};
var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-connect-proxy');
    require('../grunt-tasks.js')(grunt);

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);


    // Define the configuration for all the tasks
    grunt.initConfig({
        globalConfig: globalConfig,
        // Project settings
        app: {
            // configurable paths
            app: 'src/main/webapp',
            test: 'src/test/javascript',
            dist: 'build/web'
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            files: {
                files: ['../angular-multimodule-*-ui/src/main/javascript/**/*.{js,html}'],
                tasks: ['refresh-modules']
            },
            js: {
                files: ['<%= app.app %>/scripts/{,*/}*.js'],
//                tasks: ['newer:jshint:all'],
                options: {
                    livereload: true
                }
            },
            styles: {
                files: ['<%= app.app %>/styles/{,*/}*.css', '<%= app.app %>/styles/{,*/}*.less'],
                tasks: ['less:dev', 'newer:copy:styles', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= app.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= app.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            proxies: [
                {
                    context: '/api',
                    host: 'localhost',
                    port: 8080,
                    https: false,
                    changeOrigin: false
                },
                {
                    context: '/auth',
                    host: 'localhost',
                    port: 8080,
                    https: false,
                    changeOrigin: false
                }
            ],
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= app.app %>'
                    ],
                    middleware: function (connect) {
                        return [
                            proxySnippet,
                            connect.static(require('path').resolve('.tmp')),
                            connect.static(require('path').resolve('src/main/webapp'))
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        '<%= app.test %>',
                        '<%= app.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= app.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '../.jshintrc',
                reporter: 'node_modules/jshint-teamcity-reporter/index.js'
            },
            all: [
                'Gruntfile.js',
                '<%= app.app %>/scripts/!modules/**/*.js',
                '<%= app.app %>/scripts/*.js',
                '!**/modules/**'
            ],
            test: {
                options: {
                    jshintrc: '../.jshintrc'
                },
                src: ['<%= app.test %>/spec/{,*/}*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= app.dist %>/*',
                            '!<%= app.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },

        // Compile less stylesheets
        less: {
            options: {
            },
            dev: {
                options: {
                    dumpLineNumbers: 'comments'
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= app.app %>/styles',
                        src: '*.less',
                        dest: '<%= app.app %>/styles/generated',
                        ext: '.css'
                    }
                ]
            },
            dist: {
                options: {
                    cleancss: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= app.app %>/styles',
                        src: '*.less',
                        dest: '<%= app.app %>/styles/generated',
                        ext: '.css'
                    }
                ]
            }
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/styles/',
                        src: '{,*/}*.css',
                        dest: '.tmp/styles/'
                    }
                ]
            }
        },

        // Automatically inject Bower components into the app
        'bower-install': {
            app: {
                src: '<%= app.app %>/index.html',
                ignorePath: '<%= app.app %>/'
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= app.dist %>/scripts/{,*/}*.js',
                        '<%= app.dist %>/styles/{,*/}*.css',
                        '<%= app.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= app.dist %>/styles/fonts/*'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= app.app %>/index.html',
            options: {
                dest: '<%= app.dist %>'
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= app.dist %>/{,*/}*.html'],
            css: ['<%= app.dist %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= app.dist %>']
            }
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= app.app %>/images',
                        src: '{,*/}*.{png,jpg,jpeg,gif}',
                        dest: '<%= app.dist %>/images'
                    }
                ]
            }
        },
        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= app.app %>/images',
                        src: '{,*/}*.svg',
                        dest: '<%= app.dist %>/images'
                    }
                ]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= app.dist %>',
                        src: ['*.html', 'views/{,*/}*.html'],
                        dest: '<%= app.dist %>'
                    }
                ]
            }
        },

        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/concat/scripts',
                        src: '*.js',
                        dest: '.tmp/concat/scripts'
                    }
                ]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            artifacts: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '../<%= globalConfig.module %>/build/dist',
                        dest: 'src/main/webapp/scripts/modules',
                        src: ['*.js', '*.map']
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '../<%= globalConfig.module %>/build/dist',
                        dest: 'src/main/webapp/styles/modules',
                        src: ['*.css']
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= app.app %>',
                        dest: '<%= app.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            '*.html',
                            'views/{,*/}*.html',
                            'bower_components/**/*',
                            'images/{,*/}*.{webp}',
                            'fonts/*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= app.dist %>/images',
                        src: ['generated/*']
                    }
                ]
            },
            styles: {
                expand: true,
                cwd: '<%= app.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'less:dev',
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        },

        // Test settings
        karma: {
            unit: {
                configFile: '<%= app.test %>/karma.conf.js',
                singleRun: true,
                reporters: ['teamcity']
            }
        },

        bower: {
            install: {}
        }
    });


    grunt.registerTask('refresh-module', function (dir) {
        globalConfig.module = dir;
        grunt.task.run([
            'run-grunt:' + dir + ':quick',
            'copy:artifacts'
        ]);
    });

    grunt.registerTask('refresh-modules', function () {
        grunt.file.expand('../angular-multimodule-*-ui').forEach(function (dir) {
            var module = dir.replace('../', '');
            console.log('refreshing ' + module);
            grunt.task.run('refresh-module:' + module);
        });
    });

    grunt.registerTask('build-module', function (dir) {
        globalConfig.module = dir;
        grunt.task.run([
            'run-grunt:' + dir,
            'copy:artifacts'
        ]);
    });

    grunt.registerTask('build-modules', function () {
        grunt.file.expand('../angular-multimodule-*-ui').forEach(function (dir) {
            var module = dir.replace('../', '');
            grunt.task.run('build-module:' + module);
        });
    });


    grunt.registerTask('build-module-dev', function (dir) {
        globalConfig.module = dir;
        grunt.task.run(['run-grunt:' + dir + ':build-dev', 'copy:artifacts']);
    });

    grunt.registerTask('build-modules-dev', function () {
        grunt.file.expand('../angular-multimodule-*-ui').forEach(function (dir) {
            var module = dir.replace('../', '');
            grunt.task.run('build-module-dev:' + module);
        });
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'refresh-modules',
            'bower-install',
            'concurrent:server',
            'autoprefixer',
            'configureProxies',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function () {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('test', [
        'clean:server',
        'refresh-modules',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:server',
        'clean:dist',
        'build-modules',
        'bower-install',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma',
        'useminPrepare',
        'less:dist',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'ngmin',
        'copy:dist',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('build-dev', [
        'newer:jshint',
        'clean:server',
        'clean:dist',
        'build-modules-dev',
        'bower-install',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma',
        'concurrent:dist',
        'less:dist',
        'autoprefixer',
        'copy:dist'
    ]);

    grunt.registerTask('build_gradle', [
        'newer:jshint',
        'clean:server',
        'clean:dist',
        'refresh-modules',
        'bower-install',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma',
        'useminPrepare',
        'less:dist',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'ngmin',
        'copy:dist',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('build_dev_gradle', [
        'newer:jshint',
        'clean:server',
        'clean:dist',
        'refresh-modules',
        'bower-install',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma',
        'concurrent:dist',
        'less:dist',
        'autoprefixer',
        'copy:dist'
    ]);

    grunt.registerTask('clean_gradle', [
        'clean:server',
        'clean:dist'
    ]);

    grunt.registerTask('bower_install', ['bower:install']);

    grunt.registerTask('default', ['build-dev']);
};

'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'


module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    require('../grunt-tasks.js')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    // require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project meta
        pkg: require('./package.json'),
        meta: {
            banner: '/**\n' +
                ' * <%= pkg.name %>\n' +
                ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' */\n'
        },

        // Project settings
        app: {
            moduleDependencies: ['angular-multimodule-base-ui'],
            src: 'src/main/javascript',
            testSrc: 'src/test/javascript',
            buildDir: 'build',
            dist: '<%= app.buildDir %>/dist',
            pages: '<%= app.buildDir %>/pages'
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['{.tmp,<%= app.src %>}/{,*/}*.js'],
                tasks: ['newer:jshint:all']
            },
            jsTest: {
                files: ['{<%= app.testSrc %>}/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            styles: {
                options: {
                    spawn: false
                },
                files: ['{<%= app.docs %>,<%= app.src %>}/**/*.less'],
                tasks: ['less:dev', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '{.tmp,<%= app.src %>}/{,*/}*.css',
                    '{.tmp,<%= app.src %>}/**/.js'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: '0.0.0.0',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= app.src %>'
                    ]
                }
            },
            test: {
                options: {
                    port: 9002,
                    base: [
                        '.tmp',
                        '<%= app.src %>',
                        '<%= app.testSrc %>'
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
                '<%= app.src %>/{,*/}*.js'
            ],
            test: {
                options: {
                    jshintrc: '../.jshintrc'
                },
                src: ['<%= app.testSrc %>/**/*.js']
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
                        cwd: '<%= app.src %>/**/',
                        src: '*.less',
                        dest: '.tmp/styles/',
                        ext: '.css'
                    }
                ]
            }
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
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

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'less:dev'
            ],
            test: [
                'less:dev'
            ],
            dist: [
                'less:dist'
            ]
        },

        concat: {
            dist: {
                options: {
                    // Replace all 'use strict' statements in the code with a single one at the top
                    banner: '(function(window, document, undefined) {\n\'use strict\';\n',
                    footer: '\n})(window, document);\n',
                    process: function (src, filepath) {
                        return '// Source: ' + filepath + '\n' +
                            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    }
                },
                files: [
                    {
                        src: ['<%= app.src %>/**/module.js', '<%= app.src %>/**/{*,!module}.js'],
                        dest: '<%= app.dist %>/<%= pkg.name %>.js'
                    },
                    {
                        src: ['<%= app.dist %>/modules/{,*/}*.tpl.js'],
                        dest: '<%= app.dist %>/<%= pkg.name %>.tpl.js'
                    }
                ]
            },
            banner: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= app.dist %>',
                        src: '{,*/}*.js',
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
                        src: '<%= app.dist %>/<%= pkg.name %>.js'
//            dest: '<%= app.dist %>/<%= pkg.name %>.js'
                    }
                ]
            },
            modules: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        cwd: '<%= app.src %>',
                        src: '{,*/}*.js',
                        dest: '<%= app.dist %>/modules'
                    }
                ]
            }
        },

        ngtemplates: {
            dist: {
                options: {
                    module: function (src) {
                        return 'app.admin.' + src.match(/src\/main\/javascript\/(.+)\/.*/)[1];
                    },
                    url: function (url) {
                        return url.replace('src/main/javascript/', '');
                    },
                    htmlmin: { collapseWhitespace: true }
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        cwd: '<%= app.src %>',
                        src: '{,*/}/*.tpl.html',
                        dest: '<%= app.dist %>/modules',
                        ext: '.tpl.js'
                    }
                ]
            }
        },

        uglify: {
            dist: {
                options: {
                    report: 'gzip',
                    sourceMap: '<%= app.dist %>/<%= pkg.name %>.min.map',
                    sourceMappingURL: '<%= pkg.name %>.min.map'
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= app.dist %>',
                        src: '{,*/}*.js',
                        dest: '<%= app.dist %>',
                        ext: '.min.js'
                    },
                    {
                        expand: true,
                        cwd: '<%= app.dist %>',
                        src: '{,*/}*.tpl.js',
                        dest: '<%= app.dist %>',
                        ext: '.tpl.min.js'
                    }
                ]
            }
        },

        copy: {
            dependencies: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '../<%= app.moduleDependencies %>/build/dist',
                        dest: '.tmp/lib',
                        src: ['*.js']
                    }
                ]
            }
        },

        deps: {
            modules: '<%= app.moduleDependencies %>'
        },

        // Test settings
        karma: {
            options: {
                configFile: '<%= app.testSrc %>/karma.conf.js',
                browsers: ['PhantomJS'],
                singleRun: true
            },
            unit: {
                options: {
                    reporters: ['dots', 'coverage', 'teamcity']
                },
                singleRun: true
            },
            server: {
                options: {
                    reporters: ['progress']
                },
                autoWatch: true
            }
        },
        coveralls: {
            options: {
                /*jshint camelcase: false */
                coverage_dir: 'test/coverage/PhantomJS 1.9.7 (Linux)/',
                force: true
            }
        },
        bower: {
            install: {}
        }
    });

    grunt.registerMultiTask('deps', function () {
        this.data.forEach(function (dir) {
            grunt.task.run('run-grunt:' + dir + ':quick');
        });
        grunt.task.run('copy:dependencies');
    });

    grunt.registerTask('quick', [
        'clean:dist',
        'ngtemplates:dist',
        'concat:dist',
        'concat:banner'
    ]);

    grunt.registerTask('build', [
        'newer:jshint',
        'clean:server',
        'deps',
        'connect:test',
        'karma:unit',
        'clean:dist',
        'ngtemplates:dist',
        'concat:dist',
        'ngmin:dist',
        'ngmin:modules',
        'uglify:dist',
        'concat:banner'
    ]);

    grunt.registerTask('build-dev', [
        'newer:jshint',
        'clean:server',
        'deps',
        'connect:test',
        'karma:unit',
        'clean:dist',
        'ngtemplates:dist',
        'concat:dist',
        'concat:banner'
    ]);

    grunt.registerTask('bower_install', ['bower:install']);
    grunt.registerTask('default', ['build-dev']);
};

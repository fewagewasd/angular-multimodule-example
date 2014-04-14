'use strict';


module.exports = function (grunt) {
    var path = require('path');

    grunt.registerTask('run-grunt', function (dir, task) {
        var done = this.async();
        var isVerbose = grunt.option('verbose');
        var isDebug = grunt.option('debug');

        var args = !!task ? [task] : [];
        if (isVerbose) {
            args.push('--verbose');
        }
        if (isDebug) {
            args.push('--debug');
        }

        var pth = path.resolve('../' + dir);

        grunt.log.debug('Args: ' + pth);
        grunt.log.debug('Working Directory: ' + pth);

        var g = grunt.util.spawn({
            grunt: true,
            args: args,
            opts: {
                cwd: pth
            }
        }, function (err, result, code) {

            if (isDebug || isVerbose) {
                var lines = String(result.stdout).split(/\cr\lf|\n/g);
                for (var i = 0; i < lines.length; i++) {
                    grunt.log.writeln('[' + dir + '] ' + lines[i]);
                }
            }

            if (code !== 0) {
                grunt.log.writeln('----------------------------------------------------------------------------------------------------------------');
                grunt.log.error('Failed to execute \'grunt ' + (!!task ? task : 'default' ) + '\' in ' + dir + '. Use --debug to see the output.');
                grunt.log.writeln('----------------------------------------------------------------------------------------------------------------');
            }

            done(err);
        });
    });
};
module.exports = function(grunt) {

    // Load tasks
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.initConfig({

        less: {
            development: {
                options: {
                    paths: ["assets/css"]
                },
                files: {
                    "client/css/app.css": "client/css/app.less"
                }
            }
        },

        browserify: {
            development: {
                files: {
                    'client/js/game.bundle.js': ['game/game.js']
                }
            }
        },

        watch: {
            styles: {
                // Which files to watch (all .less files recursively in the less directory)
                files: ['client/css/**/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false
                }
            },

            scripts: {
                files: ['game/**/*.js'],
                tasks: ['browserify'],
                options: {
                    spawn: false
                }
            }
        },

        concurrent: {
            dev: ['nodemon:dev', 'watch'],
            options: {
                logConcurrentOutput: true
            }

        },

        nodemon: {
            dev: {
                script: './server/main.js'
            },
            options: {
                nodeArgs: ['--debug']
            }
        },

        clean: ["node_modules", "client/components"]

    });

    grunt.registerTask('setup', ['less', 'browserify']);
    grunt.registerTask('dev', ['setup', 'concurrent:dev']);

};
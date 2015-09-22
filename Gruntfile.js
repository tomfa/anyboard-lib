module.exports = function(grunt) {
    //load all dependencies
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        anyBoard: {
            test: 'test',
            libs: 'libs'
        },
        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                src: [
                    '<%= anyBoard.libs %>/**/*.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'dist/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },

        //Validate js
        jshint: {
            build: {
                options: {
                    'curly': true,
                    'eqeqeq': true,
                    'eqnull': true,
                    'browser': true,
                    'indent': 4,
                    'maxlen': 120,
                    'quotmark': 'single',
                    'maxparams': 4,
                    'nonbsp': true,
                    'expr': true,
                    'latedef': true,
                    reporter: require('jshint-stylish')
                },
                src: ['<%= anyBoard.libs %>/**/*.js']
            }

        },
        watch: {
            concat: {
                files: ['<%= anyBoard.libs %>/**/*.js'],
                tasks: ['concat:dist']
            },
            js: {
                files: ['<%= anyBoard.libs %>/**/*.js',
                '<%= anyBoard.test %>/**/*.js'],
                tasks: ['jshint'],
                options: {
                    spawn: false,
                },
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['test/**/*.js']
            }
        },
        jsdoc2md: {
            oneOutputFile: {
                src: "dist/<%= pkg.name %>.js",
                dest: "documentation.md"
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, src: ['dist/<%= pkg.name %>.js'], dest: 'examples/mobile-deck/'},

                    {expand: true, src: ['dist/<%= pkg.name %>.js'], dest: 'examples/html-deck/'},

                    {expand: true, src: ['dist/<%= pkg.name %>.js'], dest: 'examples/mobile-led-on/'},
                    {expand: true, src: ['driver/bean.evothings.bluetooth.js'], dest: 'examples/mobile-led-on/'},
                    {expand: true, src: ['driver/discovery.evothings.bluetooth.js'], dest: 'examples/mobile-led-on/'},
                    {expand: true, src: ['driver/rfduino.evothings.bluetooth.js'], dest: 'examples/mobile-led-on/'},
                    {expand: true, src: ['firmware/BeanToken.ino'], dest: 'examples/mobile-led-on/'},
                    {expand: true, src: ['firmware/RFduinoToken.ino'], dest: 'examples/mobile-led-on/'},

                    {expand: true, src: ['dist/<%= pkg.name %>.js'], dest: 'examples/mobile-bean-printer/'},
                    {expand: true, src: ['driver/bean.evothings.bluetooth.js'], dest: 'examples/mobile-bean-printer/'},
                    {expand: true, src: ['driver/discovery.evothings.bluetooth.js'], dest: 'examples/mobile-bean-printer/'},
                    {expand: true, src: ['firmware/BeanPrinter.ino'], dest: 'examples/mobile-bean-printer/'},

                    {expand: true, src: ['dist/<%= pkg.name %>.js'], dest: 'examples/mobile-rfduino-color-detection/'},
                    {expand: true, src: ['driver/discovery.evothings.bluetooth.js'], dest: 'examples/mobile-led-on/'},
                    {expand: true, src: ['driver/rfduino.evothings.bluetooth.js'], dest: 'examples/mobile-led-on/'},
                    {expand: true, src: ['firmware/RFduinoToken.ino'], dest: 'examples/mobile-rfduino-color-detection/'},
                ]
            }
        }
    });

    grunt.registerTask('default', []);
    grunt.registerTask('test', ['build', 'mochaTest']);
    grunt.registerTask('build', ['concat', 'uglify']);
    grunt.registerTask('doc', ['build', 'jsdoc2md']);
    grunt.event.on('watch', function(action, filepath) {
        grunt.config('jshint.build.src', filepath);
    });

};

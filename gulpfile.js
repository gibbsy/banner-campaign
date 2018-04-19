var DIR_ROOT;
var archiveName;
var richloadName;
var baseName;

// dependencies
var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyHTML = require('gulp-minify-html');
var minifyInline = require('gulp-minify-inline');
var rename = require('gulp-rename');
var del = require('del');
var connect = require('gulp-connect');
var open = require('gulp-open');
var zip = require('gulp-zip');
var runSequence = require('run-sequence');
var header = require('gulp-header');
var filesize = require('gulp-filesize');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var argv = require('yargs').argv;

// read in the package file
var pkg = require('./package.json');

// Banner message to be appended to minified files
var nowDate = new Date();

var bannerMessageHtml = ['<!--',
    ' <%= pkg.name %> - <%= pkg.description %>',
    ' @version v<%= pkg.version %>',
    ' @date ' + (nowDate.getMonth() + 1) + "-" + nowDate.getDate() + "-" + nowDate.getFullYear() + " at " + nowDate.getHours() + ":" + nowDate.getMinutes() + ":" + nowDate.getSeconds(),
    ' -->',
    ''
].join('\n');
var bannerMessageJsCss = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @date ' + (nowDate.getMonth() + 1) + "-" + nowDate.getDate() + "-" + nowDate.getFullYear() + " at " + nowDate.getHours() + ":" + nowDate.getMinutes() + ":" + nowDate.getSeconds(),
    ' */',
    ''
].join('\n');


// TASKS

// Uglify external JS files
gulp.task('uglify:dist', function() {
    var opt = {
        mangle: true, // make shorter variable names
        compress: {
            drop_debugger: true, // drop debugger messages from code
            drop_console: true // drop console messages from code
        },
        output: {
            beautify: false // make code pretty? default is false
        }
    };
    return gulp.src(DIR_ROOT + '/dev/script.js')
        .pipe(uglify(opt))
        .pipe(rename('script.js'))
        .pipe(gulp.dest(DIR_ROOT + '/dist'));
});

// Uglify / Minify inline JS and CSS
gulp.task('minify-inline', function() {
    var opt = {
        js: { // options for inline JS
            mangle: true, // make shorter variable names
            compress: {
                drop_debugger: true, // drop debugger messages from code
                drop_console: true // drop console messages from code
            },
            output: {
                beautify: false // make code pretty? default is false
            }
        }
    };
    gulp.src(DIR_ROOT + '/dist/*.html')
        .pipe(minifyInline(opt))
        .pipe(gulp.dest(DIR_ROOT + '/dist/'))
});

gulp.task('sass:dev', function() {
    return gulp.src(DIR_ROOT + '/dev/style.scss')
        .pipe(sass({
            outputStyle: "expanded"
        }).on('error', sass.logError))
        .pipe(autoprefixer('last 5 versions'))
        .pipe(rename('style.css'))
        .pipe(gulp.dest(DIR_ROOT + '/dev'))
        .pipe(connect.reload());;
});

gulp.task('sass:dist', function() {
    return gulp.src(DIR_ROOT + '/dev/style.scss')
        .pipe(sass({
            outputStyle: "compressed"
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(rename('style.css'))
        .pipe(gulp.dest(DIR_ROOT + '/dist'));
});


gulp.task('minify-html', function() {
    var opts = {
        conditionals: true,
        spare: false
    };
    return gulp.src(DIR_ROOT + '/dist/*.html')
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest(DIR_ROOT + '/dist/'));
});

gulp.task('del', function() {
    return del([
        DIR_ROOT + '/dist/*'
    ])
});

gulp.task('connect', function() {
    connect.server({
        root: [DIR_ROOT + '/dev'],
        port: 8889,
        livereload: true,
        host: '0.0.0.0'
    });
});

gulp.task('open', function() {
    var options = {
        uri: 'http://localhost:8889',
        app: 'Google Chrome'
    };
    gutil.log('-----------------------------------------');
    gutil.log('Serving your creative: ' + DIR_ROOT);
    gutil.log('Opening browser to:', gutil.colors.yellow('http://localhost:8889'));
    gutil.log('-----------------------------------------');
    gulp.src(__filename)
        .pipe(open(options));
});

gulp.task('image-minimise', function () {
    return gulp.src(DIR_ROOT + '/dev/assets/*.png', { base: DIR_ROOT + '/dev/' })
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 5,
            verbose: true,
            use: [pngquant({ quality: '10-20' , speed: 3, verbose: true })]
        }))
        .pipe(gulp.dest(DIR_ROOT + '/dist'));
});

// png and css excluded
gulp.task('copy-to-dist-folder', function() {
    return gulp.src([DIR_ROOT + '/dev/*', DIR_ROOT + '/dev/**/*', DIR_ROOT + '/dev/**/**/*', '!' + DIR_ROOT + '/dev/*.scss', '!richload/dev/*.css', '!' + DIR_ROOT + '/dev/assets/*.png'], { base: DIR_ROOT + '/dev/' })
        .pipe(gulp.dest(DIR_ROOT + '/dist'));
});

gulp.task('compress', function() {
    gutil.log('compressing: ' + DIR_ROOT);
    return gulp.src([DIR_ROOT + '/dist/*', DIR_ROOT + '/dist/**/*', DIR_ROOT + '/dist/**/**/*'], { base: DIR_ROOT + '/dist/'})
        .pipe(zip(archiveName))
        .pipe(filesize())
        .pipe(gulp.dest('_delivery'));
});


gulp.task('archive', function() {
    DIR_ROOT = argv.root;
    archiveName = DIR_ROOT + '.zip'
    // make a zip all the files, including dev folder, for archiving the banner
    var success = gulp.src([DIR_ROOT + '/dev/*', DIR_ROOT + '/dev/**/*', DIR_ROOT + '/dist/*', DIR_ROOT + '/dist/**/*' ], {cwdbase: true})
        // for quick access, you can change this
        // name at the top of this file
        .pipe(zip('archive-'+archiveName))
        .pipe(gulp.dest('_archive'));
    gutil.log('--------------------------------');
    gutil.log('Your banner has been archived in');
    gutil.log('archive/'+ gutil.colors.yellow('archive-'+archiveName) );
    gutil.log('--------------------------------');
    return success;
});

gulp.task('basic-reload', function() {
    gulp.src(DIR_ROOT + '/dev')
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch([DIR_ROOT + '/dev/*.html', DIR_ROOT + '/dev/*.js'], ['basic-reload']);
    gulp.watch([DIR_ROOT + '/dev/*.scss'], ['sass:dev']);
});

gulp.task('build-rich', ['build-base'], function(callback) {
    DIR_ROOT = argv.root + '/richload';
    archiveName = 'richload_' + argv.root + '.zip';
    gutil.log('Preparing to build: ' + DIR_ROOT);
    runSequence('del', 'copy-to-dist-folder', 'image-minimise', ['minify-html'], ['minify-inline', 'sass:dist'], 'uglify:dist', ['compress'],
        callback);
}); 

gulp.task('build-base', function (callback) {
    DIR_ROOT = argv.root + '/base';
    archiveName = 'base_' + argv.root + '.zip';
    runSequence('del', 'copy-to-dist-folder', 'image-minimise', ['minify-html'], ['minify-inline', 'sass:dist'], 'uglify:dist', ['compress'],
        callback);
});

gulp.task('build-standard', function (callback) {
    DIR_ROOT = argv.root;
    archiveName = 'onpage_' + argv.root + '.zip';
    gutil.log('Preparing to build: ' + DIR_ROOT);
    runSequence('del', 'copy-to-dist-folder', 'image-minimise', ['minify-html'], ['minify-inline', 'sass:dist'], 'uglify:dist', ['compress'],
        callback);
}); 

gulp.task('serve', function(callback) {
    //DIR_ROOT = (argv.rich == true) ? argv.root + '/richload' : argv.root;
    if (argv.rich) {
        DIR_ROOT = argv.root + '/richload';
    } else {
        DIR_ROOT = argv.root;
    }
    gutil.log('Serving: ' + DIR_ROOT);
    runSequence('sass:dev', ['connect'], ['open', 'watch'],
        callback);
});

gulp.task('b', ['build-rich']);

gulp.task('bs', ['build-standard']);

gulp.task('help', function() {

    gutil.log('--------------------------');
    gutil.log('There are 3 basic commands.');
    gutil.log(gutil.colors.yellow('gulp'), ': for dev use, spins up server w livereload as you edit files');
    gutil.log(gutil.colors.yellow('gulp build'), ': minifies files from the dev directory into the', gutil.colors.red('dist'), 'directory');
    gutil.log('and creates a zip of these files in', gutil.colors.red('delivery'), 'directory');
    gutil.log(gutil.colors.yellow('gulp archive'), 'takes files from the '+ gutil.colors.red('dev'), 'directory' + ' plus other important files');
    gutil.log('and zips them in the', gutil.colors.red('archive'), 'directory for archival purposes.');
    gutil.log('--------------------------');
});

gulp.task('default', ['serve']);
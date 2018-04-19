// dependencies
var fs = require('fs');
var path = require('path');
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

var bannersPath = 'banners/'

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function (file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

function isRichBanner(dir) {
  var contents = getFolders(dir);
  return contents[0]=='base'; 
}

function serveBanner(dir) {
  var DIR_ROOT = 'banners/' + dir;

  gulp.task('basic-reload', function() {
    gulp.src(DIR_ROOT + '/dev')
      .pipe(connect.reload());
  });

  gulp.task('watch', function() {
    gulp.watch([DIR_ROOT + '/dev/*.html', DIR_ROOT + '/dev/*.js'], ['basic-reload']);
    gulp.watch([DIR_ROOT + '/dev/*.scss'], ['sass:dev']);
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
    gutil.log('Serving your creative: ' + gutil.colors.green(DIR_ROOT));
    gutil.log('Opening browser to:', gutil.colors.yellow('http://localhost:8889'));
    gutil.log('-----------------------------------------');
    gulp.src(__filename)
      .pipe(open(options));
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

  runSequence('sass:dev', ['connect'], ['open', 'watch']);
}

function buildBanner(dir, bannerType) {
 
  var DIR_ROOT = 'banners/' + dir;
  var name = bannerType || 'banner';
  if (dir.search('/')!= -1) {
    var size = dir.slice(0,dir.search('/'));
    var archiveName = name + '_' + size + '.zip';
  } else {
    var archiveName = name + '_' + dir + '.zip';
  }

  gulp.task('uglify:dist_' + dir, function() {
    var opt = {
      mangle: true, 
      compress: {
        drop_debugger: true, 
        drop_console: true 
      },
      output: {
        beautify: false 
      }
    };
    return gulp.src(DIR_ROOT + '/dev/script.js')
      .pipe(uglify(opt))
      .pipe(rename('script.js'))
      .pipe(gulp.dest(DIR_ROOT + '/dist'));
  });

  // Uglify / Minify inline JS and CSS
  gulp.task('minify-inline_' + dir , function() {
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

  gulp.task('sass:dist_' + dir , function() {
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

  gulp.task('minify-html_' + dir , function() {
    var opts = {
      conditionals: true,
      spare: false
    };
    return gulp.src(DIR_ROOT + '/dist/*.html')
      .pipe(minifyHTML(opts))
      .pipe(gulp.dest(DIR_ROOT + '/dist/'));
  });

  gulp.task('del_' + dir, function() {
    return del([
      DIR_ROOT + '/dist/*'
    ])
  });

  gulp.task('image-minimise_' + dir, function() {
    return gulp.src(DIR_ROOT + '/dev/assets/*.png', { base: DIR_ROOT + '/dev/' })
      .pipe(imagemin({
        progressive: true,
        optimizationLevel: 5,
        verbose: true,
        use: [pngquant({ quality: '10-20', speed: 3, verbose: true })]
      }))
      .pipe(gulp.dest(DIR_ROOT + '/dist'));
  });

  // png, js and css excluded - piped over by other tasks
  gulp.task('copy-to-dist-folder_' + dir, function() {
    return gulp.src([DIR_ROOT + '/dev/*', DIR_ROOT + '/dev/**/*', DIR_ROOT + '/dev/**/**/*', '!' + DIR_ROOT + '/dev/*.scss', '!richload/dev/*.css', '!' + DIR_ROOT + '/dev/assets/*.png'], { base: DIR_ROOT + '/dev/' })
      .pipe(gulp.dest(DIR_ROOT + '/dist'));
  });

  gulp.task('compress_' + dir, function() {
    gutil.log('compressing: ' + DIR_ROOT);
    return gulp.src([DIR_ROOT + '/dist/*', DIR_ROOT + '/dist/**/*', DIR_ROOT + '/dist/**/**/*'], { base: DIR_ROOT + '/dist/' })
      .pipe(zip(archiveName))
      .pipe(filesize())
      .pipe(gulp.dest('_delivery'));
  });
  runSequence('del_' + dir, 'copy-to-dist-folder_' + dir, 'image-minimise_' + dir, ['minify-html_' + dir], ['minify-inline_' + dir, 'sass:dist_' + dir], 'uglify:dist_' + dir, 'compress_' + dir);
}

function buildRichBanner(dir) {
  var baseDir = dir + '/base';
  var richDir = dir + '/richload';
  buildBanner(baseDir, 'banner');
  buildBanner(richDir, 'richload');
}
// to build a specific creative, specify the directory using yargs: eg --root=300x250_A
gulp.task('build', function(callback) {
  if(argv.root) {
    // build a specific banner
    var folder = bannersPath + argv.root;
    if(isRichBanner(folder)) {
      //build a richload (flashtalking)
      gutil.log('-----------------------------------------');
      gutil.log(gutil.colors.yellow('BUILDING RICHLOAD: ') + gutil.colors.magenta(folder));
      gutil.log('-----------------------------------------');
      buildRichBanner(argv.root)
    } else {
      //build a standard banner
      gutil.log('-----------------------------------------');
      gutil.log(gutil.colors.yellow('BUILDING BANNER: ') + gutil.colors.magenta(folder));
      gutil.log('-----------------------------------------');
      buildBanner(argv.root);
    }
  } else {
    // or just build all the banners
    var folders = getFolders(bannersPath);
    gutil.log('-----------------------------------------');
    gutil.log(gutil.colors.yellow('PREPARING TO BUILD ' + folders.length + ' CREATIVES :'));
    gutil.log(gutil.colors.green(folders));
    gutil.log('-----------------------------------------');
    folders.forEach(function (folder) {
      if(isRichBanner(bannersPath + folder)) {
        //build a richload (flashtalking)
        buildRichBanner(folder);
      } else {
        //build a standard banner
        buildBanner(folder);
      }
    })
  }
})

gulp.task('serve', function() {
  if (isRichBanner(bannersPath + argv.root)) {
    var dir = argv.root + '/richload';
  } else {
    var dir = argv.root;
  }
  serveBanner(dir);
});

gulp.task('b', ['build']);

gulp.task('default', ['serve']);
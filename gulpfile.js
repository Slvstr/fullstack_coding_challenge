var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var wiredep = require('wiredep').stream;


gulp.task('sass', function() {

  /******************************************************************************
   * Config
   *****************************************************************************/
  var injectFiles = gulp.src('./client/app/**/*.scss', { read: false });

  var injectOptions = {
    transform: function(filePath) {
      return '@import \'' + filePath + '\';';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false,
    relative: false
  };

  /******************************************************************************
   * Task
   *****************************************************************************/

  return gulp.src('client/scss/app.scss')
  .pipe($.inject(injectFiles, injectOptions))
  .pipe(gulp.dest('./build/scss'))
  .pipe($.sourcemaps.init())
  .pipe($.sass({errLogToConsole: true}))
  .pipe($.autoprefixer())
  .pipe($.csso())
  .pipe($.sourcemaps.write())
  .pipe(gulp.dest('./build/css/'));

});

gulp.task('templates', function() {
  return gulp.src('./client/app/**/*.html')  
    .pipe($.angularTemplatecache({standalone: true}))
    .pipe(gulp.dest('./build/templates'));
})



gulp.task('inject', ['sass', 'templates'], function() {
  var injectCSS = gulp.src(['./build/css/*.css'], {read: false});
  var injectScripts = gulp.src([
    './client/app/**/*.js',
    './build/templates/*.js',
    '!./www/app/**/*.spec.js',
    '!./www/app/**/*.mock.js'
  ])
  .pipe($.angularFilesort())
  .pipe(gulp.dest('./build/js'));

  var injectOptions = {
    addRootSlash: false,
    ignorePath: 'build'
  };

  var wiredepOptions = {
    directory: 'build/lib',
    ignorePath: '../build/'
  };


  return gulp.src('./client/index.html')
    .pipe($.inject(injectCSS, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(wiredepOptions))
    .pipe(gulp.dest('./build'));

});


gulp.task('build', ['sass', 'inject'], function() {
  // Move static assets to a 'public' folder.  Concat + minify scripts.  Use angularTemplateCache.
});

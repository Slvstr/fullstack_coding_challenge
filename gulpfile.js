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
      filePath = filePath.replace('client', '..');
      return '@import \'' + filePath + '\';';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false,
    relative: true
  };

  /******************************************************************************
   * Task
   *****************************************************************************/

  return gulp.src('client/scss/app.scss')
  .pipe($.inject(injectFiles, injectOptions))
  .pipe(gulp.dest('./client/scss'))
  .pipe($.sourcemaps.init())
  .pipe($.sass({errLogToConsole: true}))
  .pipe($.autoprefixer())
  .pipe($.csso())
  .pipe($.sourcemaps.write())
  .pipe(gulp.dest('./client/css/'));

});

gulp.task('templates', function() {
  return gulp.src('./client/app/**/*.html')  
    .pipe($.angularTemplatecache({standalone: true}))
    .pipe(gulp.dest('./client/templates'));
})



gulp.task('inject', ['sass', 'templates'], function() {
  var injectCSS = gulp.src(['./client/css/*.css'], {read: false});
  var injectScripts = gulp.src([
    './client/app/**/*.js',
    './client/templates/*.js',
    '!./www/app/**/*.spec.js',
    '!./www/app/**/*.mock.js'
  ])
  .pipe($.angularFilesort())
  .pipe(gulp.dest('./client/js'));

  var injectOptions = {
    addRootSlash: false,
    ignorePath: 'client'
  };

  var wiredepOptions = {
    directory: 'client/lib'
  };


  return gulp.src('./client/index.html')
    .pipe($.inject(injectCSS, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(wiredepOptions))
    .pipe(gulp.dest('./client'));

});


gulp.task('build', ['sass', 'inject'], function() {
  // Move static assets to a 'public' folder.  Concat + minify scripts.  Use angularTemplateCache.
});

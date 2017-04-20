var concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    uglifyJS = require('gulp-uglify');




/*********************************************
            Individual Tasks
*********************************************/

gulp.task('event-scripts', function() {
  gulp.src('dev/events-page/*.js')
    .pipe(rename('local.js'))
    .pipe(gulp.dest('dist/event-scripts'))
});

gulp.task('homepage-dropdown', function() {
  gulp.src('dev/homepage_dropdown/*.js')
    .pipe(rename('local.js'))
    .pipe(gulp.dest('dist/homepage_dropdown'))
});

gulp.task('program-scripts', function() {
  gulp.src('dev/programs-landing/*.js')
    .pipe(rename('local.js'))
    .pipe(gulp.dest('dist/programs-landing'))
});

gulp.task('pulse', function() {
  gulp.src('dev/pulse/*.js')
    .pipe(rename('local.js'))
    .pipe(gulp.dest('dist/pulse'))
});

gulp.task('widget-scripts', function() {
  return gulp.src(['dev/toggle-widget/*.js', 'dev/tooltip-widget/*.js'])
    .pipe(concat('test-widget-scripts.txt'))
    .pipe(gulp.dest('dist'));
});

gulp.task('widget-styles', function() {
  return gulp.src(['dev/toggle-widget/*.css', 'dev/tooltip-widget/*.css'])
    .pipe(concatCss('test-widget-styles.txt'))
    .pipe(cssnano())
    .pipe(gulp.dest('dist'));
});

gulp.task('widget', function(callback) {
  runSequence('clean:dist', ['widget-scripts', 'widget-styles'], callback)
});


/*********************************************
            Global Tasks
*********************************************/

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('single-css', function() {
  return gulp.src(['dev/styles.css', 'dev/photo-gallery/*.css', 'dev/toggle-widget/*.css', 'dev/tooltip-widget/*.css'])
    .pipe(concatCss('nursing-styles.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('dist'));
});

gulp.task('compile-css', function(callback) {
  runSequence('clean:dist', 'single-css', callback)
});

gulp.task('single-js', function() {
  return gulp.src(['dev/photo-gallery/*.js', 'dev/programs-landing/*.js', 'dev/toggle-widget/*.js', 'dev/tooltip-widget/*.js'])
    .pipe(concat('local.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('compile-js', function(callback) {
  runSequence('clean:dist', 'single-js', callback)
});

gulp.task('compile', function(callback) {
  runSequence('clean:dist', ['single-css', 'single-js'], callback)
});
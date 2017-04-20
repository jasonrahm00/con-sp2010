var concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    uglifyJS = require('gulp-uglify');

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('homepageDropdown', function() {
  gulp.src('dev/homepage_dropdown/*.js')
    .pipe(rename('local.js'))
    .pipe(gulp.dest('dist/homepage_dropdown'))
});

gulp.task('pulse', function() {
  gulp.src('dev/pulse/*.js')
    .pipe(rename('local.js'))
    .pipe(gulp.dest('dist/pulse'))
});

gulp.task('programScripts', function() {
  gulp.src('dev/programs-landing/*.js')
    .pipe(rename('local.js'))
    .pipe(gulp.dest('dist/programs-landing'))
});

gulp.task('styles', function() {
  gulp.src('dev/styles.css')
    .pipe(rename('subSite.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('dist'))
});

gulp.task('eventScripts', function() {
  gulp.src('dev/events-page/*.js')
    .pipe(rename('local.js'))
    .pipe(gulp.dest('dist/event-scripts'))
});

gulp.task('watch', function() {
  gulp.watch('dev/*.js', ['createLocal'])
});

gulp.task('widget-scripts', function() {
  return gulp.src(['dev/toggle-widget/*.js', 'dev/tooltip-widget/*.js'])
    .pipe(concat('custom-widget-scripts.txt'))
    .pipe(gulp.dest('dist'));
});

gulp.task('widget-styles', function() {
  return gulp.src(['dev/toggle-widget/*.css', 'dev/tooltip-widget/*.css'])
    .pipe(concatCss('custom-widget-styles.txt'))
    .pipe(cssnano())
    .pipe(gulp.dest('dist'));
});

gulp.task('widget', function(callback) {
  runSequence('clean:dist', ['widget-scripts', 'widget-styles'], callback)
});
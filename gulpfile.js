var concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    uglify = require('gulp-uglify');



/*********************************************
            Individual Tasks
*********************************************/

gulp.task('news-scripts', function() {
  gulp.src('dev/newsroom-subsite/newsroom-scripts.js')
    .pipe(rename('local.js'))
    .pipe(gulp.dest('dist/news'))
});

gulp.task('event-styles', function() {
  gulp.src('dev/newsroom-subsite/events-page/*.css')
    .pipe(rename('event-styles.txt'))
    .pipe(gulp.dest('dist/news'))
});

gulp.task('news-styles', function() {
  gulp.src('dev/newsroom-subsite/news-room/*.css')
    .pipe(rename('news-styles.txt'))
    .pipe(gulp.dest('dist/news'))
});

gulp.task('homepage-dropdown', function() {
  gulp.src('dev/homepage_dropdown/*.js')
    .pipe(rename('local.js'))
    .pipe(gulp.dest('dist/homepage-dropdown'))
});

gulp.task('pulse', function() {
  gulp.src('dev/pulse/*.js')
    .pipe(rename('local.js'))
    .pipe(gulp.dest('dist/pulse'))
});



/*********************************************
            Map Locator Tasks
*********************************************/

gulp.task('locator-scripts', function() {
  gulp.src('dev/clinic-locator/locator-scripts.js')
    .pipe(uglify())
    .pipe(rename('local.js'))
    .pipe(gulp.dest('dist/clinic-locator'))
});

gulp.task('locator-styles', function() {
  gulp.src('dev/clinic-locator/*.css')
    .pipe(cssnano())
    .pipe(rename('locator-styles.txt'))
    .pipe(gulp.dest('dist/clinic-locator'))
});

gulp.task('compile-locator', function(callback) {
  runSequence('clean:dist', ['locator-scripts', 'locator-styles'], callback);
});



/*********************************************
            Global Tasks
*********************************************/

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('single-css', function() {
  return gulp.src(['dev/styles.css', 'dev/photo-gallery/*.css', 'dev/toggle-widget/*.css', 'dev/tooltip-widget/*.css'])
    .pipe(concatCss('subSite.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('dist'));
});

gulp.task('single-js', function() {
  return gulp.src(['dev/photo-gallery/*.js', 'dev/programs-landing/*.js', 'dev/toggle-widget/*.js', 'dev/tooltip-widget/*.js'])
    .pipe(concat('local.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('compile-css', function(callback) {
  runSequence('clean:dist', 'single-css', callback)
});

gulp.task('compile-js', function(callback) {
  runSequence('clean:dist', 'single-js', callback)
});

gulp.task('compile', function(callback) {
  runSequence('clean:dist', ['single-css', 'single-js'], callback)
});
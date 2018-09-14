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

gulp.task('admin-scripts', function() {
  gulp.src('dev/administration/administration-scripts.js')
    .pipe(rename('local.js'))
    .pipe(gulp.dest('dist/admin'))
});

gulp.task('event-styles', function() {
  gulp.src('dev/newsroom-subsite/events-page/*.css')
    .pipe(rename('event-styles.txt'))
    .pipe(gulp.dest('dist/events'))
});

gulp.task('event-scripts', function() {
  gulp.src('dev/newsroom-subsite/events-page/*.js')
    .pipe(rename('local.js'))
    .pipe(gulp.dest('dist/events'))
});

gulp.task('news-scripts', function() {
  gulp.src('dev/newsroom-subsite/news-stories/*.js')
    .pipe(rename('local.js'))
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
          Faculty Profile Tasks
*********************************************/

gulp.task('bio-scripts', function() {
  gulp.src('dev/faculty-directory/bios/faculty-bio-scripts.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/faculty-bios'))
});

gulp.task('bio-styles', function() {
  gulp.src('dev/faculty-directory/bios/faculty-bio-styles.css')
    .pipe(cssnano())
    .pipe(gulp.dest('dist/faculty-bios'))
});

gulp.task('bio-html', function() {
  gulp.src('dev/faculty-directory/bios/faculty-bio.html')
    .pipe(rename('faculty-bio.txt'))
    .pipe(gulp.dest('dist/faculty-bios'))
});

gulp.task('compile-bio', function(callback) {
  runSequence('clean:dist', ['bio-scripts', 'bio-styles', 'bio-html'], callback)
});



/*********************************************
          Faculty Directory Tasks
*********************************************/

gulp.task('directory-scripts', function() {
  gulp.src('dev/faculty-directory/directory/directory-scripts.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/faculty-directory'))
});

gulp.task('directory-styles', function() {
  gulp.src('dev/faculty-directory/directory/directory-styles.css')
    .pipe(cssnano())
    .pipe(gulp.dest('dist/faculty-directory'))
});

gulp.task('directory-html', function() {
  gulp.src('dev/faculty-directory/directory/directory.html')
    .pipe(gulp.dest('dist/faculty-directory'))
});

gulp.task('compile-directory', function(callback) {
  runSequence('clean:dist', ['directory-scripts', 'directory-styles', 'directory-html'], callback)
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

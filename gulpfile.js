var del = require('del'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence');

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

gulp.task('programStyles', function() {
  gulp.src('dev/programs-landing/*.css')
    .pipe(rename('subSite.css'))
    .pipe(gulp.dest('dist/programs-landing'))
});

gulp.task('local', function(callback) {
  runSequence('clean:dist', ['programScripts', 'programStyles'],
    callback
  )
});

gulp.task('watch', function() {
  gulp.watch('dev/*.js', ['createLocal'])
});
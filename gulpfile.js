var concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

var scriptPath,
    stylePath,
    pathRoot,
    htmlPath;

var paths = {
  directory: {
    root: 'faculty-directory',
    styles: '/**/*.css',
    scripts: '/**/*.js',
    html: '/**/*.html'
  },
  finder: {
    root: 'program-finder',
    styles: '/*.css',
    scripts: '/*.js',
    html: '/*.txt'
  }
};



/*********************************************
  Global Tasks
*********************************************/

function clean() {
  return del(['dist']);
}

function scripts() {
  return gulp.src('./dev/' + pathRoot + scriptPath)
    .pipe(uglify())
    .pipe(gulp.dest('./dist/' + pathRoot));
}

function styles() {
  return gulp.src('./dev/' + pathRoot + stylePath)
    .pipe(cssnano())
    .pipe(gulp.dest('./dist/' + pathRoot));
}

function html() {
  return gulp.src('./dev/' + pathRoot + htmlPath)
    .pipe(gulp.dest('./dist/' + pathRoot))
}



/*********************************************
  Specific Tasks/Functions
*********************************************/

function resetPaths() {
  scriptPath = null;
  stylePath = null;
  pathRoot = null;
  htmlPath = null;
}

function directory(cb) {
  pathRoot = paths.directory.root;
  scriptPath = paths.directory.scripts;
  stylePath = paths.directory.styles;
  htmlPath = paths.directory.html;
  cb();
}

function programFinder(cb) {
  pathRoot = paths.finder.root;
  scriptPath = paths.finder.scripts;
  stylePath = paths.finder.styles;
  htmlPath = paths.finder.html;
  cb();
}



/*********************************************
  Exported Tasks
*********************************************/

exports.clean = clean;

exports.buildDirectory = gulp.series(
  clean,
  directory,
  gulp.parallel(scripts, styles, html),
  function(done){
    resetPaths();
    done();
  }
);

exports.buildFinder = gulp.series(
  clean,
  programFinder,
  gulp.parallel(scripts, styles, html),
  function(done){
    resetPaths();
    done();
  }
);


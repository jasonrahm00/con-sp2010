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
    htmlPath,
    txtPath;

var paths = {
  directory: {
    root: 'directory',
    styles: '/**/*.css',
    scripts: '/**/*.js',
    html: '/**/*.html'
  },
  finder: {
    root: 'program-finder',
    styles: '/*.css',
    scripts: '/*.js',
    html: '/*.html',
    txt: '/*.txt'
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
    .pipe(gulp.dest('./dist/' + pathRoot));
}

function txt() {
  return gulp.src('./dev/' + pathRoot + txtPath)
    .pipe(gulp.dest('./dist/' + pathRoot));
}

function subsiteCss() {
  return gulp.src(['dev/styles.css', 'dev/photo-gallery/*.css', 'dev/toggle-widget/*.css', 'dev/tooltip-widget/*.css'])
    .pipe(concatCss('subSite.css'))
    .pipe(gulp.dest('./dist'));
}



/*********************************************
  Specific Tasks/Functions
*********************************************/

function resetPaths() {
  scriptPath = null;
  stylePath = null;
  pathRoot = null;
  htmlPath = null;
  txtPath = null;
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
  txtPath = paths.finder.txt;
  cb();
}



/*********************************************
  Exported Tasks
*********************************************/

exports.clean = clean;

exports.subsiteCss = subsiteCss;

exports.buildDirectory = gulp.series(
  clean,
  directory,
  gulp.parallel(scripts, styles, html),
  function(done) {
    resetPaths();
    done();
  }
);

exports.buildFinder = gulp.series(
  clean,
  programFinder,
  gulp.parallel(scripts, styles, html, txt),
  function(done){
    resetPaths();
    done();
  }
);

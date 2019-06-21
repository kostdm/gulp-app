const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

function styles(done) {
  src('app/sass/main.sass')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
  done();
}

function serve(done) {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
  done();
}

function watcher(done) {
  watch(['app/*.html','app/sass/**/*']).on('change', series(styles, serve));
  done();
}

exports.watcher = watcher;
exports.styles = styles;
exports.default = series(styles, serve, watcher);
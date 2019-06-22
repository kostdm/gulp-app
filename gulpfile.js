// Подключаем библиотеки
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

// JS файлы проекта
const jsFiles = [
  'app/libs/jquery/dist/jquery.js',
  'app/libs/swiper/dist/js/swiper.js',
  'app/js/common.js',
];

// CSS файлы проекта
const cssFiles = [
  'app/css/main.css',
];

// Обработка стилей SASS
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

// Минификация CSS
function styles(done) {
  src(cssFiles)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
  done();
}

// Обработка скриптов
function scripts(done) {
  src(jsFiles)
    .pipe(concat('build.js'))
    .pipe(uglify()) // Сжимаем
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
  done();
}

// Запуск сервера
function serve(done) {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
  done();
}

// Слежение за изменениями
function watcher(done) {
  watch(['app/*.html','app/sass/**/*','app/js/common.js']).on('change', series(styles, scripts));
  done();
}

// Экспорт
exports.watcher = watcher;
exports.styles = styles;
exports.scripts = scripts;
exports.default = series(styles, scripts, serve, watcher);
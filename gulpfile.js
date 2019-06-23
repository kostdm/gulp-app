// Подключаем библиотеки
const { src, dest, watch, parallel, series } = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

// JS файлы проекта
const jsFiles = [
  'app/libs/jquery/dist/jquery.js',
  'app/js/custom.js',
];

// Стили
function styles(done){
  src('app/sass/main.sass')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
  done();
}

// Скрипты
function scripts(done) {
  src(jsFiles)
    .pipe(concat('build.js'))
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
  done();
}

// Сборка проекта
function build(done){
  const cssFiles = src('app/css/main.css')
                    .pipe(cssnano({discardComments: {removeAll: true}}))
                    .pipe(dest('dist/css'));
  const jsFiles = src('app/js/build.js')
                    .pipe(uglify())
                    .pipe(dest('dist/js'));
  const htmlFiles = src('app/**/*.html')
                      .pipe(dest('dist'));
  const fontsFiles = src('app/fonts/**/*')
                      .pipe(dest('dist/fonts'));
  const imagesFiles = src('app/images/**/*')
                        .pipe(imagemin())
                        .pipe(dest('dist/images'));
  done();
}

function cleanDist(done){
  del.sync('dist');
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
  watch('app/sass/**/*').on('change', parallel(styles));
  watch('app/js/custom.js').on('change', parallel(scripts));
  watch('app/*.html').on('change', browserSync.reload);
  done();
}

// Экспорт
exports.styles = styles;
exports.scripts = scripts;
exports.watcher = watcher;
exports.build = series(cleanDist, parallel(styles, scripts), build);
exports.default = series(parallel(styles, scripts), serve, watcher);
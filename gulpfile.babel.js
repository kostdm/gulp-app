// Подключаем библиотеки
import { src, dest, watch, series, parallel } from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import del from 'del';
import cssnano from 'gulp-cssnano';
import imagemin from 'gulp-imagemin';
import browserSync from 'browser-sync';browserSync.create();

// JS файлы проекта
const jsFiles = [
  'app/libs/jquery/dist/jquery.js',
  'app/libs/bootstrap/dist/js/bootstrap.js',
  'app/js/custom.js',
];

// Стили
function styles(){
  return src('app/sass/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}

// Скрипты
function scripts() {
  return src(jsFiles)
    .pipe(concat('build.js'))
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}

// Чистим файлы
function clean(done){
  del.sync(['app/css/main.css','app/js/build.css']);
  done();
}

// Сборка проекта
function build(done){
  // src('app/sass/main.sass')
  //   .pipe(sass({outputStyle: 'expanded'}))
  //   .pipe(autoprefixer())
  //   .pipe(cssnano({discardComments: {removeAll: true}}))
  //   .pipe(dest('dist/css'));

  src('app/css/main.css')
    .pipe(cssnano({discardComments: {removeAll: true}}))
    .pipe(dest('dist/css'));

  src('app/js/build.js')
    .pipe(uglify())
    .pipe(dest('dist/js'));

  src('app/**/*.html')
    .pipe(dest('dist'));

  src('app/fonts/**/*')
    .pipe(dest('dist/fonts'));

  src('app/images/**/*')
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
exports.build = series(clean, cleanDist, parallel(styles, scripts), build);
exports.default = series(clean, parallel(styles, scripts), serve, watcher);

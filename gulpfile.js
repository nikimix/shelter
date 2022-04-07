const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require("gulp-sourcemaps");
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');
const csso = require('postcss-csso')
const rename = require('gulp-rename');
const terser = require('gulp-terser');
const squoosh = require('gulp-libsquoosh');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const del = require('del');

const styles = () => {
  return gulp.src('src/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso(),
    ]))
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('shelter/css'))
    .pipe(sync.stream());
};
exports.styles = styles;
const htmlMin = () => {
  return gulp.src('src/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('shelter'));
};
exports.htmlMin = htmlMin;

const scriptMin = () => {
  return gulp.src('src/js/*.js')
    .pipe(terser())
    .pipe(rename('script.min.js'))
    .pipe(gulp.dest('shelter/js'))
};
exports.scriptMin = scriptMin;
const optimizeImg = () => {
  return gulp.src('src/img/*.{jpg,png,svg}')
    .pipe(squoosh())
    .pipe(gulp.dest('shelter/img'))
};
exports.optimizeImg = optimizeImg;
const createWebp = () => {
  return gulp.src('src/img/*.{jpg,png}')
    .pipe(webp({
      quality: 90
    }))
    .pipe(gulp.dest('shelter/img'))
};
exports.createWebp = createWebp;
const createSprite = () => {
  return gulp.src('src/img/icons/*.svg')
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('shelter/img/icons'))
};
exports.createSprite = createSprite;
const copy = (done) => {
  gulp.src([
      'src/fonts/*.{woff,woff2}',
      'src/*.ico',
      'src/js/*.js',
    ], {
      base: 'src'
    })
    .pipe(gulp.dest('shelter'))
  done();
}
exports.copy = copy;
const clean = () => {
  return del('shelter');
};
exports.clean = clean;
const server = (done) => {
  sync.init({
    server: {
      baseDir: 'shelter',
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};
exports.server = server;
const watcher = () => {
  gulp.watch('src/sass/**/*.scss', gulp.series('styles'));
  gulp.watch('src/**/*.html').on('change', sync.reload);
};
exports.watcher = watcher;
exports.default = gulp.series(styles, server, watcher);
const build = gulp.series(
  clean,
  copy,
  optimizeImg,
  createSprite,
  // createWebp,
  gulp.parallel(
    styles,
    htmlMin,
    // scriptMin,
  )
)
exports.build = build;

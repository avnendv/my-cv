"use strict";

const { src, dest, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync");
const uglify = require("gulp-uglify");
const fileInclude = require("gulp-file-include");
const minifyCss = require("gulp-clean-css");
const rename = require("gulp-rename");
const image = require("gulp-image");

const pathRoot = "./app/";
const pathDestBuild = "./build/";

// server
function server() {
  browserSync.init({
    server: pathDestBuild,
  });
}

// Task buildStyleBootstrap
function buildStylesLibs() {
  return src([`${pathRoot}assets/scss/libs/*.scss`])
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(
      minifyCss({
        compatibility: "ie8",
        level: { 1: { specialComments: 0 } },
      })
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest(`${pathDestBuild}assets/css/libs/`))
    .pipe(browserSync.stream());
}
exports.buildStylesLibs = buildStylesLibs;

// Task build styles
function buildStyles() {
  return src(`${pathRoot}assets/scss/style.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(sourcemaps.write())
    .pipe(dest(`${pathDestBuild}assets/css/`))
    .pipe(browserSync.stream());
}
exports.buildStyles = buildStyles;

// Task build styles pages
function buildStylesPages() {
  return src(`${pathRoot}assets/scss/pages/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(sourcemaps.write())
    .pipe(dest(`${pathDestBuild}assets/css/pages/`))
    .pipe(browserSync.stream());
}
exports.buildStylesPages = buildStylesPages;

// Task compress lib js & mini file
function compressLibraryJsMin() {
  return src(
    [
      "./node_modules/jquery/dist/jquery.js",
      "./node_modules/aos/src/js/aos.js",
      "./node_modules/bootstrap/dist/js/bootstrap.bundle.js",
    ],
    { allowEmpty: true }
  )
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest(`${pathDestBuild}assets/js/libs/`))
    .pipe(browserSync.stream());
}
exports.compressLibraryJsMin = compressLibraryJsMin;

// task build js page
function buildJsPageMin() {
  return src(`${pathRoot}assets/js/pages/*.js`, { allowEmpty: true })
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest(`${pathDestBuild}assets/js/pages/`))
    .pipe(browserSync.stream());
}
exports.buildJsPageMin = buildJsPageMin;

// Task optimize images
function optimizeImages() {
  const imgSrc = `${pathRoot}assets/images/**/*.+(png|jpg|webp|svg|gif)`;
  const imgDst = `${pathDestBuild}assets/images`;

  return src(imgSrc)
    .pipe(image())
    .pipe(dest(imgDst))
    .pipe(browserSync.stream());
}
exports.optimizeImages = optimizeImages;

// Task include HTML
function includeHTML() {
  return src([`${pathRoot}pages/*.html`])
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
        indent: true,
      })
    )
    .pipe(dest(pathDestBuild))
    .pipe(browserSync.stream());
}
exports.includeHTML = includeHTML;

// build app first
function buildAppFirst() {
  buildStylesLibs();
  buildStyles();
  buildStylesPages();
  buildJsPageMin();
  optimizeImages();
  includeHTML();
  compressLibraryJsMin();
  watchTask();
}
exports.buildAppFirst = buildAppFirst;

// build app deploy
function buildAppDeploy(cb) {
  buildStylesLibs();
  buildStyles();
  buildStylesPages();
  buildJsPageMin();
  optimizeImages();
  includeHTML();
  compressLibraryJsMin();
  cb();
}
exports.buildAppDeploy = buildAppDeploy;

// Task watch
function watchTask() {
  server();

  // watch style
  watch(`${pathRoot}assets/scss/libs/*.scss`, buildStylesLibs);
  watch(
    [
      `${pathRoot}assets/scss/**/*.scss`,
      `!${pathRoot}assets/scss/libs/*.scss`,
      `!${pathRoot}assets/scss/pages/*.scss`,
    ],
    buildStyles
  );
  watch(`${pathRoot}assets/scss/pages/*.scss`, buildStylesPages);

  // watch js
  watch(`${pathRoot}assets/js/**/*.js`, buildJsPageMin);

  // watch images
  watch(`${pathRoot}assets/images/**/*`, optimizeImages);

  // watch HTML
  watch(`${pathRoot}**/*.html`, includeHTML);

  // watch liveReload
  watch(
    [
      `${pathDestBuild}*.html`,
      `${pathDestBuild}**/*.css`,
      `${pathDestBuild}**/*.js`,
      `${pathDestBuild}assets/images/**/*`,
    ],
    browserSync.reload({ stream: true })
  );
}
exports.watchTask = watchTask;

"use strict";

const { src, dest } = require("gulp");
const gulp = require("gulp");

const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const rigger = require("gulp-rigger");
const plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");
const del = require("del");
const browserSync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");
const sassglob = require("gulp-sass-glob");
const webp = require("gulp-webp");
const webphtml = require("gulp-webp-html-nosvg");
const changed = require("gulp-changed");

// Paths
const srcPath = "src/";
const distPath = "dist/";

const path = {
    build: {
        html: distPath,
        css: distPath + "assets/css/",
        js: distPath + "assets/js/",
        image: distPath + "assets/img/",
        fonts: distPath + "assets/fonts/",
    },
    src: {
        html: srcPath + "*.html",
        css: srcPath + "assets/scss/*.scss",
        js: srcPath + "assets/js/*.js",
        image: srcPath + "assets/img/**/*",
        fonts: srcPath + "assets/fonts/**/*",
    },
    watch: {
        html: srcPath + "**/*.html",
        css: srcPath + "assets/scss/**/*.scss",
        js: srcPath + "assets/js/**/*.js",
        image: srcPath + "assets/img/**/*",
        fonts: srcPath + "assets/fonts/**/*",
    },
    clean: "./" + distPath,
};

function serve() {
    browserSync.init({
        server: {
            baseDir: "./" + distPath,
        },
    });
}

function html() {
    return src(path.src.html, { base: srcPath })
        .pipe(plumber())
        .pipe(
            fileinclude({
                prefix: "@@",
                basepath: "@file",
            })
        )
        // .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browserSync.reload({ stream: true }));
}

function css() {
    return src(path.src.css, { base: srcPath + "assets/scss" })
        .pipe(
            plumber({
                errorHandler: function (err) {
                    console.log(err);
                    this.emit("end");
                },
            })
        )
        .pipe(sassglob())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(
            cssnano({
                zindex: false,
                discardComments: {
                    removeAll: true,
                },
            })
        )
        .pipe(removeComments())
        .pipe(
            rename({
                suffix: ".min",
                extname: ".css",
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browserSync.reload({ stream: true }));
}

function js() {
    return src(path.src.js, { base: srcPath + "assets/js" })
        .pipe(plumber())
        .pipe(rigger())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(
            rename({
                suffix: ".min",
                extname: ".js",
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({ stream: true }));
}

function images() {
    return (
        src(path.src.image, { base: srcPath + "assets/img" })
            // return src("src/assets/img/*", { base: srcPath + "assets/img" })
            .pipe(changed(path.build.image))
            .pipe(
                imagemin([
                    imagemin.gifsicle({ interlaced: true }),
                    imagemin.mozjpeg({ quality: 80, progressive: true }),
                    imagemin.optipng({ optimizationLevel: 5 }),
                    imagemin.svgo({
                        plugins: [
                            { removeViewBox: true },
                            { cleanupIDs: false },
                        ],
                    }),
                ])
            )
            .pipe(dest(path.build.image))
            .pipe(webp())
            .pipe(dest(path.build.image))
            .pipe(browserSync.reload({ stream: true }))
    );
}
function imagesDev() {
    return src(path.src.image, { base: srcPath + "assets/img" })
        .pipe(changed(path.build.image))
        .pipe(dest(path.build.image))
        .pipe(
            webp({
                quality:80,
            })
        )
        .pipe(dest(path.build.image))
        .pipe(browserSync.reload({ stream: true }));
}

function fonts() {
    return src(path.src.fonts, { base: srcPath + "assets/fonts" })
        .pipe(dest(path.build.fonts))
        .pipe(browserSync.reload({ stream: true }));
}

function clean() {
    return del(path.clean);
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.fonts], fonts);
    gulp.watch([path.watch.image], imagesDev);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, fonts, images));
const watch = gulp.parallel(build, watchFiles, serve);

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.imagesDev = imagesDev;
exports.fonts = fonts;
exports.clean = clean;
exports.serve = serve;
exports.build = build;
exports.watch = watch;
exports.default = watch;

// rigger
// //= components/script.js

// HTML
// @@include('./view.html')

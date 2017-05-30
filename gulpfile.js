const gulp = require('gulp');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const min_css = require('gulp-clean-css');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const maps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const series = require('run-sequence');
const connect = require('gulp-connect');

// Concatenate
gulp.task("concat", function () {
    return gulp.src("./js/**/*.js")
        .pipe(maps.init())
        .pipe(concat('all.min.js'))
        .pipe(maps.write("./maps"))
        .pipe(gulp.dest("./target/scripts"));
});

// Minify
gulp.task("minify", ['concat'], function () {
    return gulp.src("./target/scripts/all.min.js")
        .pipe(uglify())
        .pipe(gulp.dest("./target/scripts"));
});

// Scripts (Concat, Mini, Copy)
gulp.task("scripts", ['minify'], function() {
    return gulp.src(["./target/scripts/all.min.js","./target/scripts/maps/all.min.js.map"], {base: './target'})
        .pipe(gulp.dest("./dist"));
});


// SCSS
gulp.task('sass', function() {
    return gulp.src("./sass/global.scss")
        .pipe(maps.init())
        .pipe(sass())
        .pipe(maps.write("./maps"))
        .pipe(gulp.dest("target/styles"));
});

// Minify SCSS
gulp.task('minify_sass', ['sass'],function() {
    return gulp.src("target/styles/global.css")
        .pipe(min_css())
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest("target/styles"));
});

// Styles
gulp.task("styles", ['minify_sass'], function() {
    return gulp.src(["./target/styles/**"], {base: './target'})
        .pipe(gulp.dest("./dist"));
});


// Images
gulp.task("images", function() {
    return gulp.src('images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/content'));
});


// Clean
gulp.task("clean", function() {
    return gulp.src(["./dist","./target"])
        .pipe(clean({force: clean}));
});



// Build
gulp.task('build',['clean'],function(callback) {
    gulp.src("./index.html")
        .pipe(gulp.dest("./dist"));
    return series(['scripts','styles','images'],
    callback);
    });

// Serve
gulp.task('serve',function() {
    return connect.server({
        root: 'dist',
        livereload: true
    });
})

// Default
gulp.task('default',['build'], function() {
 gulp.start('serve');
});
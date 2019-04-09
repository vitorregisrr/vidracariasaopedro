var gulp = require('gulp'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    gzip = require('gulp-gzip'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify-es').default;


const mincss = () => {
    gulp.src('./app/public/css/main.css')
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./app/public/css/'));
}

gulp.task('sass', async () => {
    gulp.src('./app/public/scss/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('./app/public/css/')),
        mincss()
});

gulp.task('listensass', async () => {
    gulp.watch('./app/public/scss/**/*.scss', gulp.series('sass'))
});

gulp.task('mincss', async () => {
    mincss();
})

gulp.task('gzipcss', async () => {
    gulp.src('./app/public/css/main.css')
        .pipe(gzip())
        .pipe(gulp.dest('./app/public/css/'));
})

gulp.task('jsmin', async () => {
    gulp.src('./app/public/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./app/public/js'));
})

gulp.task('gzipjs', async () => {
    gulp.src('./app/public/js/main.js')
        .pipe(gzip())
        .pipe(gulp.dest('./js/'));
})

gulp.task('imagesmin', async () => {
    gulp.src('./app/public/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./app/public/images'));
});

gulp.task('towebp', async () => {
    gulp.src('./app/public/images/**/*')
        .pipe(webp({ quality: 100 }))
        .pipe(gulp.dest('./app/public/images'))
});
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

// gulp.task('styles', function() {
//     gulp.src('sass/**/*.scss')
//         .pipe(sass().on('error', sass.logError))
//         .pipe(gulp.dest('./css/'));
// });
// 
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});
gulp.task('sass', function() {
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


//Watch task
// gulp.task('default', function() {
//     gulp.watch('sass/**/*.scss',['styles']);
// });
gulp.task('default', ['browser-sync', 'sass'], function() {
    gulp.watch('sass/**/*.scss',['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("javascript/**/*.js").on('change', browserSync.reload);
});
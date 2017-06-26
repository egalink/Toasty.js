var gulp = require('gulp');
var uglifyjs = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var pump = require('pump');

gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('compress', function (cb) {
    
    // uglify the js:
    pump([
        gulp.src('./src/*.js'),
        uglifyjs(),
        gulp.dest('./dist/')
    ], cb);

    // uglify the css:
    gulp.src('./src/*.css')
    .pipe(uglifycss({
        "maxLineLen": 80,
        "uglyComments": true
    }))
    .pipe(gulp.dest('./dist/'));
});

var watcher = gulp.watch('./src/*', ['compress']);
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
var gulp = require ('gulp'),
	livereload = require('gulp-livereload');

//Watch task
//Watches js/css
gulp.task('watch', function() {

	livereload.listen();

	gulp.watch('*').on('change', livereload.changed);
	gulp.watch('*/*').on('change', livereload.changed);
});

gulp.task('default', ['watch']);
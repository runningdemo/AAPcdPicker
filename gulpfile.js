var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('browser', function(){
	browserSync.init(null, {
		server: {
			baseDir: './',
			index: "./index.html",
		}
	});
})

gulp.task('bs-reload', function(){
	browserSync.reload();
})

gulp.task('watch',function(){
	gulp.watch('./pikadate.html', ['bs-reload']);
	gulp.watch('./css/**', ['bs-reload']);
	gulp.watch('./js/**', ['bs-reload']);
})



gulp.task('default',['browser', 'watch'],function(){

});

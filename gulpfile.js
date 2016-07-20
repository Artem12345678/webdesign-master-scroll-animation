var gulp 		= require('gulp'),
	browserSync = require('browser-sync'),
	cssnano     = require('gulp-cssnano'),
	rename	    = require('gulp-rename'),
	concat      = require('gulp-concat'),
	uglify      = require('gulp-uglify'),
	del			= require('del'),
	autoprefixer = require('gulp-autoprefixer');

gulp.task('css', function() {
	return gulp.src('app/css/main.css')
	.pipe(autoprefixer({
			browsers: ['last 15 versions',
					   '> 1%',
					   'ie 8',
					   'ie 7'
		   			  ], 
			cascade:true
		}))
	.pipe(cssnano())
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({
		stream: true
	}))
})

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		port: 8080
	})
});

gulp.task('js', function() {
	return gulp.src([
			'app/js/**/*.js', 
			'!app/js/**/common.min.js',
			'!app/js/**/common.js'
			])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
});

gulp.task('buildJs', function() {
	return gulp.src('app/js/**/common.js')
	.pipe(uglify())
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest('app/js'))
})

gulp.task('clean', function () {
	return del.sync('dist')
});

gulp.task('watch', ['browser-sync', 'css','js','buildJs'], function() {
	gulp.watch('app/css/main.css', ['css']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/common.js', browserSync.reload);
})

gulp.task('build',['clean','css','js','buildJs'] , function() {

	var buildCss = gulp.src([
			'app/css/main.min.css',
			'app/css/animate.min.css'
		])
	.pipe(gulp.dest('dist/css'));

	var buildHTML = gulp.src('app/*.html')
	.pipe(gulp.dest('dist/'))

	var buildImg = gulp.src('app/images/**')
    .pipe(gulp.dest('dist/images'))

    var buildJS = gulp.src([
			'app/js/common.min.js',
			'app/js/libs.min.js'
		])
    .pipe(gulp.dest('dist/js'))
})

const
	gulp = require('gulp'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	del = require('del'),
	browserify = require('browserify'),
	babelify = require('babelify'),
	// vinylTransform = require('vinyl-transform'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	tap = require('gulp-tap'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	eslint = require('gulp-eslint'),
	runSequence = require('gulp-sequence');

gulp.task(
	'default',
	callback => {

		runSequence(
			'clean',
			'eslint',
			'javascript',
			'browserify'
		)(callback);

	}
);

gulp.task(
	'clean',
	() => del([
		'dist/*',
	])
);

gulp.task(
	'eslint',
	() =>

		gulp.src(['src/**/*.js'])
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failAfterError())

);

gulp.task(
	'javascript',
	() =>
		gulp.src([
			// 'node_modules/@babel/polyfill/dist/polyfill.min.js',
			'src/**/*.js'
		])
			.pipe(sourcemaps.init())
			.pipe(concat('app.min.js'))
			.pipe(babel({
				presets: [
					[
						'@babel/preset-env',
						{
							targets: 'last 5 major versions',
							useBuiltIns: 'usage'
						}
					]
				]
			}))
			.pipe(sourcemaps.write('maps'))
			.pipe(gulp.dest('./_tmp'))
);

gulp.task(
	'browserify',
	() =>
		browserify({
			entries: ['./_tmp/dist/app.min.js'],
			debug: true
		})
			.transform('babelify', {
				presets: [
					'@babel/preset-env'
				]
			})
			.bundle()
			.pipe(source('app.min.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(uglify({mangle: false}))
			.pipe(sourcemaps.write('./maps'))
			.pipe(gulp.dest('./dist'))
);

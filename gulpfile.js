
const
	gulp = require('gulp'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	eslint = require('gulp-eslint');

gulp.task(
	'eslint',
	() =>

		gulp.src(['src/**/*.js'])
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failAfterError())

);

gulp.task(
	'default',
	['eslint'],
	() =>
		gulp.src([
			'node_modules/@babel/polyfill/dist/polyfill.min.js',
			'src/**/*.js'
		])
			.pipe(concat('app.min.js'))
			.pipe(babel({
				// plugins: ['@babel/transform-runtime'],
				presets: [
					'@babel/preset-env',
					// {
					// 	useBuiltIns: 'entry'
					// }
				]
			}))
			.pipe(gulp.dest('dist'))
);
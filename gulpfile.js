
const
	gulp = require('gulp'),
	babel = require('gulp-babel'),
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
		gulp.src('src/**/*.js')
			.pipe(babel({
				presets: ['es2015'],
				plugins: [
					'transform-runtime'
					// 'transform-es2015-arrow-functions'
				]
			}))
			.pipe(gulp.dest('dist'))
);
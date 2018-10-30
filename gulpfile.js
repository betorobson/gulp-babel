
const
	gulp = require('gulp'),
	{ task, series, parallel } = require('gulp'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	del = require('del'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	sourcemaps = require('gulp-sourcemaps'),
	// uglify = require('gulp-uglify'),
	eslint = require('gulp-eslint'),
	// runSequence = require('gulp-sequence'),
	cached = require('gulp-cached'),
	remember = require('gulp-remember');

task(
	'clean',
	(cb) => {
		del([
			'dist/*',
		]);

		cb();
	}
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
		]
		// {since: gulp.lastRun('scripts')}
		)
			.pipe(cached('scripts'))
			.pipe(remember('scripts'))
			.pipe(sourcemaps.init())
			.pipe(concat('app.min.js'))
			// .pipe(babel({
			// 	presets: [
			// 		[
			// 			'@babel/preset-env',
			// 			{
			// 				targets: 'last 5 major versions',
			// 				useBuiltIns: 'usage'
			// 			}
			// 		]
			// 	]
			// }))
			.pipe(sourcemaps.write('maps'))
			.pipe(gulp.dest('./_tmp'))
);

gulp.task(
	'browserify',
	() =>
		browserify({
			entries: ['./_tmp/app.min.js'],
			debug: true
		})
			.transform('babelify', {
				presets: [
					'@babel/preset-env',
					{
						compact: true
					}
				]
			})
			.bundle()
			.pipe(source('app.min.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			// .pipe(uglify({mangle: false}))
			.pipe(sourcemaps.write('./maps'))
			.pipe(gulp.dest('./dist'))
);

task(
	'default',
	series(
		'clean',
		// 'eslint',
		'javascript'
		// 'browserify'
	)
);

gulp.task(
	'watcher',
	function () {

		var watcher = gulp.watch(
			'src/**/*.js',
			// { events: 'all' },
			gulp.series(
				'javascript'
				// 'browserify'
			)
		);

		watcher.on('change', function (path) {

			console.log('[watch2] -> ' + path);

			// if (event.type === 'deleted') {                   // if a file is deleted, forget about it
			// 	delete cached.caches.scripts[event.path];       // gulp-cached remove api
			// 	remember.forget('scripts', event.path);         // gulp-remember remove api
			// }

		});

	}
);

task(
	'watch',
	series(
		'default',
		'watcher'
	),
	(cb) => {

		cb();

		// runSequence(
		// 	'clean',
		// 	'eslint',
		// 	'javascript',
		// 	'browserify'
		// )(callback);

	}
);

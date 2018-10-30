
const
	gulp = require('gulp'),
	{ task, series } = require('gulp'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	del = require('del'),
	browserify = require('browserify'),
	bro = require('gulp-bro'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	sourcemaps = require('gulp-sourcemaps'),
	// uglify = require('gulp-uglify'),
	eslint = require('gulp-eslint'),
	// runSequence = require('gulp-sequence'),
	cached = require('gulp-cached'),
	gulpDebug = require('gulp-debug'),
	transform = require('vinyl-transform'),
	remember = require('gulp-remember');

var browserified = transform(function(filename) {
	var b = browserify(filename);
	return b.bundle();
});

gulp.task(
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
			.pipe(cached('eslint'))
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failAfterError())
			.pipe(remember('eslint'))

);

gulp.task(
	'javascript',
	() =>
		gulp.src([
			// 'node_modules/@babel/polyfill/dist/polyfill.min.js',
			'src/**/*.js',
			// '_tmp/src/**/*.js'
		]
		// {since: gulp.lastRun('scripts')}
		)
			.pipe(sourcemaps.init())
			.pipe(cached('scripts'))
			.pipe(gulpDebug({title: 'javascriptSrcBuild'}))
			.pipe(babel({
				presets: [
					[
						'@babel/preset-env',
						{
							targets: [
								'last 5 chrome version',
								'last 5 safari version'
							],
							useBuiltIns: 'usage'
						}
					]
				]
			}))
			.pipe(remember('scripts'))
			.pipe(concat('app.min.js'))
			// .pipe(browserified)
			.pipe(sourcemaps.write('maps'))
			.pipe(gulp.dest('./dist'))
			// .pipe(bro())
);

gulp.task(
	'browserify',
	() =>

		browserify({
			entries: './dist/app.min.js',
			debug: true
		})
			.bundle()
			.pipe(source('app.min.bundle.js'))
			.pipe(buffer())
			.pipe(gulp.dest('./dist'))

	// browserify({
	// 	entries: ['./_tmp/app.min.js'],
	// 	debug: true
	// })
	// 	.transform('babelify', {
	// 		compact: true,
	// 		presets: [
	// 			'@babel/preset-env',
	// 			{
	// 				useBuiltIns: 'usage'
	// 			}
	// 		]
	// 	})
	// 	.bundle()
	// 	.pipe(source('app.min.js'))
	// 	.pipe(buffer())
	// 	.pipe(sourcemaps.init({loadMaps: true}))
	// 	// .pipe(uglify({mangle: false}))
	// 	.pipe(sourcemaps.write('./maps'))
	// 	.pipe(gulp.dest('./dist'))
);

task(
	'default',
	series(
		'clean',
		'eslint',
		'javascript'
		// 'browserify'
	)
);

gulp.task(
	'watcher',
	function () {

		var watcher = gulp.watch(
			'src/**/*.js',
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

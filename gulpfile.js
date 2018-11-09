
const
	gulp = require('gulp'),
	{ task, series } = require('gulp'),
	babel = require('gulp-babel'),
	babelify = require('babelify'),
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
	remember = require('gulp-remember'),
	webpack = require('webpack-stream');

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
			'tmp-modules/src/app.js',
			'tmp-modules/src/config/*.js',
			'tmp-modules/src/**/!(*.config).js', // select modules declarations first
			'tmp-modules/src/**/*.config.js', // select modules config
			'tmp-modules/src/**/*.run.js', // select modules run
			'tmp-modules/src/legacy.js'
			// 'node_modules/@babel/polyfill/dist/polyfill.min.js',
			// 'src/**/*.js',
			// '!src/app.js',
			// 'tmp-modules/src/**/*.js'
		])
			.pipe(webpack( require('./webpack.config.js') ))
			// .pipe(sourcemaps.init())
			// .pipe(cached('scripts'))
			// .pipe(gulpDebug({title: 'javascriptSrcBuild'}))
			// .pipe(remember('scripts'))
			// .pipe(concat('app.min.js'))
			// .pipe(babel())
			// .pipe(browserified)
			// .pipe(sourcemaps.write('maps'))
			.pipe(gulp.dest('./dist'))
);

gulp.task(
	'browserify',
	() =>

		browserify({
			entries: './dist/app.min.js',
			debug: true
		})
			.transform(babelify)
			.bundle()
			.pipe(source('app.min.bundle.js'))
			.pipe(buffer())
			.pipe(gulp.dest('./dist'))
);

task(
	'default',
	series(
		'clean',
		'eslint',
		'javascript',
		'browserify'
	)
);

gulp.task(
	'watcher',
	function () {

		var watcher = gulp.watch(
			[
				'src/**/*.js',
				'tmp-modules/src/**/*.js',
			],
			gulp.series(
				'javascript',
				'browserify'
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

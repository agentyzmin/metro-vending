var gulp = require('gulp');

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var child = require('child_process');
var gutil = require('gulp-util');

var siteRoot = '_site';
var cssFiles = '_scss/**/*.*';

gulp.task('css', () => {
  gulp.src(cssFiles)
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('jekyll', () => {
  var jekyll = child.spawn('jekyll', ['build',
    '--watch',
    '--incremental'
  ]);

  var jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('watch', () => {
  gulp.watch(cssFiles, ['css']);
});

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 5050,
    server: {
      baseDir: siteRoot
    },
    open: false,
    notify: false
  });

  gulp.watch(cssFiles, ['css']);
});

gulp.task('default', ['css', 'jekyll', 'serve']);

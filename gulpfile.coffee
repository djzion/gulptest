gulp = require 'gulp'
gutil = require 'gulp-util'

sass = require 'gulp-ruby-sass'
jade = require 'gulp-jade'
connect = require 'gulp-connect'
coffeelint = require 'gulp-coffeelint'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
uglify = require 'gulp-uglify'
clean = require 'gulp-clean'
runSequence = require 'run-sequence'
commonJs = require 'gulp-wrap-commonjs'
bower = require 'gulp-bower-files'

# CONFIG ---------------------------------------------------------

isProd = gutil.env.type is 'prod'

sources =
  sass: 'src/sass/*.sass'
  html: 'index.html'
  coffee: 'src/**/*.coffee'
  js: 'src/**/*.js'
  templates: 'src/**/*.jade'
  bower: 'bower_components/*/index.js'

# dev and prod will both go to dist for simplicity sake
destinations =
  css: 'dist/css'
  html: 'dist/'
  js: 'dist/js'
  templates: 'dist/js'

modulePath = (path) ->
  path = path.replace(__dirname + '/src/', '')
  path = path.replace /.(js|coffee|jade)$/, ''
  path

# TASKS -------------------------------------------------------------

gulp.task 'connect', connect.server(
  root: ['dist'] # this is the directory the server will run
  port: 1337
  livereload: true
  open:
    browser: 'chromium-browser' # change that to the browser you're using
)

gulp.task 'style', ->
  gulp.src(sources.sass)
  .pipe(sass(trace: true))
  .pipe(gulp.dest(destinations.css))
  .pipe(connect.reload())

gulp.task 'html', ->
  gulp.src(sources.html)
  .pipe(gulp.dest(destinations.html))
  .pipe(connect.reload())

gulp.task 'templates', ->
  gulp.src(sources.templates)
    .pipe(jade({client: true}))
    .pipe(commonJs(
        pathModifier: modulePath, moduleExports: 'template'
    ))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(destinations.templates))

# I put linting as a separate task so we can run it by itself if we want to
gulp.task 'lint', ->
  gulp.src(sources.coffee)
  .pipe(coffeelint())
  .pipe(coffeelint.reporter())

gulp.task 'src', ->
  gulp.src(sources.coffee)
  .pipe(coffee({bare: true}).on('error', gutil.log))
  .pipe(commonJs(
      pathModifier: modulePath
  ))
  .pipe(concat('app.js'))
  .pipe(if isProd then uglify() else gutil.noop())
  .pipe(gulp.dest(destinations.js))
  .pipe(connect.reload())

  gulp.src(sources.js)
  .pipe(gulp.dest(destinations.js))

gulp.task 'watch', ->
  gulp.watch sources.sass, ['style']
  gulp.watch sources.app, ['lint', 'src', 'html', 'templates']
  gulp.watch sources.html, ['html']

gulp.task 'clean', ->
  gulp.src(['dist/'], {read: false}).pipe(clean())

gulp.task 'build', ->
  runSequence 'clean', ['style', 'src', 'html', 'templates', 'bower-files']

gulp.task 'bower-files', ->
  bower()
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/js/'))

gulp.task 'default', [
  'build'
  'connect'
  'watch'
]
const { series, parallel, src, dest, watch } = require('gulp'),
  sass = require('gulp-sass')(require('sass')),
  concat = require('gulp-concat'),
  merge2 = require('merge2'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanDest = require('gulp-clean-dest'),
  eslint = require('gulp-eslint'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  svgmin = require('gulp-svgmin'),
  through2 = require('through2'),
  log = require('fancy-log'),
  minimist = require('minimist')(process.argv.slice(2))

const config = {
  project: 'app',
  srcPath: 'src/',
  publicPath: 'static/',
  forProduction: minimist.prod,
}

let location = {
  compiled: {
    css: config.publicPath + 'css/',
    js: config.publicPath + 'js',
  },
  sources: {
    jsVendors: ['node_modules/gsap/dist/gsap.js', 'node_modules/gsap/dist/ScrollTrigger.js', config.srcPath + 'js/vendor/*.js'],
    jsApp: config.srcPath + 'js/*.js',
    css: [config.srcPath + 'sass/app.s*ss'],
    frameworks: ['node_modules/bootstrap/scss'],
  },
}

const handleError = (err) => {
  log.error('\n\n' + '  |   Error: ' + err.messageOriginal + ' /// line: ' + err.line + '/' + err.column + '\n' + '  |   In file: ' + err.file + '\n')
  this.emit('end')
}

const css = () => {
  return src(location.sources.css)
    .pipe(config.forProduction ? through2.obj() : sourcemaps.init())
    .pipe(config.forProduction ? sass({ includePaths: location.sources.frameworks, outputStyle: 'compressed' }).on('error', handleError) : sass({ includePaths: location.sources.frameworks }).on('error', handleError))
    .pipe(autoprefixer())
    .pipe(concat(config.project + '.css'))
    .pipe(cleanDest(location.compiled.css))
    .pipe(config.forProduction ? through2.obj() : sourcemaps.write('maps'))
    .pipe(dest(location.compiled.css))
}

const js = () => {
  return merge2(
    src(location.sources.jsVendors, { allowEmpty: true }),
    src(location.sources.jsApp)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(
        babel({
          presets: [['@babel/preset-env']],
        })
      )
  )
    .pipe(concat(config.project + '.js'))
    .pipe(config.forProduction ? uglify() : through2.obj())
    .pipe(cleanDest(location.compiled.js))
    .pipe(dest(location.compiled.js))
}

const svg = () => {
  return src(config.srcPath + 'svg/**/*.svg')
    .pipe(cleanDest(config.publicPath + 'svg'))
    .pipe(
      svgmin({
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
          {
            name: 'convertStyleToAttrs',
            active: false,
          },
          {
            name: 'cleanupIDs',
            active: false,
          },
        ],
      })
    )
    .pipe(dest(config.publicPath + 'svg'))
}

const w = () => {
  watch(config.srcPath + 'sass/**/*.s*ss', css)
  watch(config.srcPath + 'js/**/*.js', js)
  watch(config.srcPath + 'svg/**/*.svg', svg)
}

exports.default = parallel(css, js, svg)

exports.watch = series(parallel(css, js, svg), w)

exports.svgmin = svg

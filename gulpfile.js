const { src, dest, watch, series, parallel } = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const del = require('del')

const htmlmin = require('gulp-htmlmin')

const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const babel = require('gulp-babel')

const squoosh = require('gulp-squoosh')
function html(){
    return src('src/**/*.html' )
        .pipe( htmlmin({ collapseWhitespace: true, removeComments: true }) )
        .pipe( dest('docs') )
}

function css(){
    return src('src/css/**/*.css')
        .pipe( sourcemaps.init() )
        .pipe( postcss([ autoprefixer(), cssnano() ]) )
        .pipe( sourcemaps.write('.'))
        .pipe( dest('docs/css'))
}

function js(){
    return src('src/js/**/*.js')
        .pipe( sourcemaps.init() )
        .pipe( babel({ presets: ['@babel/env']}) )
        .pipe( sourcemaps.write('.') )
        .pipe( dest('docs/js'))
}

function images(){
    return src('src/images/**/*')
        .pipe( squoosh() )
        .pipe( dest('docs/images') )
} 

function assets(){
    
    return src(['src/**/*.ico', 'src/**/*.svg','src/**/*.txt', 'src/**/*.xml'])
        .pipe( dest('docs') )
}

function clean(){
    return del(['docs/**/*', '!docs'])
}

function dev(){
    watch('src/**/*.html', html)
    watch('src/css/**/*.css', css)
    watch('src/js/**/*.js', js)
    watch('src/images/**/*', images)
    watch('src/**/*.icon', assets)
}

exports.assets = assets
exports.images = images
exports.dev = dev
exports.clean = clean
exports.build = series(clean, parallel(html, css, js, images, assets))
exports.default = parallel(html, css, js)

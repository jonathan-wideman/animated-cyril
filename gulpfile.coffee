gulp = require 'gulp'
module.exports = gulp
coffee = require 'gulp-coffee'
rename = require 'gulp-rename'
browserify = require 'gulp-browserify'
serve = require 'gulp-serve'
zip = require 'gulp-zip'
del = require 'del'

package_data = require('./package.json')

# Function for compiling Scripts
buildScripts = ()->
    # Grab the Main.coffee file
    gulp.src("src/scripts/Main.coffee", {read: false})
        # Send it through browserify
        .pipe(browserify
            transform: ['coffeeify'], # Enable the coffeeify extension
            extensions: ['.coffee'] # Only read .coffee files
            debug: true
        )
        .on('error', (err)-> console.log err.message)
        .pipe(rename('Main.js')) # Rename our output stream to be "Main.js"
        .pipe(gulp.dest('build/js')) # Finally set the destination to be the "build/js" folder.
        # this results in "build/js/Main.js"
    gulp.src("src/index.html")
        .pipe(gulp.dest('build'))
    gulp.src("assets/**", {"base": "."})
        .pipe(gulp.dest('build'))
    gulp.src("src/vendor/**", {"base": "src"})
        .pipe(gulp.dest('build/js'))


# Gulp Tasks are what you can call from the CLI. So, this
# definition exposes "gulp build"
gulp.task 'build', buildScripts

gulp.task 'watch', ()->
    # The Watch method watches for changes in the array of src files, and calls the following array of tasks anytime
    # the files are changed
    gulp.watch ['src/scripts/**/*.coffee', 'src/**/*.html'], ['build']

gulp.task 'dist', ()->
    gulp.src('build/**/*')
        .pipe(zip(package_data.name+"-"+package_data.version+'.zip'))
        .pipe(gulp.dest('dist'))

# This defines the "gulp serve" task. The "root" option
# specifies which folder is the web root. In this case, we had a "build" folder.
gulp.task 'serve', serve(
    root: ['build']
    port: 8000
)

gulp.task 'clean', ()->
    del [
        'build/'
    ]

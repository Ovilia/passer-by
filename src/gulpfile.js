var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var jade        = require('gulp-jade');

/**
 * Launch the Server
 */
gulp.task('browser-sync', ['sass'], function() {
    gulp.run('jade');
    browserSync({
        server: {
            baseDir: '.'
        }
    });
});

/**
 * Copy the bower packages
 */
gulp.task('vendor', function() {
    gulp.src(['bower_components/framework7/dist/js/framework7.js*'])
        .pipe(gulp.dest('js'));
    gulp.src([
        'bower_components/framework7/dist/css/framework7.*min.css',
        'bower_components/ionicons/css/ionicons.min.css'
        ])
        .pipe(gulp.dest('css'));
    gulp.src(['bower_components/framework7/dist/img/*'])
        .pipe(gulp.dest('img/framework7'));
    gulp.src(['bower_components/ionicons/fonts/*'])
        .pipe(gulp.dest('fonts'));
});

/**
 * Copy build files to android
 */
gulp.task('android', function(){
    gulp.src(['css/*']).pipe(gulp.dest('../android/app/assets/css'));
    gulp.src(['js/*']).pipe(gulp.dest('../android/app/assets/js'));
    gulp.src(['img/**']).pipe(gulp.dest('../android/app/assets/img'));
    gulp.src(['fonts/*']).pipe(gulp.dest('../android/app/assets/fonts'));
    gulp.src(['*.html']).pipe(gulp.dest('../android/app/assets/'));
});

/**
 * Compile files from _scss into css
 */
gulp.task('sass', function () {
    return gulp.src('_styles/main.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: function(e) {
                browserSync.notify();
                process.stdout.write(e + '\n');
            },
            outputStyle: 'compressed'
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('css'));
});

/**
 * Generate site using Jade
 */
gulp.task('jade', function() {
    gulp.src('*.jade')
        .pipe(jade())
        .pipe(gulp.dest('.'))
        .pipe(browserSync.reload({stream:true}))
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('_styles/*.scss', ['sass']);
    gulp.watch(['*.jade', 'js/*', 'css/*'], ['jade']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);

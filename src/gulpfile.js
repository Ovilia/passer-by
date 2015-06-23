var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var jade        = require('gulp-jade');
var clean       = require('gulp-clean');

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
        .pipe(gulp.dest('js/lib'));
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
 * Build and clean android and ios
 */
function build(destRoot) {
    var paths = ['css/*', 'fonts/*', 'js/**', '*.html'];
    var dest = ['css', 'fonts', 'js', '.']
    for (var path in paths) {
        gulp.src(paths[path]).pipe(gulp.dest(destRoot + dest[path]));
    }
}

var androidRoot = '../android/app/assets/';
gulp.task('android', function(){
    build(androidRoot);
});

var iosRoot = '../ios/passer-by/passer-by/www/';
gulp.task('ios', function(){
    build(iosRoot);
});

gulp.task('build', function(){
    gulp.run('jade');
    gulp.run('sass');
    gulp.run('android');
    gulp.run('ios');
});

gulp.task('clean', function() {
    return gulp.src([androidRoot, iosRoot], {read: false})
        .pipe(clean({force: true}));
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

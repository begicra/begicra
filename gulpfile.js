'use strict';


var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

var BROWSER_SYNC_RELOAD_DELAY = 1000;

gulp.task('default', ['browser-sync'], function(){
});

gulp.task('browser-sync', ['nodemon'], function(){
  browserSync.init(null, {
    proxy: "http://localhost:3000",
    files: ["bbs/templates/*.html", "dashboard/static/*.html"],
    browser: "google-chrome",
    port: 7000
  });
});

gulp.task('nodemon', function(cb){
  var started = false;

  return nodemon({
    script: 'index.js',
    ext: 'js html',
    env: {'NODE_ENV': 'development'}
  }).on('start', function(){
    if(!started){
      cb();
      started = true;
    }
  }).on('restart', function(){
    setTimeout(function(){
      browserSync.reload({
        stream: false
      });
    }, BROWSER_SYNC_RELOAD_DELAY);
  });
});

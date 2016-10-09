const gulp = require('gulp');
const spawn = require('child_process').spawn;

const setUpEvents = electron => {
  electron.stdout.on('data', e => console.log(e.toString()));
  electron.stderr.on('data', e => console.log(e.toString()));
  electron.on('error', e => console.log(e));
  electron.on('close', (e, code) => console.log(`=> Exited with code ${code || e}`));
}

gulp.task('watch', () => {
  let electron = spawn('node_modules/electron/dist/Electron.app/Contents/MacOS/Electron', ['.'], {
    cwd: __dirname
  });

  setUpEvents(electron);

  gulp.watch('src/**/*.js', e => {
    electron.kill('SIGHUP');

    electron = spawn('npm', ['start'], {
      cwd: __dirname
    });
    setUpEvents(electron);
  });
});

gulp.task('default', function() {
  // place code for your default task here
});

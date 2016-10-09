// @flow

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const settings = require('electron-settings');
const ApplicationMenu = require('./src/ApplicationMenu');

// Reload on changes
// require('electron-reload')(__dirname);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win, splashWin;

// Settings
settings.defaults({
  projects: {}
});

// Views
ipcMain.on('view/load', (event, url = `file://${__dirname}/public/index.html`) => {
  win.loadURL(url);
});
ipcMain.on('AddBot/OpenFileDialog', event => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, function (directory) {
    event.sender.send('AddBot/ReceiveDirectory', directory);
  });
});


function createSplashWin () {
  splashWin = new BrowserWindow({
    width: 1000,
    height: 750,
    show: false
  });

  splashWin.loadURL(`file://${__dirname}/public/splash.html`);

  splashWin.once('ready-to-show', () => {
    splashWin.show();
    createWindow();
  });
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    height: 750,
    show: false,
    frame: false
  });

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/public/index.html`);

  // Open the DevTools.
  // win.webContents.openDevTools();

  // Listen for a crash
  win.webContents.on('crash', console.log);

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  win.on('unresponsive', () => {
    console.log('Unresponsive :|');
    dialog.showMessageBox(win, {
      type: 'error',
      buttons: [
        'Wait',
        'Close',
        'Reload'
      ],
      defaultId: 0,
      title: 'App is unresponsive',
      message: 'The app has become unresponsive. Do you want to reload the page?',
      detail: 'This error occurs when the web view hangs, most commonly because of JavaScript',
      cancelId: 0,
    }, index => {
      console.log(index);
      if (index == 1) win.close();
      else if (index == 2) win.reload();
    });
  });

  win.once('ready-to-show', () => {
    win.show();
    splashWin.hide();
    splashWin.destroy();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createSplashWin);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
    app.quit();
  // }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

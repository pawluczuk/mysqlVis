const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.

const {ipcMain} = require('electron')

const path = require('path')
const url = require('url');

const eventsManager = require('./events/index')({ipcMain})()
  , windowsManager = require('./windows/index');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', windowsManager.create);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    eventManager.close();
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    windowsManager.create();
  }
})

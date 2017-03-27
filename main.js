const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.

const {ipcMain} = require('electron')

const path = require('path')
const url = require('url');

const eventsManager = require('./events/index')({ipcMain})
  , windowsManager = require('./windows/index');

let dbConfig;

//require('crash-reporter').start();
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  try {
    let config = require('./config.json');
    dbConfig = config;
  } catch (ex) {
  }
  eventsManager.eventManager(dbConfig);
  windowsManager.create();
});

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
  if (mainWindow === null) {
    windowsManager.create();
  }
})

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const url = require('url')
const path = require('path')
let windows = {};

windows.create = function create() {
	mainWindow = new BrowserWindow({width: 1200, height: 700});
	mainWindow.loadURL(url.format({
	    pathname: path.join(__dirname, '../site/views/index.html'),
	    protocol: 'file:',
	    slashes: true
  	}));
  	mainWindow.webContents.openDevTools()
  	connectedWindow = new BrowserWindow({width: 1200, height: 700, parent: mainWindow, modal: true, show: false})
  
	  // and load the index.html of the app.
	  connectedWindow.loadURL(url.format({
	    pathname: path.join(__dirname, '../site/views/main.html'),
	    protocol: 'file:',
	    slashes: true
	  }))

	  // Open the DevTools.
	  mainWindow.webContents.openDevTools()
	  connectedWindow.webContents.openDevTools()

	  // Emitted when the window is closed.
	  mainWindow.on('closed', function () {
	    // Dereference the window object, usually you would store windows
	    // in an array if your app supports multi windows, this is the time
	    // when you should delete the corresponding element.
	    mainWindow = null
	  })

	  connectedWindow.on('closed', function () {
	    // Dereference the window object, usually you would store windows
	    // in an array if your app supports multi windows, this is the time
	    // when you should delete the corresponding element.
	    connectedWindow = null
	  })

	  connectedWindow.on('error', function() {
	  	connectedWindow = null
	  })
};

module.exports = windows;
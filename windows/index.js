const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const url = require('url')
const path = require('path')
let windows = {};

windows.createWindow = function createWindow(viewPath) {
	var newWindow = new BrowserWindow({width: 1200, height: 700});
	newWindow.loadURL(url.format({
	    pathname: path.join(__dirname, viewPath),
	    protocol: 'file:',
	    parent: mainWindow,
	    slashes: true
  	}));

  	newWindow.on('closed', function () {
    	newWindow = null
  	});

  	newWindow.on('error', function() {
  		newWindow = null
  	});
  	newWindow.webContents.openDevTools();
  	return newWindow;
}

windows.createMainWindow = function createMainWindow() {
	mainWindow = new BrowserWindow({width: 1200, height: 700});
	mainWindow.loadURL(url.format({
	    pathname: path.join(__dirname, '../site/views/index.html'),
	    protocol: 'file:',
	    slashes: true
  	}));
  	mainWindow.webContents.openDevTools()
 	mainWindow.on('closed', function () {
	    mainWindow = null
  	});
 	mainWindow.on('error', function() {
 		mainWindow = null;
 	});
};

windows.create = function create() {
	mainWindow = new BrowserWindow({width: 1200, height: 700});
	mainWindow.loadURL(url.format({
	    pathname: path.join(__dirname, '../site/views/index.html'),
	    protocol: 'file:',
	    slashes: true
  	}));
  	mainWindow.webContents.openDevTools()
 	mainWindow.on('closed', function () {
	    mainWindow = null
  	});
 	mainWindow.on('error', function() {
 		mainWindow = null;
 	});
};

module.exports = windows;
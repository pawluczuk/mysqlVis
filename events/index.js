const mysql = require('mysql');
const windows = require('../windows/index');
let eventManager, 
	ipcMain,
	connection;

eventManager = function () {
	ipcMain.on('db-connection', (event, args) => {
	  	var requiredArgs = ['host', 'user', 'password', 'database'];
	  	var values = requiredArgs.map(arg => { return args[arg];});
		  if (values.indexOf(undefined) > -1) {
		    event.sender.send('db-connected', {success: false, msg: 'Required arguments missing.'});
		    return;
		  }
		  try {
		    connection = mysql.createConnection(args);
		    connection.connect(function(err) {
		      if (err) {
		        event.sender.send('db-connected', {success: false, msg: err.stack });
		        return;
		      }
		      connectedWindow.show();
		    });
		  } catch (ex) {
		    event.sender.send('db-connected', {success: false, msg: ex });
		  }
	});

	ipcMain.on('getTablesList', (event, args) => {
		connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
		  if (error) {
		  		event.sender.send('tablesList', { success: false, err: err.stack });
		  		return;
		  }
		  console.log('The solution is: ', results[0].solution);
		});
	});
}

eventManager.close = function close() {
	connection.close();
}

module.exports = function(cfg) {
	ipcMain = cfg.ipcMain;
	return eventManager;
};
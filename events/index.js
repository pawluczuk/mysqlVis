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
		if (!connection) {
			return event.sender.send('tablesList', { success: false, err: 'no connection' });
		}
		connection.query('SHOW TABLES', function (err, results, fields) {
		  	if (err) {
		  		event.sender.send('tablesList', { success: false, err: err.stack });
		  		return;
		  	}
		  	results = results.map(r => { return r['Tables_in_dw'];});
		  	
			event.sender.send('tablesList', { success: true, results: results});
		});
	});

	ipcMain.on('getTableData', (event, args) => {
		let tableName = args.tableName, filters = args.filters;
		if (!connection) {
			return event.sender.send('tablesList', { success: false, err: 'no connection' });
		}
		var query = 'SELECT * FROM ' + tableName;
		connection.query(query, (err, results, fields) => {
			if (err) {
		  		event.sender.send('tableData', { success: false, err: err.stack });
		  		return;
		  	}
		  	event.sender.send('tableData', { success: true, results, fields });
		});
	})
}

eventManager.close = function close() {
	connection.close();
}

module.exports = function(cfg) {
	ipcMain = cfg.ipcMain;
	return eventManager;
};
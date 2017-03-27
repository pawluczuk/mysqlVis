const mysql = require('mysql');
const windows = require('../windows/index');
const _ = require('lodash');
let eventManager = {}, 
	ipcMain,
	connection,
	visWindow,
	dbSettings;

eventManager.eventManager = function (db) {
	if (db) {
		dbSettings = db;
		connection = mysql.createConnection(db);
	    connection.connect(function(err) {
	    	if (err) {
	    		return;
	    	}
	    	eventManager.createVisWindow('../site/views/main.html');
	    });
	}

	ipcMain.on('db-connection', (event, args) => {
		if (_.get(connection, 'state', '') === 'connected' && visWindow) {
			return visWindow.show();
		}
		dbSettings = args;
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
			      	eventManager.createVisWindow('../site/views/main.html');
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
		  	results = results.map(r => { return r['Tables_in_' + dbSettings.database];});
		  	
			event.sender.send('tablesList', { success: true, results: results});
		});
	});

	ipcMain.on('getTableData', (event, args) => {
		let tableName = args.tableName, filters = args.filters, source = args.source;
		if (!connection) {
			return event.sender.send('tablesList', { success: false, err: 'no connection' });
		}
		var query = 'SELECT * FROM ' + tableName + ' limit 100';
		connection.query(query, (err, results, fields) => {
			if (err) {
		  		event.sender.send(source + 'Data', { success: false, err: err.stack });
		  		return;
		  	}
		  	event.sender.send(source + 'Data', { success: true, results, fields });
		});
	})
}

eventManager.createVisWindow = function createVisWindow(windowPath) {
	if (visWindow) {
		return;
	}
	visWindow = windows.createWindow(windowPath);
  	visWindow.show();
}

eventManager.close = function close() {
	connection.close();
}

module.exports = function(cfg) {
	ipcMain = cfg.ipcMain;
	return eventManager;
};
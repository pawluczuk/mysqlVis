const {ipcRenderer} = require('electron')
let $select = document.querySelector('#tableSelect'),
	initd = false
	, tables = []
	, columns = [];
//console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

ipcRenderer.on('tablesList', (event, arg) => {
	if (arg.results && arg.results.length) {
		tables = arg.results;
		showTables();	
	}
});

ipcRenderer.on('tableData', (event, arg) => {
	if (!arg.success) {
		console.log(arg);
	}
	var fields = arg.fields
	, results = arg.results
	, columns = fields.map(d=> { return {data: d.name, name: d.name}});
	fnInitializeDataTable(results, columns);
});

function fnInitializeDataTable(results, columns) {
         
    // clear existing datatable and prepare for next initialization
    if( $.fn.DataTable.isDataTable( '#dataTable') ) {
             
        // empty parent div of #peopleTable and append empty table
        $( '#dataTable' ).empty().append( '<table id="dataTable" class="table cell-border"></table>' );
                 
    }
     
    dt = $('#dataTable').DataTable( {
        data: results
        , columns: columns
        , destroy: true
        , deferRender: true
    }); 
}

$select.onchange = function onchange(args) {
	var tableName = this.value;
	var filters = {};
	ipcRenderer.send('getTableData', {tableName, filters});
}

window.onfocus = function onfocus(arg) {
	if (!initd) {
		ipcRenderer.send('getTablesList', {});
		initd = true;
	}
}

function showTables() {
	if (!tables || !tables.length) {
		return;
	}
	tables.forEach(table => {
		var $option = document.createElement('option');
		$option.value = table;
		$option.text = table;
		$select.appendChild($option);
	});	
}
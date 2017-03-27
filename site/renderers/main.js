const {ipcRenderer} = require('electron')
const _ = require('lodash')
let $select = $('.tableSelect')
	, $visSelect = $('#panel-vis > .tableSelect')
	, $tableSelect = $('#panel-table > .tableSelect')
	, $menu = $('#menu')
	, $panels = $('#panels')
	, $visualisations = $('.vis')
	, initd = false
	, tables = []
	, columns = [];
// *** MAIN THREAD COMMUNICATION

ipcRenderer.on('tablesList', (event, arg) => {
	if (!arg.success) {
		return alertify.alert(arg.msg);
	};

	if (_.get(arg, 'results.length', 0)) {
		tables = arg.results;
		showTables();
	}
});

ipcRenderer.on('tableData', (event, arg) => {
	if (!arg.success) {
		alertify.alert(arg.msg);
	};
	var fields = arg.fields
	, results = arg.results
	, columns = fields.map(d=> { return {data: d.name, name: d.name}});
	fnInitializeDataTable(results, columns);
});

ipcRenderer.on('visData', (event, arg) => {
	var visualisationType = $('.vis.active').data('vis');
	if (!arg.success) {
		return alertify.alert(arg.msg);
	};
	if (!visualisationType) {
		return alertify.alert('Choose desired chart type');
	}
	startD3(visualisationType, arg);
});


// *** EVENTS *** 

$select.change(function() {
	var tableName = this.value;
	var filters = {};
	if (!tableName) {
		return;
	}
	ipcRenderer.send('getTableData', {tableName, filters, source: $(this).data('panel')});
});

$menu.find('button').each((idx, btn) =>{
	btn.onclick = function() {
		var panelId = '#panel-' + $(this).data('panel');
		var currentActivePanel = $panels.find('.active')
			, newActivePanel = $panels.find(panelId);

		currentActivePanel.removeClass('active');
		currentActivePanel.hide();
		
		newActivePanel.addClass('active');
		newActivePanel.show();
	}
});

$visualisations.each((idx, div) => {
	div.onclick = function() {
		$visualisations.removeClass('active');
		$(this).addClass('active');
	}
});

window.onfocus = getTables;
window.onload = getTables;

// *** HELPERS *** 
function fnInitializeDataTable(results, columns) {
    if( $.fn.DataTable.isDataTable( '#dataTable') ) {
        $( '#dataTable' )
        	.empty()
        	.append( '<table id="dataTable" class="table cell-border"></table>' );
    }
    dt = $('#dataTable').DataTable( {
        data: results
        , columns: columns
        , destroy: true
        , deferRender: true
    }); 
}

function getTables() {
	if (!tables.length) {
		ipcRenderer.send('getTablesList', {});
		initd = true;
	}
}

function showTables() {
	if (!tables || !tables.length) {
		return;
	}
	$select.append('<option value="">Choose your table...</option>');
	tables.forEach(table => {
		var $option = document.createElement('option');
		$option.value = table;
		$option.text = table;
		$select.append($option);
	});	
}

function startD3(type, data) {
	switch(type) {
		case 'barchart':
			barChart(data);
			break;
		case 'timeseries':
			timeSeries(data);
			break;
		case 'linechart': 
			lineChart(data);
			break;
	}
}

function barChart(data) {
	console.log("barchart")
}

function timeSeries(data) {
	console.log("timeSeries")
}

function lineChart(data) {
	console.log("linechart")
}


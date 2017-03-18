// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer} = require('electron')
//console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
ipcRenderer.on('db-connected', (event, arg) => {
	console.log(arg)
});

var $submitBtn = document.querySelector('#submit');
$submitBtn.addEventListener('click', function(event) {
	var $form = document.querySelectorAll('input'), res = {};
	for (var i = 0; i < $form.length; i++ ) {
		res[$form[i].getAttribute('name')] = $form[i].value;
	}
	if (!res.host) {
		res.host = 'localhost';
	}
	ipcRenderer.send('db-connection', res);
});
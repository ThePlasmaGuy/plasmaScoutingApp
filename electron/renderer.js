// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
function generateUUID(len) {
	return (function co(lor) {
		return (lor += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)]) &&
			(lor.length == len) ? lor : co(lor);
	})('');
}

const url = "http://localhost:81";
/*try {
	$.get(url, function(data) {
		console.log(data);
		document.getElementById('app').innerHTML = data;
	});
} catch {
	console.log("Could not connect to server!");
}*/

var ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('form', function(event, data) {
	document.getElementById('app').innerHTML = data;
});
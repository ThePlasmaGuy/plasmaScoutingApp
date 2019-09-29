// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const url = "http://localhost:81";
try {
	$.get(url, function(data) {
		console.log(data);
		document.getElementById('app').innerHTML = data;
	});
} catch {
	console.log("Could not connect to server!");
}
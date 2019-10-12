// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


const handleFormSubmit = event => {

  // Stop the form from submitting since we’re handling that with AJAX.
  event.preventDefault();

  // TODO: Call our function to get the form data.
  const data = {};

  // Demo only: print the form data onscreen as a formatted JSON object.
  const dataContainer = document.getElementsByClassName('results__display')[0];

  // Use `JSON.stringify()` to make the output valid, human-readable JSON.
  dataContainer.textContent = JSON.stringify(data, null, "  ");

  // ...this is where we’d actually do something with the form data...
};



const url = "http://localhost:81";
/*try {
	$.get(url, function(data) {
		console.log(data);
		document.getElementById('app').innerHTML = data;
	});
} catch {
	console.log("Could not connect to server!");
}*/

const {
  ipcRenderer
} = require('electron')


function submitForm() {
  var dataObj = {};
  for (var i = 0; i < document.getElementById('mainForm').children.length; i++) {
    if (document.getElementById('mainForm').children[i].tagName === "INPUT" || document.getElementById('mainForm').children[i].tagName === "SELECT" || document.getElementById('mainForm').children[i].tagName === "TEXTAREA") {
      if (document.getElementById('mainForm').children[i].getAttribute("id") !== "submit") {
        eval("dataObj." + document.getElementById('mainForm').children[i].getAttribute("name") + "='" + document.getElementById('mainForm').children[i].value + "'");
      }
    }
  }
  console.log(dataObj);
  var html = document.getElementById("app").innerHTML;
  document.getElementById("app").innerHTML = ipcRenderer.sendSync('responseData', JSON.stringify(dataObj)) + '<br><input type="button" onclick="window.location = window.location" value="Back"/>';
}
/*console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'ping')
*/
document.getElementById('app').innerHTML = "<form id='mainForm'>" + ipcRenderer.sendSync('formRequest') + "<input type='submit' id='submit' value='Submit'/></form>";
document.getElementById("submit").onclick = function(e) {
  e.preventDefault();
  submitForm();
}
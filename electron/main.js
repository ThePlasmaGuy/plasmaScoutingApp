const https = require('http');
const fs = require('fs');
const md5File = require('md5-file');
const {
	app,
	BrowserWindow
} = require('electron')
const path = require('path');
const url = "http://localhost";
const port = 80;
const apiPort = 81;
var hash;
var scoutID;
var localData = false;
const prompt = require('electron-prompt');

function generateUUID(len) {
	return (function co(lor) {
		return (lor += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)]) &&
			(lor.length == len) ? lor : co(lor);
	})('');
}

const {
	ipcMain
} = require('electron')


ipcMain.on('reFetchForm', (event, arg) => {
	console.log("Scout ID: " + scoutID);
	https.get(url + ':' + apiPort + "?scoutID=" + scoutID, (resp) => {
		let data = '';

		resp.on('data', (chunk) => {
			data += chunk;
		});

		resp.on('end', () => {
			fs.writeFileSync("form.html", data);
			hash = md5File.sync('form.html');
			console.log("Hash of form is " + hash);
			event.returnValue = data;
		});

	}).on("error", (err) => {
		console.log("Error:  Server offline");
		event.returnValue = "<b>SERVER OFFLINE, PUSH WHEN DONE!</b><br>" + fs.readFileSync("form.html");
	});
});

ipcMain.on('formRequest', (event, arg) => {
	event.returnValue = fs.readFileSync("form.html");
})

ipcMain.on('quit', (event, arg) => {
	app.quit();
	event.returnValue = undefined;
});

ipcMain.on('checkLocal', (event, arg) => {
	event.returnValue = localData;
});

ipcMain.on('sendLocal', (event, arg) => {
	if(localData === true) {
		var localData = JSON.parse(fs.readFileSync("./db.json"));
		for(var i = 0; i < localData.length; i++) {
			https.get(url + ':' + port + '/submit?data=' + encodeURIComponent(localData[i]) + "&scoutID=" + scoutID, (resp) => {
				let data = '';
				resp.on('data', (chunk) => {
					data += chunk;
				});
				resp.on('end', () => {});
			}).on("error", (err) => {
				console.log("Error:  Server offline");
				try {
					var fileJSON = JSON.parse(fs.readFileSync("./db.json"));
					fileJSON.push(dataObj);
					fs.writeFileSync("./db.json", JSON.stringify("fileJSON"));
				} catch {
					var fileJSON = []
					fileJSON.push(dataObj);
					fs.writeFileSync("./db.json", JSON.stringify("fileJSON"));
				}
				event.returnValue = "Server Offline."
				localData = true;
			});
		}
		event.returnValue = "Done";
	}
	event.returnValue = "No Local Data";
});

ipcMain.on('verifyID', (event, arg) => {
	console.log(arg);
	if(arg != "local") {
		https.get(url + ':' + port + '/verify?scoutID=' + arg, (resp) => {
			let data = '';
			resp.on('data', (chunk) => {
				data += chunk;
			});

			resp.on('end', () => {
				console.log(data);
				if(data == 'VALID') {
					fs.writeFileSync('scoutID.txt', arg);
					scoutID = arg;
					event.returnValue = arg;
				} else {
					event.returnValue = undefined;
				}

			});
		}).on("error", (err) => {
			event.returnValue = "OFFLINE"
		});
	} else {
		console.log('attempting local ID fetch');

		var localID;
		try {
			localID = fs.readFileSync("scoutID.txt");
			console.log('local ID found: ' + localID);
		} catch {
			localID = undefined;
		}
		https.get(url + ':' + port + '/verify?scoutID=' + localID, (resp) => {
			let data = '';
			resp.on('data', (chunk) => {
				data += chunk;
			});

			resp.on('end', () => {
				console.log(data);
				if(data === 'VALID') {
					fs.writeFileSync('scoutID.txt', localID);
					scoutID = localID;
					event.returnValue = localID;
				} else {
					event.returnValue = undefined;
				}

			});
		}).on("error", (err) => {
			event.returnValue = "OFFLINE"
		});
	}
})

ipcMain.on('responseData', (event, arg) => {
	var res = "Success!";
	var dataObj = {
		"data": JSON.parse(arg),
		"uuid": generateUUID(256),
		"hash": hash
	};
	console.log(dataObj);
	https.get(url + ':' + port + '/submit?data=' + encodeURIComponent(JSON.stringify(dataObj)) + "&scoutID=" + scoutID, (resp) => {
		let data = '';
		resp.on('data', (chunk) => {
			data += chunk;
		});
		resp.on('end', () => {
			event.returnValue = data;
		});
	}).on("error", (err) => {
		console.log("Error:  Server offline");
		try {
			var fileJSON = JSON.parse(fs.readFileSync("./db.json"));
			fileJSON.push(dataObj);
			fs.writeFileSync("./db.json", JSON.stringify(fileJSON));
		} catch {
			var fileJSON = []
			fileJSON.push(dataObj);
			fs.writeFileSync("./db.json", JSON.stringify(fileJSON));
		}
		event.returnValue = "Server Offline."
		localData = true;
	});

})

console.log(scoutID);
https.get(url + ':' + apiPort + "?scoutID=" + scoutID, (resp) => {
	let data = '';
	resp.on('data', (chunk) => {
		data += chunk;
	});

	resp.on('end', () => {
		fs.writeFileSync("form.html", data);
		hash = md5File.sync('form.html');
		console.log("Hash of form is " + hash);
		mainWindow.webContents.send('form', data);
	});

}).on("error", (err) => {
	console.log("Error:  Server offline");
});


let mainWindow

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true
		}
	})

	mainWindow.loadFile('index.html')
	mainWindow.on('closed', function() {
		mainWindow = null
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
	if(process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
	if(mainWindow === null) createWindow()
})
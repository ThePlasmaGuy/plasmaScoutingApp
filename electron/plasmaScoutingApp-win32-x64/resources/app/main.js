// Modules to control application life and create native browser window
const https = require('http');
const fs = require('fs');
const md5File = require('md5-file');
const {
  app,
  BrowserWindow
} = require('electron')
const path = require('path');
const url = "http://70.176.85.159";
var hash;

function generateUUID(len) {
  return (function co(lor) {
    return (lor += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)]) &&
      (lor.length == len) ? lor : co(lor);
  })('');
}

const {
  ipcMain
} = require('electron')


ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong')
})

ipcMain.on('formRequest', (event, arg) => {
  event.returnValue = fs.readFileSync("form.html");
})

ipcMain.on('responseData', (event, arg) => {
  var res = "Success!";
  var dataObj = {
    "data": JSON.parse(arg),
    "uuid": generateUUID(256),
    "hash": hash
  };
  console.log(dataObj);
  https.get(url + ':2403/submit?data=' + JSON.stringify(dataObj), (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      event.returnValue = data;
    });
  }).on("error", (err) => {
    console.log("Error:  Server offline");
    event.returnValue = "Server Offline, Response has been locally stored."
  });

})


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
https.get(url + ':81', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
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
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
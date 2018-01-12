const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

// Global window object
let win;

function createWindow() {
  // Create new browser window
  win = new BrowserWindow({
    width: 800,
    height: 600
  });

  // Load index.html
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // When the window is closed, dereference window object
  win.on('closed', () => {
    win = null;
  });
}

// Create window after electron has finished initializing
app.on('ready', createWindow);

// When all windows are closed, quit
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


// Activate when app open but windows closed (aka still in dock), open window
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});


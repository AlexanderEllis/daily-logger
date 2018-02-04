const {
  app,
  BrowserWindow,
  nativeImage,
  Menu,
  Tray
} = require('electron');
const path = require('path');
const url = require('url');
const jetpack = require('fs-jetpack');

// Global window object
let win;
// Global tray object
let tray;

// Global trayHighlight variable to access in tray and window code
let trayHighlighted = false;

function createWindow(x, y) {
  // Create new browser window
  const width = 500;
  const height = 300;
  win = new BrowserWindow({
    width,
    height,
    frame: false,
    x: x - width / 2,
    y,
    show: false,
    webPreferences: {
      // TODO: For production, change this to false to make it feel like a real app
      devTools: true
    }
  });

  // Load index.html
  win.loadURL(url.format({
    pathname: 'localhost:3000', //path.join(__dirname, 'index.html'),
    protocol: 'http:',
    slashes: true
  }));

  // When the window is closed, dereference window object
  win.on('closed', () => {
    win = null;
  });

  win.on('blur', () => {
    // If we click away from the app, we'll want to close it
    win.hide();
  })

  win.on('hide', () => {
    // Clicking outside of the app will hide it, so we'll want to toggle tray icon highlight
    if (tray && trayHighlighted) {
      tray.setHighlightMode('never');
      trayHighlighted = !trayHighlighted;
    }
  })

  win.on('show', () => {
    // Clicking on the notification will show the window, so we want to also highlight the tray icon when that happens
    if (tray && !trayHighlighted) {
      tray.setHighlightMode('always');
      trayHighlighted = !trayHighlighted;
    }
  });
}

function createTray() {
  const iconPath = path.join(__dirname, 'clipboard.png');

  // This is a check to make sure the file exists
  // console.log(jetpack.exists(iconPath)); 

  let nimage = nativeImage.createFromPath(iconPath);

  tray = new Tray(nimage);
  tray.setToolTip('Daily logger');

  // Get bounds to create window
  const bounds = tray.getBounds();
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y;

  // Create hidden window when app starts so that it can load immediately at the next interval
  createWindow(x, y);

  tray.on('click', () => {

    if (!trayHighlighted) {
      win.show()
    } else {
      win.hide();
    }

    // Toggle tray highlight to be highlighted when window is open
    tray.setHighlightMode(trayHighlighted ? 'never' : 'always');
    trayHighlighted = !trayHighlighted;

  });
}

// Create tray after electron has finished initializing
app.on('ready', createTray);

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

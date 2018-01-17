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
    y
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

  win.on('show', () => {
    if (tray && !trayHighlighted) {
      tray.setHighlightMode('always');
    }
  })
}

function createTray() {
  const iconPath = path.join(__dirname, 'clipboard.png');
  console.log(jetpack.exists(iconPath)); //should be "file", otherwise you are not pointing to your icon file 
  let nimage = nativeImage.createFromPath(iconPath);

	tray = new Tray(nimage);
  tray.setToolTip('Daily logger');


  tray.on('click', () => {
    console.log(tray.getBounds());
    
    // TODO: If we've highlighted the tray from clicking notification, we want to 
    // then hide the tray on subsequent clicks

    if (!trayHighlighted) {
      if (!win) {
        const bounds = tray.getBounds();
        const x = bounds.x + bounds.width / 2;
        const y = bounds.y;

        createWindow(x, y);
      } else {
        win.show()
      }
    } else {
      win.hide();
    }

    tray.setHighlightMode(trayHighlighted ? 'never' : 'always');
    trayHighlighted = !trayHighlighted;

  });
}

// Create window after electron has finished initializing
app.on('ready', createTray);
// TODO: When the app is started, create the Tray.  After 

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


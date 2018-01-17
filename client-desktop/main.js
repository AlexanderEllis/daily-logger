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

function createWindow(x, y) {
  // Create new browser window
  console.log(x);
  console.log(y);
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
}

function createTray() {
  const iconPath = path.join(__dirname, 'clipboard.png');
  console.log(jetpack.exists(iconPath)); //should be "file", otherwise you are not pointing to your icon file 
  let nimage = nativeImage.createFromPath(iconPath);

	tray = new Tray(nimage);
  tray.setToolTip('Daily logger');

  let trayHighlighted = false;

  tray.on('click', () => {
    console.log(tray.getBounds());
    

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


const { app, BrowserWindow } = require('electron')
const path = require('path')

try {
  require('electron-reloader')(module)
} catch (_) { }

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    // fullscreen: true,
  });
  
  if (process.env.NODE_ENV !== 'development') {
    require('./backend/main.js')
    mainWindow.loadFile(path.join(__dirname, "client/dist/index.html"));
  } else {
    console.log('Development mode')
    mainWindow.openDevTools()
    mainWindow.loadURL('http://localhost:3000/')
  }
}

app.whenReady().then(() => {
  createWindow()
}) 

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

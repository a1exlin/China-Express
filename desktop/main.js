const { app, BrowserWindow } = require('electron/main')
const path = require('path');
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
        }
    })

    // Load the built React app
    win.loadFile(path.join(__dirname, '../cx-web/build/index.html'));
    win.webContents.openDevTools();

}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


console.log('Loading:', path.join(__dirname, '../cx-web/build/index.html'));
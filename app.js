const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const macaddress = require('macaddress');


let win;

const createWindow = () => {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // win.loadURL(path.join(__dirname,'dist','redbricks-frontend','index.html'));
    win.loadFile(path.join(__dirname, 'dist', 'redbricks-frontend', 'index.html'));

    // win.webContents.openDevTools();


    win.on('closed', () => {
        win = null;
    })

    win.webContents.on('did-fail-load', () => {
        win.loadFile(path.join(__dirname, 'dist', 'redbricks-frontend', 'index.html'));
    })
}



app.whenReady().then(() => {
    ipcMain.handle('get-mac-address', getMac)
    createWindow();
})


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();

    }
})

const getMac = () => {
    return macaddress.one();
}


// app.whenReady().then(() => {
//     createWindow();

//     app.on('activate',() => {
//         if(BrowserWindow.getAllWindows().length === 0) {
//             createWindow();
//         }
//     })
// })

// app.on('window-all-closed',() => {
//     if(process.platform !== 'darwin'){
//         app.quit();
//     }
// })
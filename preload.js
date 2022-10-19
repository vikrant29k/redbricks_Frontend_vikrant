const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getMac: () => ipcRenderer.invoke('get-mac-address')
})
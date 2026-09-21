const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopAPI', {
  setIgnoreMouseEvents: (ignore, options) =>
    ipcRenderer.send('set-ignore-mouse-events', ignore, options),
  launch: (payload) => ipcRenderer.send('launch', payload),
  getStats: () => ipcRenderer.invoke('get-stats'),
  getMail: () => ipcRenderer.invoke('get-mail'),
  getClipboard: () => ipcRenderer.invoke('get-clipboard'),
  getTabs: () => ipcRenderer.invoke('get-tabs'),
  searchApps: (query) => ipcRenderer.invoke('search-apps', query),
  getActiveApp: () => ipcRenderer.invoke('get-active-app'),
  onActiveApp: (handler) => ipcRenderer.on('active-app', (event, info) => handler(info)),
  setSearchMode: (on) => ipcRenderer.send('set-search-mode', on),
  quit: () => ipcRenderer.send('quit-app')
});

// Electron Preload Script
// This runs in a separate context for security

const { contextBridge } = require('electron');

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,
    versions: {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    },
    isElectron: true
});

// Log when preload is complete
console.log('Electron preload script loaded');

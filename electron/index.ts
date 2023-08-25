import * as path from 'node:path'
import { app, BrowserWindow, ipcMain } from 'electron';

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 851,
		height: 500,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
		show: false,
		autoHideMenuBar: true,
		titleBarStyle: 'hidden',
		resizable: false
	});
	if (app.isPackaged) {
		mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
	} else {
		mainWindow.loadURL('http://localhost:5648');
	}

	mainWindow.on('ready-to-show', () => {
		mainWindow.show();
	});

	ipcMain.on('close-window', (event, args) => {
		mainWindow.close();
	})
}

app.whenReady().then(createWindow);
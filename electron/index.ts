import * as path from 'node:path'
import { app, BrowserWindow } from 'electron';

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
		show: false,
		autoHideMenuBar: true,
	});
	if (app.isPackaged) {
		mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
	} else {
		mainWindow.loadURL('http://localhost:3000');
	}

	mainWindow.on('ready-to-show', () => {
		mainWindow.show();
	});

	mainWindow.webContents.on('render-process-gone', function (event, detailed) {
		//  logger.info("!crashed, reason: " + detailed.reason + ", exitCode = " + detailed.exitCode)
		console.log(detailed)
	})
}

app.whenReady().then(createWindow);
import * as path from 'node:path'
import EventEmitter from 'node:events'
import { app, BrowserWindow, ipcMain } from 'electron';
import YggdrasilServer from '../tree'
import { launch } from "@xmcl/core";
import { YggdrasilClient, YggrasilAuthentication } from "@xmcl/user";
import { getVersionList } from "@xmcl/installer";
import { WebSocketServer } from 'ws';
import { Client } from "@xhayper/discord-rpc";

const rpcClient = new Client({ clientId: '1170092288718929970' })
class rpcChangeClass {
	playingMC(version: string, username: string) {
		rpcClient.user?.setActivity({
			state: `Playing Minecraft ${version}`,
			largeImageKey: 'mainlogo',
			smallImageKey: `https://mc-heads.net/avatar/${username}`,
			smallImageText: username
		})
	}
	onLauncher() {
		rpcClient.user?.setActivity({
			state: 'On the launcher',
			largeImageKey: 'mainlogo'
		})
	}
}
const rpcChange = new rpcChangeClass()

function createWindow() {
	const width = 851;
	const height = 500;
	const mainWindow = new BrowserWindow({
		width,
		height,
		minWidth: width,
		minHeight: height,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
		show: false,
		autoHideMenuBar: true,
		titleBarStyle: 'hidden',
		resizable: true,
	});

	rpcClient.on('ready', () => {
		rpcChange.onLauncher()
		console.log('RPC Connected!')
	})
	if (app.isPackaged) {
		mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
		new YggdrasilServer(path.join(__dirname, '../tree/drizzle'))
		rpcClient.login()
	} else {
		mainWindow.loadURL('http://localhost:5648');
		new YggdrasilServer('./tree/drizzle')
	}

	const events = new EventEmitter()

	const wss = new WebSocketServer({ port: 25501 })
	wss.on('listening', () => console.log('Websocket server started on port 25501'))
	wss.on('connection', (ws) => {
		let userInfoRequest: string | undefined
		ws.on('error', console.error);
		ws.on('message', (message) => {
			const msg = JSON.parse(message.toString()) as WebsocketMessage
			switch (msg.type) {
				case 'launchButton':
					userInfoRequest = msg.type
			}
		})
		events.on('mc-process', (data: 'spawn' | 'close', code: number | null) => {
			if (userInfoRequest !== 'launchButton') return;
			switch (data) {
				case 'spawn':
					ws.send(JSON.stringify({ status: data }))
					break;
				case 'close':
					ws.send(JSON.stringify({ status: data, code }))
					break;
			}
		})
	})

	mainWindow.on('ready-to-show', async () => {
		mainWindow.show();
	});

	ipcMain.on('close-window', () => {
		mainWindow.close();
	})

	ipcMain.on('launch-mc', async (_event, args: LaunchMCArgs) => {
		const mcLaunch = await doShit(args.version, args.username)
		let isProcessRunning = true
		mcLaunch.on('spawn', () => {
			events.emit('mc-process', 'spawn')
			rpcChange.playingMC(args.version, args.username)
		})
		mcLaunch.on('close', (code) => {
			rpcChange.onLauncher()
			events.emit('mc-process', 'close', code)
			isProcessRunning = false
		})
		mcLaunch.stdin?.on('data', (data) => {
			console.log(data.toString())
		})
		mcLaunch.stderr?.on('data', (data) => {
			console.log(data.toString())
		})
		events.on('close-mc', () => {
			if (isProcessRunning) {
				mcLaunch.kill('SIGKILL')
				mcLaunch.emit('close', 137)
				rpcChange.onLauncher()
				// preventing memory leaks moment:
				mcLaunch.removeAllListeners()
				events.removeAllListeners('close-mc')
			}
		})
	})

	ipcMain.on('close-mc', () => {
		events.emit('close-mc')
	})

	ipcMain.on('show-versions', async (event) => {
		event.reply('show-versions-reply', (await getVersionList()).versions.filter(v => v.type === 'release'))
	})
}

async function doShit(version: string, username: string) {
    const javaPath = 'java'
    const gamePath = 'C:/Users/USER/AppData/Roaming/.minecraft'

    const client = new YggdrasilClient('http://localhost:25500/auth');
	const accDataGet = await fetch('http://localhost:25500/api/getUsers')
		.then(async res => (await res.json() as AccountData[]).filter((acc) => acc.username === username)[0])
	const realUsername = accDataGet.email;
	const password = accDataGet.password;

    const auth = await client.login({ username: realUsername, password, clientToken: 'jhadskblaekljbhklnbgeak' }).catch(e => {return console.error(e)})

    return launch({ gamePath, javaPath, version, accessToken: (auth as YggrasilAuthentication).accessToken, gameProfile: (auth as YggrasilAuthentication).selectedProfile, extraJVMArgs: ['-Dminecraft.api.auth.host=http://localhost:25500/auth'] });
}

app.whenReady().then(createWindow);

process.on('beforeExit', async () => {
	await rpcClient.destroy()
	console.log('destriotyd')
})

interface WebsocketMessage {
	type: 'launchButton'
}

interface LaunchMCArgs {
	version: string;
	username: string;
}

interface AccountData {
	username: string;
	email: string;
	password: string;
}
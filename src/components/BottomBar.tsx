import { Box, Spinner } from '@chakra-ui/react'
import './BottomBar.css'
import { useEffect, useState } from 'react'
import type { MinecraftVersion } from '@xmcl/installer'
import { Select } from '@chakra-ui/react'
import BottomBarUser from './BottomBarUser.tsx'
const { ipcRenderer, IpcMainEvent } = window.require('electron');

// ... (other imports and code)

export default function BottomBar() {
    const [loading, setLoading] = useState(true);
    const [versions, setVersions] = useState<MinecraftVersion[]>([]);
    const [versionSelected, setVersionSelected] = useState(window.localStorage.getItem('versionSelected'))
    const [launchButtonText, setLaunchButtonText] = useState<'LAUNCH' | 'CLOSE'>('LAUNCH');
    const [_launchButtonExitCode, setLaunchButtonExitCode] = useState<number | null>(null);

    const handleVersionsEvent = (_event: typeof IpcMainEvent, args: MinecraftVersion[]) => {
        setVersions(args);
        setLoading(false);
    };
    const handleVersionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setVersionSelected(event.target.value);
        window.localStorage.setItem('versionSelected', event.target.value);
    }

    useEffect(() => {
        ipcRenderer.send('show-versions');
        ipcRenderer.on('show-versions-reply', handleVersionsEvent);
        return () => {
            ipcRenderer.removeListener('show-versions-reply', handleVersionsEvent);
        };
    }, []);

    const launchIpc = () => {
        if (launchButtonText === 'CLOSE')
            return ipcRenderer.send('close-mc');
        ipcRenderer.send('launch-mc', {version: versionSelected, username: window.localStorage.getItem('selectedUser')!});
    };

    useEffect(() => {
        const ws = new WebSocket('ws://127.0.0.1:25501');
        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'launchButton' }));
        }
        ws.onmessage = (dt) => {
            const data = JSON.parse(dt.data) as LaunchButtonWebsocketMsg;
            switch (data.status) {
                case 'spawn':
                    setLaunchButtonText('CLOSE');
                    break;
                case 'close':
                    setLaunchButtonText('LAUNCH');
                    setLaunchButtonExitCode(data.code);
                    break;
            }
        }
    }, []);

    return (
        <div className="mainBottomBar">
            {loading ? (
                <Spinner 
                    className='spinnerCenter'
                    color='blue'
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    size='xl'
                />
            ) : (
                <div>
                    <Select
                        className='versionSelect'
                        bgGradient='radial-gradient(circle, #616161 0%, #2a2a2a 100%)'
                        width={'137px'}
                        height={'59px'}
                        key={versionSelected}
                        defaultValue={versionSelected!}
                        fontSize={'20px'}
                        border={'none'}
                        borderRadius={0}
                        onChange={handleVersionChange}
                    >
                        {versions.map(version => (
                            <option key={version.id} value={version.id} className='versionSelectOptions'>
                                {version.id}
                            </option>
                        ))}
                    </Select>
                    <Box
                        as='button'
                        className='launchButton'
                        key={launchButtonText}
                        bgGradient={launchButtonText === 'LAUNCH' ? 'radial-gradient(circle, #5a72de 0%, #5ec6ff 100%)' : 'radial-gradient(circle, #ff0000 0%, #ff6b6b 100%)'}
                        onClick={launchIpc}
                    >
                        {launchButtonText}
                    </Box>
                    <div className='userModal'>
                        <BottomBarUser />
                    </div>
                </div>
            )}
        </div>
    );
}

interface LaunchButtonWebsocketMsg {
    status: 'spawn' | 'close';
    code: number | null;
}
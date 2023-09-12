import { Box, Spinner } from '@chakra-ui/react'
import './BottomBar.css'
import { useEffect, useState } from 'react'
import type { MinecraftVersion } from '@xmcl/installer'
import { Select } from '@chakra-ui/react'
const { ipcRenderer, IpcMainEvent } = window.require('electron');

// ... (other imports and code)

export default function BottomBar() {
    const [versions, setVersions] = useState<MinecraftVersion[]>([]);
    const [loading, setLoading] = useState(true);
    const [launchButtonText, setLaunchButtonText] = useState('LAUNCH');
    const [launchButtonExitCode, setLaunchButtonExitCode] = useState<number | null>(null);

    const handleVersionsEvent = (_event: typeof IpcMainEvent, args: MinecraftVersion[]) => {
        setVersions(args);
        setLoading(false);
    };

    useEffect(() => {
        ipcRenderer.send('show-versions');
        ipcRenderer.on('show-versions-reply', handleVersionsEvent);
        return () => {
            ipcRenderer.removeListener('show-versions-reply', handleVersionsEvent);
        };
    }, []);

    const launchIpc = () => {
        ipcRenderer.send('launch-mc');
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
                        defaultValue={versions[0].id}
                        fontSize={'30px'}
                        border={'none'}
                        borderRadius={0}
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
                        bgGradient='radial-gradient(circle, #5a72de 0%, #5ec6ff 100%)'
                        onClick={launchIpc}
                    >
                        {launchButtonText}
                    </Box>
                </div>
            )}
        </div>
    );
}

interface LaunchButtonWebsocketMsg {
    status: 'spawn' | 'close';
    code: number | null;
}
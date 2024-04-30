import { Collapse, useDisclosure, Box, Progress } from "@chakra-ui/react";
import { useState, useEffect } from "react";
const { ipcRenderer } = window.require('electron');

export default function InstallProgressbar() {
    const { isOpen, onToggle } = useDisclosure()
    const [wsResponse, setWsResponse] = useState<McInstallProgress>({ downloading: '', percentage: 0 });

    useEffect(() => {
        ipcRenderer.on('install-started', () => { onToggle() })
    }, []);

    useEffect(() => {
        const ws = new WebSocket('ws://127.0.0.1:25501');
        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'install-progress' }));
            console.log('connected')
        }
        ws.onmessage = (dt) => {
            const data = JSON.parse(dt.data) as { type: 'install-progress', data: McInstallProgress };
            console.log(data);
            setWsResponse(data.data);
        }
        ws.onerror = (error) => {
            console.log('WebSocket error: ', error);
        };
    }, [])
    
    return (
        <Collapse in={isOpen} animateOpacity>
            <Box
            p='40px'
            color='white'
            mt='4'
            bg='teal.500'
            rounded='md'
            shadow='md'
            >
                <Progress size='md' value={wsResponse.percentage} />
                <p>{wsResponse.downloading}</p>
            </Box>
      </Collapse>
    )
}

interface McInstallProgress {
	percentage: number;
	downloading: string;
}
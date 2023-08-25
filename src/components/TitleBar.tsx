import { CloseButton } from '@chakra-ui/react';
import './TitleBar.css';
import LogoTitleBar from '../assets/logotitlebar.png';
const { ipcRenderer } = window.require('electron');

export default function TitleBar() {
  const closeWindow = () => {
    ipcRenderer.send('close-window');
  };

  return (
    <div className="titleBar draggable">
      <img src={LogoTitleBar} alt="Logo" className="logo" />
      <div className="spacer" />
      <div className="closeButton nonDraggable" onClick={closeWindow}>
        <CloseButton color={'red'} />
      </div>
    </div>
  );
}

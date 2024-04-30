import { Box, Image } from "@chakra-ui/react";
import React from "react";

export default function UserCard(props: {
  username: string;
  type: "microsoft" | "mojang" | "offline";
  uuid?: string;
}) {
  const [selected, setSelected] = React.useState(window.localStorage.getItem('selectedUser') === props.username)

  React.useEffect(() => {
    const handleStorageChange = (ev: StorageEvent) => {
      if (ev.key === 'selectedUser') setSelected(window.localStorage.getItem('selectedUser') === props.username)
    }
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [props.username])

  return (
    <Box
      as="button"
      height="50px"
      width='180px'
      lineHeight="1.2"
      transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
      border="1px"
      px="8px"
      borderRadius="2px"
      fontSize="14px"
      fontWeight="semibold"
      borderColor="#ccd0d5"
      color={selected ? "white" : "black"}
      style={{ backgroundColor: selected ? "#4CAF50" : "" }}
      _hover={{ transform: "scale(1.02)" }}
      _active={{
        transform: "scale(0.98)",
      }}
      _focus={{
        boxShadow:
          "0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)",
      }}
      onClick={() => {
        window.localStorage.setItem('selectedUser', props.username)
        setSelected(true)
        window.postMessage({ name: 'closeUserSelect' }, '*')
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Image src={`https://crafatar.com/avatars/${props.uuid}`} fallbackSrc='https://mc-heads.net/avatar/MHF_Steve' boxSize="32px" float={'left'} />
        <span style={{ alignSelf: 'center' }}>{props.username}</span>
      </div>
    </Box>
  );
}

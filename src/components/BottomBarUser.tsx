import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import GetUsers from "./userselect/GetUsers.tsx";
import React from "react";
import CreateUserModal from "./userselect/CreateUserModal.tsx";

export default function BottomBarUser() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    const handle = (ev: MessageEvent) => {
      if (ev.data.name === 'closeUserSelect' || ev.data.name === 'closeCreateUserModal') return onClose()
      window.removeEventListener('message', handle)
    }
    window.addEventListener('message', handle)
  }, [])
  return (
    <div>
      <Button
        onClick={onOpen}
        width={"137px"}
        height={"59px"}
        border={"none"}
        color={'white'}
        fontSize={'20px'}
        borderRadius={0}
        // rightIcon={<Icon icon={faUser} />}
        bgGradient={"linear-gradient(90deg, #88b86d 0%, #4b6124 100%)"}
        _hover={{ bgGradient: "linear-gradient(90deg, #88b86d 0%, #4b6124 100%)" }}
      >
        Accounts
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              <GetUsers />
          </ModalBody>

          <ModalFooter>
            <CreateUserModal />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
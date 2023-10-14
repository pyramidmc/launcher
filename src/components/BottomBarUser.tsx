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

export default function BottomBarUser() {
  const { isOpen, onOpen, onClose } = useDisclosure();
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <GetUsers />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Create account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
import {
	useDisclosure,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
} from "@chakra-ui/react";
import CreateUserStepper from "./CreateUserStepper.tsx";
import React from "react";

export default function CreateUserModal() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	React.useEffect(() => {
		const handle = (ev: MessageEvent) => {
			if (ev.data.name === "closeCreateUserModal") return onClose();
			window.removeEventListener("message", handle);
		};
		window.addEventListener("message", handle);
	}, []);
	return (
		<>
			<Button colorScheme="blue" mr={3} onClick={onOpen}>
				Add account
			</Button>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent height="300px">
					<ModalHeader>Add an account</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<CreateUserStepper />
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}

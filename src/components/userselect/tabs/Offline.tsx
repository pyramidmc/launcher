import { Button, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import { useState } from "react";
import randomemail from 'better-random-email'
import { randomString } from 'util-utils'

function OfflineTab() {
    const [submitting, setSubmitting] = useState(false);
    const [username, setUsername] = useState('');
    const toast = useToast()
    const onSubmit = () => {
        setSubmitting(true)
        fetch('/tree/api/createUserAndAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: randomemail(),
                username: username,
                password: randomString(16)
            })
        })
            .then(() => {
                setSubmitting(false)
                closeAllModals()
                window.localStorage.setItem('selectedUser', username)
                toast({
                    title: `Account ${username} created!`,
                    description: "Done! The account has now been selected and it's ready to be used.",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                })
            })
            .catch((err) => {
                setSubmitting(false)
                closeAllModals()
                toast({
                    title: `Account ${username} wasn't created`,
                    description: err.message,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            })
    }
    const closeAllModals = () => {
        window.parent.postMessage({ name: 'closeCreateUserModal' }, '*')
    }
    return (
        <>
            <form id="offline-form">
                <FormControl isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input placeholder='Choose a Minecraft username!' onChange={(e) => setUsername(e.target.value)} />
                    <Button
                        mt={4}
                        isLoading={submitting}
                        colorScheme="green"
                        onClick={onSubmit}
                        type='submit'
                        form="offline-form"
                    >
                        Submit
                    </Button>
                </FormControl>
            </form>
        </>
    );
}

export default OfflineTab;
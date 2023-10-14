import ky from 'ky';
import React from "react";
import UserCard from './UserCard.tsx';
import './GetUsers.css'

export default function GetUsers() {
    const [users, setUsers] = React.useState<UsersState[]>([])
  
    React.useEffect(() => {
      setUsers([])
      const asyncFunction = async () => {
        await ky.get('/tree/api/getUsers').then(async (res) => {
            const treatedData = (await res.json() as TreeApiResponse[]).map(user => {
                return { username: user.username, type: 'offline', uuid: undefined } as UsersState
            })
            setUsers([...users, ...treatedData])
        })
      }
      asyncFunction()
    }, [])
    return (
      <div className='users'>{users.map(user => <UserCard {...user} />)}</div>
    )
}

interface UsersState {
    username: string;
    type: 'microsoft' | 'mojang' | 'offline';
    uuid?: string;
}

interface TreeApiResponse {
  username: string;
}
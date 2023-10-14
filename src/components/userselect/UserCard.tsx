import './UserCard.css'

export default function UserCard(props: { username: string, type: 'microsoft' | 'mojang' | 'offline', uuid?: string }) {
    return (
        <div className='card'>
            <p className='username'>{props.username}</p>
        </div>
    )
}
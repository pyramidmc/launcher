import { Client } from "@xhayper/discord-rpc";

export class rpcChange {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    playingMC(version: string, username: string) {
        this.client.user?.setActivity({
            state: `Playing Minecraft ${version}`,
            largeImageKey: 'mainlogo',
            smallImageKey: `https://mc-heads.net/avatar/${username}`,
            smallImageText: username
        });
    }

    onLauncher() {
        this.client.user?.setActivity({
            state: 'On the launcher',
            largeImageKey: 'mainlogo'
        });
    }
}
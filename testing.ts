    import { launch } from "@xmcl/core";
import { YggdrasilClient, YggrasilAuthentication } from "@xmcl/user";

async function doShit() {
    const version = '1.20.1'
    const javaPath = 'java'
    const gamePath = 'C:/Users/USER/AppData/Roaming/.minecraft'

    const client = new YggdrasilClient('http://localhost:8081/auth');
    const username = 'cmm@srizan.dev'
    const password = 'asdfghbelwsv'

    const auth = await client.login({ username, password, clientToken: 'jhadskblaekljbhklnbgeak' }).catch(e => {return console.error(e)})

    const l = await launch({ gamePath, javaPath, version, accessToken: (auth as YggrasilAuthentication).accessToken, gameProfile: (auth as YggrasilAuthentication).selectedProfile, extraJVMArgs: ['-Dminecraft.api.auth.host=http://localhost:8081/auth', '-Dminecraft.api.account.host=http://localhost:8081/account', '-Dminecraft.api.session.host=http://localhost:8081/session', '-Dminecraft.api.services.host=http://localhost:8081/services'] });
    l.stdout?.on('data', (data) => {
        console.log(data.toString())
    })
    l.stderr?.on('data', (data) => {
        console.log(data.toString())
    })
}

doShit()
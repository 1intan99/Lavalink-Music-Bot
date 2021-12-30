<h1 align="center">Lavalink Music Bot</h1>
<br />
<p align="center">
        <img src="https://cdn.discordapp.com/attachments/891235330735366164/891387071376269342/amelia_corp.png" alt="Amelia Corp." width="200" height="200">
    </a>
    <p align="center">
        Lavalink Music Bot is a powerful Management with many features
        <br>
        Example Bot Below:
        <br>
        <a href="https://discord.com/api/oauth2/authorize?client_id=492600047268134912&permissions=515869309047&scope=bot">Nao Tomori!</a>
        <br>
        <a href="https://discord.com/api/oauth2/authorize?client_id=480644131782131732&permissions=515869309047&scope=bot">Narberal Gamma!</a>
    </p>
</p>


## ✨ About
Lavalink Music Bot made by Nao#9774 focusing to be a power full discord music bot and have a loot of features

Lavalink Music Bot still in development mode and will have a loot of features

 ## 🎶 Music Features
 Nao has a Music Features that can play music from SoundCloud, Spotify, YouTube, Radio Link
- The music feature can play music directly from spotify.
- Music feature that uses buttons for easy control and does not have to type commands to change songs, stop songs, or view song lists 
- Support 24 hours without leaving the voice channel and this is set by default.
- Auto Leave Channel when there is no someone in Voice Chanenl.

## 📥 Self Hosting Instruction
- Download Node.JS LTS version from [here](https://nodejs.org)
- Install typescript and ts-node globaly by doing this commands
```
npm i -g typescript ts-node
```
- Clone this repositroy by doing this commands
```
git clone https://github.com/ameliakiara/Lavalink-Music-Bot
```
Note: If you doesn't have git you can download this repository or download git from [here](https://git-scm.com/)
- Install the depencies from by doing this command
```
npm install --save
```
- Setting up you `Lavalink Server`
    - Self Host method
    - Install Java/OpenJDK/Zulu ( Recommended v13 )
    - Download requirement that i mentioned above
    - Download binaries from the [CI server](https://ci.fredboat.com/viewLog.html?buildId=lastSuccessful&buildTypeId=Lavalink_Build&tab=artifacts&guest=1) or [the GitHub releases.](https://github.com/freyacodes/Lavalink/releases)
    - Put an `application.yml` file in the same folder of `Lavalink.jar` [(Example here)](https://github.com/freyacodes/Lavalink/blob/master/LavalinkServer/application.yml.example)
    - Run with `java -jar Lavalink.jar`
- Setting up `.env` file
```
# Discord Bot Token
# Get it from (https://discord.com/developers/applications)
TOKEN=

# Discord Ids of bot's developers
# Value must be an array
DEVELOPERS=[""]

# Discord bot's prefix
PREFIX=

# Send error message on console to sentry.io
# Get it from (https://sentry.io)
DSN=

# Lavalink Server
HOST=
PASSWORD=

# Spotify Client ID & Secret
# Get it from (https://developer.spotify.com/dashboard/)
clientID=
clientSecret=

# WebClient Port
# Acces it from (http://localhost:5572)
# Or just custom your port with what ever you want (Ex: 1238102381209380923812093 ) nice right?
PORT=5572

# TOP_GG Poster
# Put your top.gg discord bot token from webhook page in top.gg dashboard when you edit your bot
TOP_GG=


# MongoDB Client
# Get it from (https://mlab.com, https://account.mongodb.com/account/login, https://railway.app <= plugins)
MONGOD=
```
- After all those stepp is done, run this command
```
npm run build && npm start
```
- And your bot ready to go.
- Also fell free to give me star or donate me from link below to keep me update this repo and add more features!
- If you fell this is hard, or you don't understand, just click `Deploy on Railway` and just setting the `Variable aka .env` and your Bot ready to go
- [For Free Lavalink Server List.](https://lavalink-list.darrennathanael.com/)

## 📈 Project Stats
![Alt](https://repobeats.axiom.co/api/embed/ce3ea2c2e44919e8c402b58880be7981d6ba4087.svg "Repobeats analytics image")

## 🎗️ Support me to keep update this repo and pay hosting for my bot :3
<p>
    <img src="https://cdn.discordapp.com/emojis/780550863545565235.png?size=22">
        <a href="https://patreon.com/ameliakiara">Patreon</a>
        <br />
    <img src="https://cdn.discordapp.com/emojis/918318731598393354.png?size=22">
        <a href="https://paypal.me/luminaluna">Patreon</a>
        <br />
    <img src="https://cdn.discordapp.com/emojis/915037206257737738.png?size=22">
        <a href="https://trakteer.id/ameliakiara">Trakteer</a>
</p>

## 🚄 Deploy on Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2Fameliakiara%2FLavalink-Music-Bot&envs=clientId%2CclientSecret%2CDEVELOPERS%2CDSN%2CHOST%2CPASSWORD%2CPREFIX%2CTOKEN%2CTOP_GG%2CMONGOD&optionalEnvs=TOP_GG&clientIdDesc=Spotify+Client+ID&clientSecretDesc=Spotify+Client+Secret&DEVELOPERSDesc=Developers+must+be+an+array+example%3A+%5B%22dev.id%22%5D&DSNDesc=Get+your+DSN+Logger+at+sentry.io&HOSTDesc=Lavalink+Host+IP&PASSWORDDesc=Lavalink+Password&PREFIXDesc=Your+discord+bot+prefix&TOKENDesc=Your+discord+bot+Token+get+it+on+%28https%3A%2F%2Fdiscord.com%2Fdevelopers%29&TOP_GGDesc=Get+it+on+%28https%3A%2F%2Ftop.gg%29+you+can+get+it+when+your+bot+apporve+at+top.gg&MONGODDesc=Your+mongodb+database+%28you+can+get+it+from+railway+instaly+or+create+your+own+add+mongodb+site%29&referralCode=AmeliaCorp)
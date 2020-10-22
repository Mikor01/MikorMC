const {Client, MessageEmbed} = require('discord.js')
 
const bot = new Client()
 
const ping = require('minecraft-server-util')
 
const PREFIX = '!'

var status = 'Connecting to Server...'

function update(){
    
    try{
            ping(process.env.ADRESS, process.env.PORT, (error, response) =>{
                if(error)
                {
                    status = 'Server offline'
                    bot.user.setStatus('dnd')
                    .catch(console.error);
                }
                else{
                    if(response.onlinePlayers == 0)
                    {
                        status = 'No players online'
                        bot.user.setStatus('idle')
                        .catch(console.error);
                    }
                    else if (response.onlinePlayers > 0)
                    {
                        status = 'Online: ' + response.onlinePlayers + '/' + response.maxPlayers
                        bot.user.setStatus('online')
                        .catch(console.error);
                    }
                }
            })
        }
    catch(err){
            bot.user.setStatus('dnd')
            .catch(console.error);
            status = 'Server offline'
        }
    bot.user.setActivity(status, {type: 'WATCHING' })
    .then(presence => console.log(status))
    .catch(console.error);
}

bot.on('ready', () =>{
    console.log('Bot has come online.')
    bot.user.setStatus('dnd')
    bot.setInterval(update,5000);
})

bot.on('message', message =>{
 
    let args = message.content.substring(PREFIX.length).split(' ')
 
    switch(args[0]){
        case 'mc':
            ping(process.env.ADRESS, process.env.PORT, (error, reponse) =>{
                if(error) throw error
                const Embed = new MessageEmbed()
				.setColor("RANDOM")
                .setTitle('Server Status')
                .addField('Server IP', reponse.host)
                .addField('Server Version', reponse.version)
                .addField('Online Players', reponse.onlinePlayers)
                .addField('Max Players', reponse.maxPlayers)
                message.channel.send(Embed)
                
            })
        break
 
    }
 
})
 
bot.login(process.env.TOKEN)
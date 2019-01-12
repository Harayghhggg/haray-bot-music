const Discord = require('discord.js');

const Util = require('discord.js');

const getYoutubeID = require('get-youtube-id');

const fetchVideoInfo = require('youtube-info');

const YouTube = require('simple-youtube-api');

const youtube = new YouTube("AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8");

const queue = new Map();

const ytdl = require('ytdl-core');

const fs = require('fs');

const gif = require("gif-search");

const client = new Discord.Client({disableEveryone: true});

const prefix = "H";
/////////////////////////
////////////////////////


client.on("message", async message => {
  if(message.content.startsWith(prefix + "join")) {
      if(message.author.id === "319624924769681412" || message.author.id == "319624924769681412") {
      
    let args = message.content.split(" ").slice(1).join(" ");
      if(!args) {
        return message.channel.send("**يرجــى تحديـد روم صوتــي مـع الآمـر ء .**");
      }
        let room = message.guild.channels.find(a => a.name.includes(args));
          room.join() .then(() => {
            message.channel.send(`**تـم تثبيــت البـوت فـي روم , \`${room.name}\`**`) .then((m) => {
              m.delete(5000);
            });
          });
            
  } else {
    return message.channel.send("**آنــت لست مؤهــل لآستخـدآم هذا الآمــر ء .**");
  }
}
});
       

client.on('message', message => {
	var args = message.content.split(' ').slice(1);
	var argresult = args.join(' ');
	if (message.author.id === "319624924769681412") {
  
  
	if (message.content.startsWith(prefix + 'wt')) {
	client.user.setActivity(argresult, {type: 'WATCHING'})
	   console.log('test' + argresult);
	  message.channel.sendMessage(`Watch Now: **${argresult}**`)
  }
  
  
	if (message.content.startsWith(prefix + 'ls')) {
	client.user.setActivity(argresult, {type: 'LISTENING'})
	   console.log('test' + argresult);
	  message.channel.sendMessage(`LISTENING Now: **${argresult}**`)
  }
  
  
  if (message.content.startsWith(prefix + 'setname')) {
	client.user.setUsername(argresult).then
		message.channel.sendMessage(`Successfuly changed name to :white_check_mark:  **${argresult}**`)
  }
  
  if (message.content.startsWith(prefix + 'setavatar')) {
	client.user.setAvatar(argresult);
	 message.channel.sendMessage(`Successfully changed avatar to :white_check_mark:  **${argresult}**`);
  }
  
  if (message.content.startsWith(prefix + 'st')) {
	client.user.setGame(argresult, "https://www.twitch.tv/9ivv");
	   console.log('test' + argresult);
	  message.channel.sendMessage(`Streaming: **${argresult}**`)
  }
  if (message.content.startsWith(prefix + 'ply')) {
	client.user.setGame(argresult);
	   console.log('test' + argresult);
	  message.channel.sendMessage(`Playing: **${argresult}**`)
  }
  
  
	}
  });

client.on('message', async msg =>{
	if (msg.author.bot) return undefined;
    if (!msg.content.startsWith(prefix)) return undefined;
    
    let args = msg.content.split(' ');

	let command = msg.content.toLowerCase().split(" ")[0];
	command = command.slice(prefix.length)

    if(command === `ping`) {
    let embed = new Discord.RichEmbed()
    .setColor(3447003)
    .setTitle("Pong!!")
    .setDescription(`${client.ping} ms,`)
    .setFooter(`Requested by | ${msg.author.tag}`);
    msg.delete().catch(O_o=>{})
    msg.channel.send(embed);
    }
});
client.on('message', async msg => { 	if (msg.author.bot) return undefined;	if (!msg.content.startsWith(prefix)) return undefined;	const args = msg.content.split(' ');	const searchString = args.slice(1).join(' ');	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';	const serverQueue = queue.get(msg.guild.id);	let command = msg.content.toLowerCase().split(" ")[0];	command = command.slice(prefix.length)	if (command === `play`) {		const voiceChannel = msg.member.voiceChannel;		if (!voiceChannel) return msg.channel.send('يجب توآجد حضرتك بروم صوتي .');		const permissions = voiceChannel.permissionsFor(msg.client.user);		if (!permissions.has('CONNECT')) {						return msg.channel.send('لا يتوآجد لدي صلاحية للتكلم بهذآ الروم');		}		if (!permissions.has('SPEAK')) {			return msg.channel.send('لا يتوآجد لدي صلاحية للتكلم بهذآ الروم');		} 		if (!permissions.has('EMBED_LINKS')) {			return msg.channel.sendMessage("**يجب توآفر برمشن `EMBED LINKS`لدي **")		} 		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {			const playlist = await youtube.getPlaylist(url);			const videos = await playlist.getVideos();						for (const video of Object.values(videos)) {				const video2 = await youtube.getVideoByID(video.id);				await handleVideo(video2, msg, voiceChannel, true);			}			return msg.channel.send(` **${playlist.title}** تم الإضآفة إلى قأئمة التشغيل`);		} else {			try { 				var video = await youtube.getVideo(url);			} catch (error) {				try {					var videos = await youtube.searchVideos(searchString, 5);					let index = 0;					const embed1 = new Discord.RichEmbed()			 .setDescription(`**الرجآء من حضرتك إختيآر رقم المقطع** :${videos.map(video2 => `[**${++index} **] \`${video2.title}\``).join('\n')}`) 					.setFooter("FireBot")					msg.channel.sendEmbed(embed1).then(message =>{message.delete(20000)})										try {						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {							maxMatches: 1,							time: 15000,							errors: ['time']						});					} catch (err) {						console.error(err);						return msg.channel.send('لم يتم إختيآر مقطع صوتي');					}					const videoIndex = parseInt(response.first().content);					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);				} catch (err) {					console.error(err);					return msg.channel.send(':X: لا يتوفر نتآئج بحث ');				}			} 			return handleVideo(video, msg, voiceChannel);		}	} else if (command === `skip`) {		if (!msg.member.voiceChannel) return msg.channel.send('أنت لست بروم صوتي .');		if (!serverQueue) return msg.channel.send('لا يتوفر مقطع لتجآوزه');		serverQueue.connection.dispatcher.end('تم تجآوز هذآ المقطع');		return undefined;	} else if (command === `stop`) {		if (!msg.member.voiceChannel) return msg.channel.send('أنت لست بروم صوتي .');		if (!serverQueue) return msg.channel.send('لا يتوفر مقطع لإيقآفه');		serverQueue.songs = [];		serverQueue.connection.dispatcher.end('تم إيقآف هذآ المقطع');		return undefined;	} else if (command === `vol`) {		if (!msg.member.voiceChannel) return msg.channel.send('أنت لست بروم صوتي .');		if (!serverQueue) return msg.channel.send('لا يوجد شيء شغآل.');		if (!args[1]) return msg.channel.send(`:loud_sound: مستوى الصوت **${serverQueue.volume}**`);		serverQueue.volume = args[1];		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 50);		return msg.channel.send(`:speaker: تم تغير الصوت الي **${args[1]}**`);	} else if (command === `np`) {		if (!serverQueue) return msg.channel.send('لا يوجد شيء حالي ف العمل.');		const embedNP = new Discord.RichEmbed()	.setDescription(`:notes: الان يتم تشغيل : **${serverQueue.songs[0].title}**`)		return msg.channel.sendEmbed(embedNP);	} else if (command === `queue`) {				if (!serverQueue) return msg.channel.send('لا يوجد شيء حالي ف العمل.');		let index = 0;				const embedqu = new Discord.RichEmbed() .setDescription(`**Songs Queue**${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}**الان يتم تشغيل** ${serverQueue.songs[0].title}`)		return msg.channel.sendEmbed(embedqu);	} else if (command === `pause`) {		if (serverQueue && serverQueue.playing) {			serverQueue.playing = false;			serverQueue.connection.dispatcher.pause();			return msg.channel.send('تم إيقاف الموسيقى مؤقتا!');		}		return msg.channel.send('لا يوجد شيء حالي ف العمل.');	} else if (command === "resume") {		if (serverQueue && !serverQueue.playing) {			serverQueue.playing = true;			serverQueue.connection.dispatcher.resume();			return msg.channel.send('استأنفت الموسيقى بالنسبة لك !');		}		return msg.channel.send('لا يوجد شيء حالي في العمل.');	} 	return undefined;}); async function handleVideo(video, msg, voiceChannel, playlist = false) {	const serverQueue = queue.get(msg.guild.id);	console.log(video);	//	console.log('yao: ' + Util.escapeMarkdown(video.thumbnailUrl));	const song = {		id: video.id,		title: Util.escapeMarkdown(video.title),		url: `https://www.youtube.com/watch?v=${video.id}`	};	if (!serverQueue) {		const queueConstruct = {			textChannel: msg.channel,			voiceChannel: voiceChannel,			connection: null,			songs: [],			volume: 5,			playing: true		};		queue.set(msg.guild.id, queueConstruct); 		queueConstruct.songs.push(song); 		try {			var connection = await voiceChannel.join();			queueConstruct.connection = connection;			play(msg.guild, queueConstruct.songs[0]);		} catch (error) {			console.error(`I could not join the voice channel: ${error}`);			queue.delete(msg.guild.id);			return msg.channel.send(`لا أستطيع دخول هذآ الروم ${error}`);		}	} else {		serverQueue.songs.push(song);		console.log(serverQueue.songs);		if (playlist) return undefined;		else return msg.channel.send(` **${song.title}** تم اضافه الاغنية الي القائمة!`);	}	return undefined;} function play(guild, song) {	const serverQueue = queue.get(guild.id); 	if (!song) {		serverQueue.voiceChannel.join();		queue.delete(guild.id);		return;	}	console.log(serverQueue.songs); 	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))		.on('end', reason => {			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');			else console.log(reason);			serverQueue.songs.shift();			play(guild, serverQueue.songs[0]);		})		.on('error', error => console.error(error));	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5); 	serverQueue.textChannel.send(`بدء تشغيل : **${song.title}**`);}


client.on(`message`, message => {
    if (message.content === `${prefix}help`) {
      message.react(`🎵`)
        let helpEmbed = new Discord.RichEmbed()
        .setTitle(`**أوامر الميوزك...**`)
        .addField(`${prefix}play`, `لتشغيل اغنية`)
        .addField(`${prefix}join`, `دخول رومك الصوتي`)
        .addField(`${prefix}disconnect`, `الخروج من رومك الصوتي`)
        .addField(`${prefix}skip`, `تخطي الأغنية`)
        .addField(`${prefix}pause`, `ايقاف الاغنية مؤقتا`)
        .addField(`${prefix}resume`, `تكملة الاغنية`)
        .addField(`${prefix}queue`, `اظهار قائمة التشغيل`)
        .addField(`${prefix}np`, `اظهار الاغنية اللي انت مشغلها حاليا`);
      message.author.send(helpEmbed) .then(message.channel.send(`**Sent. :white_check_mark: **`))      
    }
});


client.on("message", (message) => {
	    if(message.content.startsWith(prefix+"gmail")) {
		            message.channel.send(JSON.stringify({
				                email: Math.random().toString(36).slice(4).trim()+"@gmail.com",
				                password: Math.random().toString(36).slice(4).trim()
			    }))
	    }
})


//Best Rainbow Bot .
client.on('message', message => {//new msg event
if(!message.channel.guild) return;
  if(message.content.startsWith(prefix + 'set')) {//to create the rainbow role
	  let role = message.guild.roles.find('name', 'Rainbow bot.')
    if(role) return message.channel.send(`This Step Already Completed !`)//if the role already created return with this msg
  //start of create role 
  if(!role){
    rainbow =  message.guild.createRole({
   name: "Rainbow bot.",//the role will create name
   color: "#000000",//the default color
   permissions:[]//the permissions
 //end of create role
})

}
message.channel.send('Done The Rainbow Role Setup Has Been Completed')//if the step completed
}})

client.on('ready', () => {//new ready event
  setInterval(function(){
      client.guilds.forEach(g => {
                  var role = g.roles.find('name', 'Rainbow bot.');//rainbow role name
                  if (role) {
                      role.edit({color : "RANDOM"});
                  };
      });
  }, 5000);//the rainbow time
})




client.login(process.env.BOT_TOKEN);

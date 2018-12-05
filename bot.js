const Discord = require('discord.js');

const client = new Discord.Client();

const Util = require('discord.js');

const getYoutubeID = require('get-youtube-id');

const fetchVideoInfo = require('youtube-info');

const YouTube = require('simple-youtube-api');

const youtube = new YouTube("AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8");

const queue = new Map();

const ytdl = require('ytdl-core');

const fs = require('fs');

const gif = require("gif-search");

const prefix = "H"

/////////////////////////

////////////////////////

//////////////////////

/////////////////////////

////////////////////////

//////////////////////

/////////////////////////

////////////////////////

//////////////////////

/////////////////////////

////////////////////////

//////////////////////

client.on('ready', () => {

    console.log(`Logged in as ${client.user.tag}!`);

    console.log(`in ${client.guilds.size} servers `)

    console.log(`[Codes] ${client.users.size}`)

    client.user.setStatus("idle")

});

client.on('ready', () => {

});

client.on('message', async msg => { 

	if (msg.author.bot) return undefined;

    if (!msg.content.startsWith(prefix)) return undefined;

    

    const args = msg.content.split(' ');

	const searchString = args.slice(1).join(' ');

    

	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';

	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(" ")[0];

	command = command.slice(prefix.length)

	if (command === `play`) {

		const voiceChannel = msg.member.voiceChannel;

        

        if (!voiceChannel) return msg.channel.send("لا أستطيع العثور عليك في أي قناة صوتية");

        

        const permissions = voiceChannel.permissionsFor(msg.client.user);

        

        if (!permissions.has('CONNECT')) {

			return msg.channel.send("ليس لدي أذونات كافية للانضمام إلى قناتك الصوتية!");

        }

        

		if (!permissions.has('SPEAK')) {

			return msg.channel.send("ليس لدي أذونات كافية للتحدث في قناتك الصوتية!");

		}

		if (!permissions.has('EMBED_LINKS')) {

			return msg.channel.sendMessage("URL ليس لدي أذونات كافية لإدخال عناوين !")

		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {

			const playlist = await youtube.getPlaylist(url);

            const videos = await playlist.getVideos();

            

			for (const video of Object.values(videos)) {

                

                const video2 = await youtube.getVideoByID(video.id); 

                await handleVideo(video2, msg, voiceChannel, true); 

            }

			return msg.channel.send(`**${playlist.title}**, فقط تضاف إلى قائمة الانتظار!`);

		} else {

			try {

                var video = await youtube.getVideo(url);

                

			} catch (error) {

				try {

					var videos = await youtube.searchVideos(searchString, 5);

					let index = 0;

                    const embed1 = new Discord.RichEmbed()

                    .setTitle(":mag_right:  نتائج بحث YouTube:")

                    .setDescription(`

                    ${videos.map(video2 => `${++index}. **${video2.title}**`).join('\n')}`)

                    

					.setColor("#f7abab")

					msg.channel.sendEmbed(embed1).then(message =>{message.delete(20000)})

					

/////////////////					

					try {

						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {

							maxMatches: 1,

							time: 15000,

							errors: ['time']

						});

					} catch (err) {

						console.error(err);

						return msg.channel.send('لا أحد يستجيب لعدد !!');

                    }

                    

					const videoIndex = parseInt(response.first().content);

                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);

                    

				} catch (err) {

					console.error(err);

					return msg.channel.send("لم أجد أي نتائج!");

				}

			}

            return handleVideo(video, msg, voiceChannel);

            

        }

        

	} else if (command === `skip`) {

		if (!msg.member.voiceChannel) return msg.channel.send("يجب أن تكون في قناة صوتية لتشغيل أوامر الموسيقى!");

        if (!serverQueue) return msg.channel.send("ليس هناك قائمة انتظار للتخطي !!");

		serverQueue.connection.dispatcher.end('حسنا ، تخطي!');

        return undefined;

        

	} else if (command === `stop`) {

		if (!msg.member.voiceChannel) return msg.channel.send("يجب أن تكون في قناة صوتية لتشغيل أوامر الموسيقى!");

        if (!serverQueue) return msg.channel.send("ليس هناك شيء لايقافه!!");

        

		serverQueue.songs = [];

		serverQueue.connection.dispatcher.end('حسنًا ، تم إيقافه وفصله عن قناة الصوت الخاصة بك');

        return undefined;

        

	} else if (command === `vol`) {

		if (!msg.member.voiceChannel) return msg.channel.send("يجب أن تكون في قناة صوتية لتشغيل أوامر الموسيقى!");

		if (!serverQueue) return msg.channel.send('يمكنك فقط استخدام هذا الأمر أثناء تشغيل الموسيقى!');

        if (!args[1]) return msg.channel.send(`درجة الصوت  **${serverQueue.volume}**`);

        

		serverQueue.volume = args[1];

        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 50);

        

        return msg.channel.send(`درجة الصوت  **${args[1]}**`);

	} else if (command === `np`) {

		if (!serverQueue) return msg.channel.send('لا يوجد قائمة انتظار!');

		const embedNP = new Discord.RichEmbed()

	    .setDescription(`الان تشغيل **${serverQueue.songs[0].title}**`)

        return msg.channel.sendEmbed(embedNP);

        

	} else if (command === `queue`) {

		

		if (!serverQueue) return msg.channel.send('لا يوجد قائمة انتظار!');

		let index = 0;

//	//	//

		const embedqu = new Discord.RichEmbed()

        .setTitle("The Queue Songs :")

        .setDescription(`

        ${serverQueue.songs.map(song => `${++index}. **${song.title}**`).join('\n')}

**Now playing :** **${serverQueue.songs[0].title}**`)

        .setColor("#f7abab")

		return msg.channel.sendEmbed(embedqu);

	} else if (command === `pause`) {

		if (serverQueue && serverQueue.playing) {

			serverQueue.playing = false;

			serverQueue.connection.dispatcher.pause();

			return msg.channel.send('حسنا , توقف');

		}

		return msg.channel.send('لا يوجد قائمة انتظار إلى إيقاف مؤقت!');

	} else if (command === "اعادة") {

		if (serverQueue && !serverQueue.playing) {

			serverQueue.playing = true;

			serverQueue.connection.dispatcher.resume();

            return msg.channel.send('حسنا , اعادة!');

            

		}

		return msg.channel.send('قائمة الانتظار فارغة!');

	}

	return undefined;

});

async function handleVideo(video, msg, voiceChannel, playlist = false) {

	const serverQueue = queue.get(msg.guild.id);

	console.log(video);

	 

	const song = {

		id: video.id,

		title: Util.escapeMarkdown(video.title),

		url: `https://www.youtube.com/watch?v=${video.id}`

	};

	if (!serverQueue) {

		const queueConstruct = {

			textChannel: msg.channel,

			voiceChannel: voiceChannel,

			connection: null,

			songs: [],

			volume: 5,

			playing: true

		};

		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {

			var connection = await voiceChannel.join();

			queueConstruct.connection = connection;

			play(msg.guild, queueConstruct.songs[0]);

		} catch (error) {

			console.error(`I could not join the voice channel: ${error}!`);

			queue.delete(msg.guild.id);

			return msg.channel.send(`Can't join this channel: ${error}!`);

		}

	} else {

		serverQueue.songs.push(song);

		console.log(serverQueue.songs);

		if (playlist) return undefined;

		else return msg.channel.send(`**${song.title}**, just added to the queue! `);

	} 

	return undefined;

}

function play(guild, song) {

	const serverQueue = queue.get(guild.id);

	if (!song) {

		serverQueue.voiceChannel.leave();

		queue.delete(guild.id);

		return;

	}

	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))

		.on('end', reason => {

			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');

			else console.log(reason);

			serverQueue.songs.shift();

			play(guild, serverQueue.songs[0]);

		})

		.on('error', error => console.error(error));

	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`**${song.title}**, تشتغل الان!`);

}

/////////////////////////

////////////////////////

//////////////////////

/////////////////////////

////////////////////////

//////////////////////

client.on('message', message => {

if (message.content.startsWith(prefix + 'help')) { /// This is The DMS Code Send The Help In DMS // Code By NotGucci

    let pages = [`

	

        ***__أوامر الموسيفة__***

**

${prefix}play - لتشغيل أغنية برآبط أو بأسم

${prefix}come - حتى تثبت البوت بروم

${prefix}skip - لتجآوز الأغنية الحآلية

${prefix}pause - إيقآف الأغنية مؤقتا

${prefix}resume - لموآصلة الإغنية بعد إيقآفهآ مؤقتا

${prefix}vol - لتغيير درجة الصوت 100 - 0』

${prefix}stop - لإخرآج البوت من الروم

${prefix}np - لمعرفة الأغنية المشغلة حآليا

${prefix}queue - لمعرفة قآئمة التشغيل

**

  

   

`]

    let page = 1;

    let embed = new Discord.RichEmbed()

    .setColor('RANDOM')

    .setFooter(`Page ${page} of ${pages.length}`)

    .setDescription(pages[page-1])

    message.author.sendEmbed(embed).then(msg => {

        msg.react('◀').then( r => {

            msg.react('▶')

        const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;

        const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;

        const backwards = msg.createReactionCollector(backwardsFilter, { time: 2000000});

        const forwards = msg.createReactionCollector(forwardsFilter, { time: 2000000});

        backwards.on('collect', r => {

            if (page === 1) return;

            page--;

            embed.setDescription(pages[page-1]);

            embed.setFooter(`Page ${page} of ${pages.length}`);

            msg.edit(embed)

        })

        forwards.on('collect', r => {

            if (page === pages.length) return;

      

      page++;

            embed.setDescription(pages[page-1]);

            embed.setFooter(`Page ${page} of ${pages.length}`);

            msg.edit(embed)

        })

        })

    })

    }

}); 

client.on('message', message => {

     if (message.content === (prefix + "help")) {

     let embed = new Discord.RichEmbed()

  .setAuthor(message.author.username)

  .setColor("#8650a7")

  .addField("Done" , " تــــم ارســالك في الخــاص")

  message.channel.sendEmbed(embed);

    }

});

client.on('message', message => {

 if(message.content.startsWith(prefix + "come")) {

message.member.voiceChannel.join();

}

});

const developers = ["319624924769681412"]

const adminprefix = "h!";

client.on('message', message => {

    var argresult = message.content.split(` `).slice(1).join(' ');

      if (!developers.includes(message.author.id)) return;

      

  if (message.content.startsWith(adminprefix + 'pl')) {

    client.user.setGame(argresult);

      message.channel.send(`**Status You   ${argresult}**`)

  } else 

  if (message.content.startsWith(adminprefix + 'wt')) {

  client.user.setActivity(argresult, {type:'WATCHING'});

      message.channel.send(`**Status You   ${argresult}**`)

  } else 

  if (message.content.startsWith(adminprefix + 'ls')) {

  client.user.setActivity(argresult , {type:'LISTENING'});

      message.channel.send(`**Status You  ${argresult}**`)

  } else 

  if (message.content.startsWith(adminprefix + 'st')) {

    client.user.setGame(argresult, "https://www.twitch.tv/kokoseda");

      message.channel.send(`**Status You ${argresult} **`)

  }

  if (message.content.startsWith(adminprefix + 'setname')) {

  client.user.setUsername(argresult).then

      message.channel.send(`Changing The Name To ..**${argresult}** `)

} else

if (message.content.startsWith(adminprefix + 'setavatar')) {

  client.user.setAvatar(argresult);

    message.channel.send(`Changing The Avatar To :**${argresult}** `);

}

});

 

client.login(process.env.BOT_TOKEN);

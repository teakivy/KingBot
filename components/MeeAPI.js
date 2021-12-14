const SimpleDiscord = require('simple-discord-modules');
const config = require('../config.json');
const build = require('../build.json');
const URLParser = require('js-video-url-parser');

const got = require('got');

module.exports = (client, instance) => {
	client.on('messageCreate', async (message) => {
		let enigmaChannel = client.channels.cache.get(config[build.type].channels.notifications.enigma);
		if (message.channel.id == config[build.type].channels.meeapi.youtube) {
			let channel = client.channels.cache.get(config[build.type].channels.notifications.youtube);

			let channelName = message.content.split('\n')[0];
			let url = message.content.split('\n')[1];

			let urlInfo = URLParser.parse(url);
			if (!urlInfo.id) return;

			let content;

			await (async () => {
				try {
					const response = await got(
						`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${urlInfo.id}&key=${process.env.YOUTUBE_API_KEY}`,
						{ json: true }
					).then(async (response) => {
						content = await response.body.items[0].snippet;
						if (!(await content)) return;

						let title = await content.title;
						// let uuid = uuidv4();

						channel.send(
							`<@&${config[build.type].roles.youtubeNotifications}> **${
								content.channelTitle
							}** just uploaded a new video!\n${url}`
						);
					});
				} catch (error) {
					console.log(error);
				}
			})();
		}

		if (message.channel.id == config[build.type].channels.meeapi.twitch) {
			let embed = message.embeds[0].setColor(config.color);

			let channel = client.channels.cache.get(config[build.type].channels.notifications.twitch);

			channel.send({ embeds: [embed] });
		}
	});
};

module.exports.config = {
	displayName: 'MeeAPI Handler',
	dbName: 'NONE',
};

const SimpleDiscord = require('simple-discord-modules');
const config = require('../config.json');
const build = require('../build.json');
const messages = require('../JSON/messages.json')[config.lang];

module.exports = {
	name: 'ping',
	slash: true,
	testOnly: build.type != 'release',
	category: 'Utility',
	description: 'Replies with Latency Statistics',
	callback: ({ interaction, client }) => {
		let reply = SimpleDiscord.embedMaker({
			title: messages.commands.ping.title,
			description: messages.commands.ping.response
				.replace('${latency}', `${interaction.createdTimestamp - Date.now()}ms`)
				.replace('${api_latency}', `${Math.round(client.ws.ping)}ms`),
			color: config.color,
		});

		interaction.reply({ embeds: [reply] });
	},
};

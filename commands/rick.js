const SimpleDiscord = require('simple-discord-modules');
const config = require('../config.json');
const build = require('../build.json');
const messages = require('../JSON/messages.json')[config.lang];

module.exports = {
	name: 'rick',
	slash: true,
	testOnly: build.type != 'release',
	category: 'Fun & Games',
	description: 'Roll',
	callback: ({ interaction }) => {
		let reply = SimpleDiscord.embedMaker({
			description: messages.commands.rick.response,
			color: config.color,
		});

		interaction.reply({ embeds: [reply] });
	},
};

const SimpleDiscord = require('simple-discord-modules');
const config = require('../config.json');
const messages = require('../JSON/messages.json')[config.lang];
const build = require('../build.json');

module.exports = {
	name: 'version',
	slash: true,
	testOnly: build.type != 'release',
	category: 'Utility',
	description: 'King Bot Version Info',
	callback: ({ interaction }) => {
		let reply = SimpleDiscord.embedMaker({
			title: messages.commands.version.title,
			description: messages.commands.version.response
				.replace('${build_name}', build.name)
				.replace('${build_date}', build.date),
			color: config.color,
		});

		interaction.reply({ embeds: [reply] });
	},
};

const SimpleDiscord = require('simple-discord-modules');
const config = require('../config.json');
const build = require('../build.json');
const messages = require('../JSON/messages.json')[config.lang];

module.exports = {
	name: 'hello',
	slash: true,
	testOnly: build.type != 'release',
	category: 'Fun & Games',
	description: 'Hi!',
	callback: ({ interaction }) => {
		let genHelloResponse = Math.floor(Math.random() * messages.responses.hello.length);
		interaction.reply({
			content: messages.responses.hello[genHelloResponse].replace(
				'${author_mention}',
				`<@${interaction.member.user.id}>`
			),
		});
	},
};

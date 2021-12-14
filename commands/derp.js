const SimpleDiscord = require('simple-discord-modules');
const config = require('../config.json');
const build = require('../build.json');
const messages = require('../JSON/messages.json')[config.lang];

module.exports = {
	name: 'derp',
	category: 'Fun & Games',
	slash: true,
	testOnly: build.type != 'release',
	description: 'How Derpy are you?',
	callback: ({ interaction }) => {
		// Generate Derpiness (0-100)
		let genDerpiness = Math.floor(Math.random() * 101);

		// Create Derp Embed
		/*
            0-45 > Hates Derp
            46-55 > Likes Derp
            56-100 > Loves Derp
        */
		let reply = SimpleDiscord.embedMaker({
			title: `${
				genDerpiness >= 55
					? messages.commands.derp.title.lovesDerp.replace('${username}', interaction.member.user.username)
					: ''
			}${
				genDerpiness > 45 && genDerpiness < 55
					? messages.commands.derp.title.likesDerp.replace('${username}', interaction.member.user.username)
					: ''
			}${
				genDerpiness <= 45
					? messages.commands.derp.title.hatesDerp.replace('${username}', interaction.member.user.username)
					: ''
			}`,
			description: messages.commands.derp.description
				.replace('${username}', interaction.member.user.username)
				.replace('${derpiness}', genDerpiness),
			color: messages.commands.derp.color,
		});

		// Send Derp Embed
		interaction.reply({ embeds: [reply] });
	},
};

const SimpleDiscord = require('simple-discord-modules');
const config = require('../config.json');
const build = require('../build.json');
const messages = require('../JSON/messages.json')[config.lang];

module.exports = {
	name: 'clearchat',
	slash: true,
	category: 'Utility',
	description: 'Clear chat messages!',
	expectedArgs: '<messages>',
	minArgs: 1,
	testOnly: build.type != 'release',
	options: [
		{
			type: 4,
			name: 'messages',
			description: 'The amount of messages to clear',
			required: true,
		},
	],
	callback: async ({ interaction, args }) => {
		const [mCount] = args;
		if (!interaction.member.roles.cache.has(config[build.type].roles.moderator)) {
			let errorEmbed = SimpleDiscord.embedMaker({ title: messages.error.missingPermissions, type: 'x' });
			interaction.reply({ embeds: [errorEmbed] });
			return;
		}

		if (!mCount) {
			let errorResponse = SimpleDiscord.embedMaker({
				title: messages.commands.clearChat.error.missingArgs,
				type: 'x',
			});
			interaction.reply({ embeds: [errorResponse] });
			return;
		}

		if (isNaN(mCount)) {
			let errorResponse = SimpleDiscord.embedMaker({
				title: messages.commands.clearChat.error.isNaN,
				type: 'x',
			});
			interaction.reply({ embeds: [errorResponse] });
			return;
		}

		let newVal = parseInt(mCount);

		if (newVal > 100) {
			let errorResponse = SimpleDiscord.embedMaker({
				title: messages.commands.clearChat.error.hundredPlus,
				type: 'x',
			});
			interaction.reply({ embeds: [errorResponse] });
			return;
		}

		if (newVal <= 0) {
			let errorResponse = SimpleDiscord.embedMaker({
				title: messages.commands.clearChat.error.belowZero,
				type: 'x',
			});
			interaction.reply({ embeds: [errorResponse] });
			return;
		}

		if (newVal > 100) {
			let errorResponse = SimpleDiscord.embedMaker({
				title: messages.commands.clearChat.error.hundredPlus,
				type: 'x',
			});
			interaction.reply({ embeds: [errorResponse] });
			return;
		}

		await interaction.channel.messages.fetch({ limit: newVal }).then((msgs) => {
			interaction.channel.bulkDelete(msgs);

			let response = SimpleDiscord.embedMaker({
				title: messages.commands.clearChat.response.replace('${messages}', mCount),
				type: 's',
			});
			interaction.reply({ embeds: [response], ephemeral: true });
		});
	},
};

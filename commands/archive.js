const SimpleDiscord = require('simple-discord-modules');
const fs = require('fs');

const config = require('../config.json');
const build = require('../build.json');
const messages = require('../JSON/messages.json')[config.lang];
const lockedChannels = require('../JSON/lockedChannels.json');

module.exports = {
	name: 'archive',
	category: 'Utility',
	slash: true,
	description: 'Archive a channel for later!',
	expectedArgs: '[Channel]',
	testOnly: build.type != 'release',
	options: [
		{
			type: 7,
			name: 'channel',
			description: 'The channel to archive',
		},
	],
	callback: ({ interaction, args, client }) => {
		const [aChannel] = args;
		if (!interaction.member.roles.cache.has(config[build.type].roles.moderator)) {
			let errorEmbed = SimpleDiscord.embedMaker({ title: messages.error.missingPermissions, type: 'x' });
			if (message) interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			return errorEmbed;
		}

		let lockChannel = !aChannel ? interaction.channel : interaction.guild.channels.cache.get(aChannel);

		let channelLocked = lockedChannels.archived.includes(lockChannel.id);

		if (!channelLocked) {
			lockChannel.setParent(config[build.type].categories.archive);

			interaction.reply({ content: messages.commands.archive.response, ephemeral: true });

			lockChannel
				.send({
					embeds: [SimpleDiscord.embedMaker({ title: messages.commands.archive.response, color: config.color })],
				})
				.then((msg) => {
					msg.pin();
					lockedChannels.archived.push(lockChannel.id);
					fs.writeFileSync('././JSON/lockedChannels.json', JSON.stringify(lockedChannels, null, '\t'));
				});

			let logChannel = client.channels.cache.get(config[build.type].channels.log);
			let logMessage = SimpleDiscord.embedMaker({
				author: '🔏  Channel Archived',
				authorImage: interaction.member.user.avatarURL(),
				description: `<#${lockChannel.id}> was archived by <@${interaction.member.user.id}>.`,
				color: config.color,
				footer: `User ID: ${interaction.member.user.id}`,
				timestamp: true,
			});
			logChannel.send({ embeds: [logMessage] });

			console.log(`\nChannel Archived: \nChannel: ${lockChannel.id}`);
		} else {
			interaction.reply({
				embeds: [
					SimpleDiscord.embedMaker({
						title: messages.error.uhOh,
						description: messages.error.channelAlreadyArchived,
						type: 'x',
					}),
				],
				ephemeral: true,
			});
		}
	},
};

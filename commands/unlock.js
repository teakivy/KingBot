const SimpleDiscord = require('simple-discord-modules');
const fs = require('fs');

const { Permissions } = require('discord.js');
const config = require('../config.json');
const build = require('../build.json');
const messages = require('../JSON/messages.json')[config.lang];
const lockedChannels = require('../JSON/lockedChannels.json');

module.exports = {
	name: 'unlock',
	category: 'Utility',
	slash: true,
	testOnly: build.type != 'release',
	description: 'Unlock a Channel',
	expectedArgs: '[Channel]',
	options: [
		{
			type: 7,
			name: 'channel',
			description: 'The channel to unlock',
		},
	],
	callback: async ({ args, interaction, client }) => {
		const [aChannel] = args;
		if (
			!interaction.member.roles.cache.has(config[build.type].roles.enigmite) &&
			!interaction.member.roles.cache.has(config[build.type].roles.moderator)
		) {
			let errorEmbed = SimpleDiscord.embedMaker({ title: messages.error.missingPermissions, type: 'x' });
			interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			return;
		}

		let lockChannel = !aChannel ? interaction.channel : interaction.guild.channels.cache.get(aChannel);

		let channelLocked = lockedChannels.locked.includes(lockChannel.id);

		if (channelLocked) {
			const role = interaction.guild.roles.cache.get(config[build.type].roles.enigmate);

			await lockChannel.permissionOverwrites.edit(role, { SEND_MESSAGES: true }).catch((err) => console.log(err));

			lockChannel
				.send({ embeds: [SimpleDiscord.embedMaker({ title: messages.commands.unlock.response, color: config.color })] })
				.then((msg) => {
					msg.pin();
					removeItemAll(lockedChannels.locked, lockChannel.id);
					fs.writeFileSync('././JSON/lockedChannels.json', JSON.stringify(lockedChannels, null, '\t'));
				});
			interaction.reply({ content: messages.commands.unlock.response, ephemeral: true });

			let logChannel = client.channels.cache.get(config[build.type].channels.log);
			let logMessage = SimpleDiscord.embedMaker({
				author: '🔓  Channel Unlocked',
				authorImage: interaction.member.user.avatarURL(),
				description: `<#${lockChannel.id}> was unlocked by <@${interaction.member.user.id}>.`,
				color: config.color,
				footer: `User ID: ${interaction.member.user.id}`,
				timestamp: true,
			});
			logChannel.send({ embeds: [logMessage] });
			console.log(`\nChannel Unlocked: \nChannel: ${lockChannel.id}`);
		} else {
			interaction.reply({
				embeds: [
					SimpleDiscord.embedMaker({
						title: messages.error.uhOh,
						description: messages.error.channelNotLocked,
						type: 'x',
					}),
				],
				ephemeral: true,
			});
		}
	},
};

function removeItemAll(arr, value) {
	var i = 0;
	while (i < arr.length) {
		if (arr[i] === value) {
			arr.splice(i, 1);
		} else {
			++i;
		}
	}
	return arr;
}

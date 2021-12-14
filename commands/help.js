const SimpleDiscord = require('simple-discord-modules');
const config = require('../config.json');
const build = require('../build.json');
const messages = require('../JSON/messages.json')[config.lang];
const commandsData = require('../JSON/commands.json');

module.exports = {
	name: 'help',
	slash: true,
	testOnly: build.type != 'release',
	category: 'Utility',
	description: 'Help!',
	callback: ({ client, interaction }) => {
		let isPlayer = interaction.member.roles.cache.has(config[build.type].roles.player);
		let isModerator = interaction.member.roles.cache.has(config[build.type].roles.moderator);
		let isOwner = config.extra.botOwner.includes(interaction.member.user.id);

		let commands = commandsData.everyone;

		let commandsList = `${messages.commands.help.response.commands}\n`;

		commands.forEach((command) => {
			commandsList =
				commandsList +
				messages.commands.help.commandFormat
					.replace('${prefix}', config.prefix)
					.replace('${command_usage}', command.usage)
					.replace('${command_description}', command.description);
		});

		if (isPlayer) {
			commandsList = commandsList + `\n\n${messages.commands.help.response.enigmiteCommands}\n`;
			commandsData.player.forEach((command) => {
				commandsList =
					commandsList +
					messages.commands.help.commandFormat
						.replace('${prefix}', config.prefix)
						.replace('${command_usage}', command.usage)
						.replace('${command_description}', command.description);
			});
		}

		if (isModerator) {
			commandsList = commandsList + `\n\n${messages.commands.help.response.moderatorCommands}\n`;
			commandsData.moderator.forEach((command) => {
				commandsList =
					commandsList +
					messages.commands.help.commandFormat
						.replace('${prefix}', config.prefix)
						.replace('${command_usage}', command.usage)
						.replace('${command_description}', command.description);
			});
		}

		if (isOwner) {
			commandsList = commandsList + `\n\n${messages.commands.help.response.ownerCommands}\n`;
			commandsData.owner.forEach((command) => {
				commandsList =
					commandsList +
					messages.commands.help.commandFormat
						.replace('${prefix}', config.prefix)
						.replace('${command_usage}', command.usage)
						.replace('${command_description}', command.description);
			});
		}

		interaction.reply({
			embeds: [
				SimpleDiscord.embedMaker({
					description: commandsList,
					title: messages.commands.help.response.title,
					color: config.color,
					thumbnail: client.user.avatarURL(),
				}),
			],
		});
	},
};

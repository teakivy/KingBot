const SimpleDiscord = require('simple-discord-modules');
const config = require('../config.json');
const build = require('../build.json');
const messages = require('../JSON/messages.json')[config.lang];

module.exports = {
	ownerOnly: true,
	name: 'shutdown',
	slash: true,
	testOnly: build.type != 'release',
	category: 'Utility',
	description: '[EMERGENCY] Shutdown King Bot',
	callback: async ({ client, interaction }) => {
		let reply = SimpleDiscord.embedMaker({
			title: messages.shutdown.response.title,
			description: messages.shutdown.response.description
				.replace('${config_version}', config.version)
				.replace('${build_name}', build.name)
				.replace('${build_date}', build.date),
			footer: messages.shutdown.response.footer.replace('${message_author_tag}', interaction.member.user.tag),
			footerImage: interaction.member.user.avatarURL(),
			color: config.color,
		});

		if (interaction.channel.id != config[build.type].channels.log)
			client.channels.cache.get(config[build.type].channels.log).send({ embeds: [reply] });
		await interaction.reply({ embeds: [reply], ephemeral: true });

		console.log(`\n\n${messages.shutdown.response.title}\n`);
		console.log(
			messages.shutdown.response.description
				.replace('${config_version}', config.version)
				.replace('${build_name}', build.name)
				.replace('${build_date}', build.date)
		);
		console.log(
			`\n${messages.shutdown.response.footer.replace('${message_author_tag}', interaction.member.user.tag)}\n`
		);
		process.exit(0);
	},
};

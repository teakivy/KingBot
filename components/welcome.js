const config = require('../config.json');
const build = require('../build.json');
const messages = require('../JSON/messages.json')[config.lang];

module.exports = (client, instance) => {
	client.on('guildMemberAdd', async (guildMember) => {
		let welcomeRole = guildMember.guild.roles.cache.find((role) => role.id === config[build.type].roles.member);

		guildMember.roles.add(welcomeRole);
		guildMember.guild.channels.cache
			.get(config[build.type].channels.welcome)
			.send(messages.responses.welcome.replace('${user_mention}', `<@${guildMember.user.id}>`));
	});
};

module.exports.config = {
	displayName: 'Welcome Handler',
	dbName: 'NONE',
};

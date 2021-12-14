const SimpleDiscord = require('simple-discord-modules');
const config = require('../config.json');
const build = require('../build.json');

module.exports = (client, instance) => {
	let logChannel = client.channels.cache.get(config[build.type].channels.log);
	client.on('interactionCreate', (interaction) => {
		if (!interaction.isSelectMenu()) return;
		let member = interaction.member;

		if (interaction.customId == 'pronoun_select') {
			let heRole = member.guild.roles.cache.get(config[build.type].roles.hePronouns);
			let sheRole = member.guild.roles.cache.get(config[build.type].roles.shePronouns);
			let theyRole = member.guild.roles.cache.get(config[build.type].roles.theyPronouns);
			let askRole = member.guild.roles.cache.get(config[build.type].roles.askPronouns);

			safeRemovePronounRoles(interaction.member);

			let pronoun = '';

			if (interaction.values.includes('he_pronoun_role')) {
				interaction.member.roles.add(heRole);
				pronoun = 'He/Him';
			}

			if (interaction.values.includes('she_pronoun_role')) {
				interaction.member.roles.add(sheRole);
				pronoun = 'She/Her';
			}

			if (interaction.values.includes('they_pronoun_role')) {
				interaction.member.roles.add(theyRole);
				pronoun = 'They/Them';
			}

			if (interaction.values.includes('ask_pronoun_role')) {
				interaction.member.roles.add(askRole);
				pronoun = 'Ask my Pronouns';
			}

			let logMessage = SimpleDiscord.embedMaker({
				author: '🚶  Pronouns',
				authorImage: interaction.member.user.avatarURL(),
				description: `<@${interaction.member.user.id}> changed their pronouns to\n\`${pronoun}\``,
				color: config.color,
				footer: `User ID: ${interaction.member.user.id}`,
				timestamp: true,
			});
			logChannel.send({ embeds: [logMessage] });

			interaction.reply({ content: 'Pronoun Roles Updated!', ephemeral: true });
		}

		if (interaction.customId == 'notification_select') {
			let ytRole = member.guild.roles.cache.get(config[build.type].roles.youtubeNotifications);
			let twitchRole = member.guild.roles.cache.get(config[build.type].roles.twitchNotifications);
			let twitterRole = member.guild.roles.cache.get(config[build.type].roles.twitterNotifications);
			let instagramRole = member.guild.roles.cache.get(config[build.type].roles.instagramNotifications);

			safeRemoveNotificationRoles(interaction.member);
			let roles = '';

			if (interaction.values.includes('youtube_notification_role')) {
				interaction.member.roles.add(ytRole);
				roles = roles + 'YouTube\n';
			}

			if (interaction.values.includes('twitch_notification_role')) {
				interaction.member.roles.add(twitchRole);
				roles = roles + 'Twitch\n';
			}

			if (interaction.values.includes('twitter_notification_role')) {
				interaction.member.roles.add(twitterRole);
				roles = roles + 'Twitter\n';
			}

			if (interaction.values.includes('instagram_notification_role')) {
				interaction.member.roles.add(instagramRole);
				roles = roles + 'Instagram\n';
			}

			roles = roles.substring(0, roles.length - 1);

			if (roles != '') {
				let logMessage = SimpleDiscord.embedMaker({
					author: '🔔 Notification Squad',
					authorImage: interaction.member.user.avatarURL(),
					description: `<@${interaction.member.user.id}> subscribed to \n\`${roles}\``,
					color: config.color,
					footer: `User ID: ${interaction.member.user.id}`,
					timestamp: true,
				});
				logChannel.send({ embeds: [logMessage] });
			} else {
				let logMessage = SimpleDiscord.embedMaker({
					author: '🔔 Notification Squad',
					authorImage: interaction.member.user.avatarURL(),
					description: `<@${interaction.member.user.id}> unsubscribed from all roles.`,
					color: config.color,
					footer: `User ID: ${interaction.member.user.id}`,
					timestamp: true,
				});
				logChannel.send({ embeds: [logMessage] });
			}

			interaction.reply({ content: 'Notification Roles Updated!', ephemeral: true });
		}
	});
};

module.exports.config = {
	displayName: 'Role Selector',
	dbName: 'NONE',
};

const safeRemovePronounRoles = (member) => {
	let heRole = member.guild.roles.cache.get(config[build.type].roles.hePronouns);
	let sheRole = member.guild.roles.cache.get(config[build.type].roles.shePronouns);
	let theyRole = member.guild.roles.cache.get(config[build.type].roles.theyPronouns);
	let askRole = member.guild.roles.cache.get(config[build.type].roles.askPronouns);

	if (member.roles.cache.has(heRole.id)) member.roles.remove(heRole);
	if (member.roles.cache.has(sheRole.id)) member.roles.remove(sheRole);
	if (member.roles.cache.has(theyRole.id)) member.roles.remove(theyRole);
	if (member.roles.cache.has(askRole.id)) member.roles.remove(askRole);
};

const safeRemoveNotificationRoles = (member) => {
	let ytRole = member.guild.roles.cache.get(config[build.type].roles.youtubeNotifications);
	let twitchRole = member.guild.roles.cache.get(config[build.type].roles.twitchNotifications);
	let twitterRole = member.guild.roles.cache.get(config[build.type].roles.twitterNotifications);
	let instagramRole = member.guild.roles.cache.get(config[build.type].roles.instagramNotifications);

	if (member.roles.cache.has(ytRole.id)) member.roles.remove(ytRole);
	if (member.roles.cache.has(twitchRole.id)) member.roles.remove(twitchRole);
	if (member.roles.cache.has(twitterRole.id)) member.roles.remove(twitterRole);
	if (member.roles.cache.has(instagramRole.id)) member.roles.remove(instagramRole);
};

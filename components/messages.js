const SimpleDiscord = require('simple-discord-modules');
const config = require('../config.json');
const fs = require('fs');
const build = require('../build.json');
const xp = require('../JSON/data/xp');
const messages = require('../JSON/messages.json')[config.lang];
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports = (client, instance) => {
	client.on('messageCreate', async (message) => {
		const author = message.author;

		if (xp[author.id]) {
			xp[author.id].xp = xp[author.id].xp + getMessageXP(author);
			xp[author.id].lastXP = Date.now();

			fs.writeFileSync('././JSON/data/xp.json', JSON.stringify(xp, null, '\t'));

			// console.log(xp[author.id].xp);
		} else {
			xp[author.id] = {
				xp: getRandomInt(16) + 15,
				level: 0,
				tier: 0,
				lastXP: Date.now(),
			};
			fs.writeFileSync('././JSON/data/xp.json', JSON.stringify(xp, null, '\t'));
		}

		// Delete Pin message after locking a channel
		if (message.type == 'CHANNEL_PINNED_MESSAGE' && message.author.id == client.user.id) {
			message.delete({ timeout: 100 });
		}

		// Ty Np
		if (message.content.toLowerCase() == 'ty') {
			if (Math.floor(Math.random() * 2) == 1) return;
			message.channel.send(messages.responses.ty);
		}

		if (message.content.includes('dQw4w9WgXcQ')) {
			message.react('😏');
		}

		if (message.content.includes(`<@!${client.user.id}>`)) {
			let genHelloResponse = Math.floor(Math.random() * messages.responses.hello.length);
			message.channel.send(
				messages.responses.hello[genHelloResponse].replace('${author_mention}', `<@${message.author.id}>`)
			);
		}

		if (message.content == '!!selectMenuSend' && message.author.tag == 'TeakIvy#0659') {
			const row = new MessageActionRow().addComponents(
				new MessageSelectMenu()
					.setCustomId('pronoun_select')
					.setPlaceholder('Select your Pronouns...')
					.setMinValues(0)
					.setMaxValues(1)
					.addOptions([
						{
							label: 'He/Him',
							value: 'he_pronoun_role',
							emoji: '🙋‍♂️',
						},
						{
							label: 'She/Her',
							value: 'she_pronoun_role',
							emoji: '🙋‍♀️',
						},
						{
							label: 'They/Them',
							value: 'they_pronoun_role',
							emoji: '🙋',
						},
						{
							label: 'Ask my Pronouns',
							value: 'ask_pronoun_role',
							emoji: '❓',
						},
					])
			);

			let reply = SimpleDiscord.embedMaker({
				title: '🚶 Pronoun Roles',
				description:
					'Select which pronouns you prefer to go by:\n\n🙋‍♂️ **He/Him**\n🙋‍♀️ **She/Her**\n🙋 **They/Them**\n❓ **Ask my Pronouns**',
				color: config.color,
			});

			message.channel.send({ embeds: [reply], components: [row] });
		}

		if (message.content.startsWith('!!botsay') && config.extra.botOwner.includes(message.author.id)) {
			// console.log();
			let content = message.content.replace('!!botsay ', '');
			content = content.replace('!!botsay', '');
			if (content != undefined && content != '' && content != ' ') {
				message.channel.send({ content: content });
			}
			message.attachments.each((att) => {
				console.log(att);
				if (att.size < 8 * 1000000) {
					message.channel.send({ files: [att] });
				}
			});
			message.delete();
		}

		if (message.content == '!!addAll' && message.author.tag == 'TeakIvy#0659') {
			message.channel.guild.members.cache.each((member) => {
				member.roles.add(message.channel.guild.roles.cache.find((role) => role.id === config[build.type].roles.member));
				message.channel.send(`Added **${member.user.tag}** to the member role.`);
			});
		}
		if (message.content == '!!selectMenuSend' && message.author.tag == 'TeakIvy#0659') {
			const row = new MessageActionRow().addComponents(
				new MessageSelectMenu()
					.setCustomId('notification_select')
					.setPlaceholder('Choose your Notifications...')
					.setMinValues(0)
					.setMaxValues(4)
					.addOptions([
						,
						{
							label: 'YouTube',
							value: 'youtube_notification_role',
							emoji: {
								name: 'youtube',
								id: '889303093609644104',
							},
						},
						{
							label: 'Twitch',
							value: 'twitch_notification_role',
							emoji: {
								name: 'twitch',
								id: '889303068066349087',
							},
						},
						{
							label: 'Twitter',
							value: 'twitter_notification_role',
							emoji: {
								name: 'twitter',
								id: '889303050207002666',
							},
						},
						{
							label: 'Instagram',
							value: 'instagram_notification_role',
							emoji: {
								name: 'instagram',
								id: '897265288976957460',
							},
						},
					])
			);

			let reply = SimpleDiscord.embedMaker({
				title: '🔔 Notification Roles',
				description:
					'Select which Notifications you would like to receive:\n\n<:youtube:917096489635954738> **YouTube**\n<:twitch:917096670846677053> **Twitch**\n<:twitter:917096489690464257> **Twitter**\n<:instagram:917096489640140870> **Instagram**',
				color: config.color,
			});

			message.channel.send({ embeds: [reply], components: [row] });
		}
	});
};

const getMessageXP = (author) => {
	if (xp[author.id].lastXP + 30 * 1000 > Date.now()) return 0;
	return getRandomInt(16) + 15;
};

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

module.exports.config = {
	displayName: 'Message Handler',
	dbName: 'NONE',
};

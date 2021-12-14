const SimpleDiscord = require('simple-discord-modules');
const config = require('../config.json');
const build = require('../build.json');
const messages = require('../JSON/messages.json')[config.lang];

module.exports = (client, instance) => {
	let logChannel = client.channels.cache.get(config[build.type].channels.log);
	client.on('messageUpdate', (oldMessage, newMessage) => {
		if (oldMessage.author.bot) return;
		if (oldMessage.content == '' || oldMessage.content == null || oldMessage.content == null) return;
		if (newMessage.content == '' || newMessage.content == null || newMessage.content == null) {
			newMessage.delete();
			return;
		}
		if (oldMessage.content == newMessage.content) return;
		let logMessage = SimpleDiscord.embedMaker({
			author: '📝  Message Edited',
			authorLink: oldMessage.url,
			authorImage: oldMessage.author.avatarURL(),
			description: `<@${oldMessage.author.id}> edited a message in <#${oldMessage.channel.id}>`,
			fields: [
				{
					name: 'Old Message:',
					value: oldMessage.content,
				},
				{
					name: 'New Message:',
					value: newMessage.content,
				},
			],
			color: config.color,
			footer: `User ID: ${oldMessage.author.id}`,
			timestamp: true,
		});
		logChannel.send({ embeds: [logMessage] });
		console.log(
			`\nMessage Edited: \nUser: ${oldMessage.author.tag}\nOld Content: ${oldMessage.content}\nNew Content: ${newMessage.content}`
		);
	});

	client.on('guildMemberUpdate', (oldMember, newMember) => {
		if (oldMember.nickname != newMember.nickname) {
			let logMessage = SimpleDiscord.embedMaker({
				author: '📝  Nickname Edited',
				authorImage: oldMember.user.avatarURL(),
				description: `<@${oldMember.user.id}> changed their nickname.`,
				fields: [
					{
						name: 'Old Nickname:',
						value: oldMember.nickname,
					},
					{
						name: 'New Nickname:',
						value: newMember.nickname,
					},
				],
				color: config.color,
				footer: `User ID: ${oldMember.user.id}`,
				timestamp: true,
			});
			logChannel.send({ embeds: [logMessage] });
			console.log(
				`\nNickname Changed: \nUser: ${oldMember.user.tag}\nOld Nickname: ${oldMember.nickname}\nNew Nickname: ${newMember.nickname}`
			);
			return;
		}

		// let oldRoles = '';
		// let newRoles = '';

		// oldMember.roles.cache.each((role) => {
		// 	oldRoles = `${oldRoles}\n<@&${role.id}>`;
		// });

		// newMember.roles.cache.each((role) => {
		// 	newRoles = `${newRoles}\n<@&${role.id}>`;
		// });

		// if (oldRoles != newRoles) {
		// 	let logMessage = SimpleDiscord.embedMaker({
		// 		author: '📝  Roles Updated',
		// 		authorImage: oldMember.user.avatarURL(),
		// 		description: `<@${oldMember.user.id}> changed their nickname.`,
		// 		fields: [
		// 			{
		// 				name: 'Old Roles:',
		// 				value: oldRoles,
		// 			},
		// 			{
		// 				name: 'New Roles:',
		// 				value: newRoles,
		// 			},
		// 		],
		// 		color: config.color,
		// 		footer: `User ID: ${oldMember.user.id}`,
		// 		timestamp: true,
		// 	});
		// 	logChannel.send({ embeds: [logMessage] });
		// 	return;
		// }
	});

	client.on('guildMemberAdd', async (member) => {
		let logMessage = SimpleDiscord.embedMaker({
			author: '📥  Member Joined',
			authorImage: member.user.avatarURL(),
			description: `<@${member.user.id}> joined the server!`,
			type: 's',
			footer: `User ID: ${member.user.id}`,
			timestamp: true,
		});
		logChannel.send({ embeds: [logMessage] });
		console.log(`\nMember Joined: ${member.user.tag}`);
	});

	client.on('guildMemberRemove', async (member) => {
		let logMessage = SimpleDiscord.embedMaker({
			author: '📤  Member Left',
			authorImage: member.user.avatarURL(),
			description: `<@${member.user.id}> left the server!`,
			type: 'x',
			footer: `User ID: ${member.user.id}`,
			timestamp: true,
		});
		logChannel.send({ embeds: [logMessage] });
		console.log(`\nMember Left: ${member.user.tag}`);
	});

	client.on('messageDelete', (message) => {
		if (message.content == '' || message.content == null || message.content == null) return;
		let logMessage = SimpleDiscord.embedMaker({
			author: '🗑️  Message Deleted',
			authorImage: message.author.avatarURL(),
			description: `<@${message.author.id}> deleted a message in <#${message.channel.id}>`,
			fields: [
				{
					name: 'Message:',
					value: message.content,
				},
			],
			color: config.color,
			footer: `User ID: ${message.author.id}`,
			timestamp: true,
		});
		logChannel.send({ embeds: [logMessage] });

		console.log(`\nMessage Deleted: \nFrom: ${message.author.tag}\nContent: ${message.content}`);
	});
};

module.exports.config = {
	displayName: 'Applications',
	dbName: 'NONE',
};

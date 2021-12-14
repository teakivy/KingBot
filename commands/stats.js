const SimpleDiscord = require('simple-discord-modules');
const config = require('../config.json');

const build = require('../build.json');
module.exports = {
	name: 'stats',
	slash: true,
	testOnly: build.type != 'release',
	category: 'Utility',
	description: 'Statistics',
	expectedArgs: '[user]',
	options: [
		{
			type: 6,
			name: 'user',
			description: 'What User to see the stats for',
		},
	],
	callback: ({ interaction, args }) => {
		let [user] = args;

		let member = interaction.channel.guild.members.cache.find((member) => member.user == user);

		if (user == null || user == undefined || user == '') member = interaction.member;

		let reply = SimpleDiscord.embedMaker({
			title: `📈 ${member.user.username}'s Statistics`,
			fields: [
				{
					name: 'Username',
					value: member.user.tag,
					inline: true,
				},
				{
					name: 'Nickname',
					value: member.nickname == null ? 'None' : member.nickname,
					inline: true,
				},
				{
					name: 'Joined Server',
					value: member.joinedAt.toLocaleDateString(),
				},
				{
					name: 'Account Created',
					value: member.user.createdAt.toLocaleDateString(),
					inline: true,
				},
			],
			thumbnail: member.user.avatarURL(),
			color: config.color,
		});

		interaction.reply({ embeds: [reply] });
	},
};

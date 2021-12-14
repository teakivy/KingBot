const SimpleDiscord = require('simple-discord-modules');
const config = require('../config.json');
const build = require('../build.json');
const messages = require('../JSON/messages.json')[config.lang];

const TwitchApi = require('node-twitch').default;
const twitch = new TwitchApi({
	client_id: process.env.TWITCH_CLIENT_ID,
	client_secret: process.env.TWITCH_SECRET,
});

module.exports = {
	name: 'promo',
	category: 'Utility',
	slash: true,
	testOnly: build.type != 'release',
	expectedArgs: '<channel>',
	description: 'Self Promo your Twitch!',
	minArgs: 1,
	options: [
		{
			type: 3,
			name: 'channel',
			description: 'What channel to promote',
			required: true,
		},
	],
	callback: async ({ args, interaction }) => {
		const [promoChannel] = args;
		let isLive = await channelIsLive(promoChannel);

		if (isLive == false) {
			let offlineResponse = SimpleDiscord.embedMaker({
				type: 'x',
				description: messages.commands.promo.response.offline.replace('${user}', promoChannel),
			});
			interaction.reply({ embeds: [offlineResponse], ephemeral: true });
			return;
		} else {
			let streamLink = `https://twitch.tv/${promoChannel}`;
			let profileData = await getUser(promoChannel);
			let streamData = await getStream(promoChannel);
			let thumbnail = `${await getStreamThumbnailUrl(promoChannel)}?r=${Math.floor(Math.random() * 7000000) + 1}`;

			let streamEmbed = SimpleDiscord.embedMaker({
				color: config.color,
				author: profileData.display_name,
				title: streamData.data[0].title,
				link: streamLink,
				authorLink: streamLink,
				image: thumbnail,
				thumbnail: profileData.profile_image_url,
				fields: [
					{
						name: messages.responses.twitch.fields.game,
						value: streamData.data[0].game_name,
						inline: true,
					},
					{
						name: messages.responses.twitch.fields.viewers,
						value: streamData.data[0].viewer_count,
						inline: true,
					},
				],
			});

			interaction.reply({
				content: messages.commands.promo.response.live
					.replace('${user_name}', profileData.display_name)
					.replace('${stream_link}', streamLink),
				embeds: [streamEmbed],
			});
		}
	},
};

async function channelIsLive(channel) {
	const streams = await twitch.getStreams({ channel: channel });
	if (streams.data[0]) {
		return true;
	} else {
		return false;
	}
}

async function getStream(channel) {
	const streams = await twitch.getStreams({ channel: channel });
	return streams;
}

async function getUser(channel) {
	const streams = await twitch.getUsers(channel);
	return streams.data[0];
}

async function getStreamThumbnailUrl(channel) {
	const result = await twitch.getStreams({ channel: channel });
	const stream = result.data[0];
	return stream.getThumbnailUrl();
}

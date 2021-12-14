const DiscordJS = require('discord.js');
const WOKCommands = require('wokcommands');

const { Intents, Client } = DiscordJS;
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const build = require('./build.json');
const messages = require('./JSON/messages.json');

const config = require('./config.json');

const client = new Client({ intents: [new Intents(32767)] });

client.on('ready', () => {
	client.guilds.cache.each((item) => {
		console.log(`${item.name}\n${item.id}\n`);
	});

	updateBuild();
	console.log(
		messages[config.lang].startup.response
			.replace('${username}', client.user.username)
			.replace('${build_name}', build.name)
			.replace('${build_date}', build.date)
	);

	client.user.setStatus('online');

	client.application.commands
		.create({
			name: 'Report',
			type: 3,
		})
		.catch(console.error);

	new WOKCommands(client, {
		// The name of the local folder for your command files
		commandsDir: path.join(__dirname, 'commands'),
		featuresDir: path.join(__dirname, 'components'),
		ignoreBots: true,
		testServers: ['852776227327574076', '916902111046950922'],
	})
		.setDefaultPrefix(config.prefix)
		.setBotOwner(config.extra.botOwner)
		.setColor(config.color)
		.setCategorySettings([
			{
				name: 'Utility',
				emoji: '🛠️',
			},
			{
				name: 'Fun & Games',
				emoji: '🏓',
			},
		]);
});

// Version Control
if (build.type != 'release' && build.type != 'dev') {
	console.log(
		chalk.red(messages[config.lang].error.unknownBuildType.replace('${build_type}', chalk.underline(build.type)))
	);
	process.exit(0);
}
let loginToken = build.type == 'release' ? process.env.RELEASE_TOKEN : process.env.DEV_TOKEN;
client.login(loginToken);

// Update build.json
const updateBuild = () => {
	build.build = build.build + 1;
	build.date = new Date().toISOString();
	build.name = `${build.type}.${build.build}`;
	fs.writeFileSync('./build.json', JSON.stringify(build, null, '\t'));
};

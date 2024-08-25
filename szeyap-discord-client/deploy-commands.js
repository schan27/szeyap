const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config();

const commands = [];

const folderOfCommands = path.join(__dirname, 'commands');

fs.readdirSync(folderOfCommands, { recursive: true }).forEach(file => {
  const fullFilePath = path.join(folderOfCommands, file);
  const command = require(fullFilePath);
  console.log(command)

  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    logger.error(`[WARNING] The command at ${fullFilePath} is missing a required "data" or "execute" property.`);
  }
});


// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.DEV_GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
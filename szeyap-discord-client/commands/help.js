const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Bring up the help menu.'),
  /**
   * @param {CommandInteraction} interaction
   */
	async execute(interaction) {
		await interaction.reply('Here is some help :)');
	}
};
const { SlashCommandBuilder, CommandInteraction, transformResolved } = require('discord.js');
const axios = require('axios').default;
const { API_ENDPOINT, RESULTS_PER_PAGE } = require('../config');
const logger = require('../logging/logger');

const { Pagination } = require('../utils/Pagination');
const { TranslationEmbed } = require('../utils/TranslationEmbed');

function combineDisplayChinese(prefRomanization, { traditional, simplified, penyim, jyutping }) {
  const zipped = traditional.map((_, i) => [traditional[i], simplified[i], penyim[i], jyutping[i]]);

  return zipped.map(([trad, simp, pen, jyut]) => {
    let display = simp;
    display += trad ? `[${trad}]` : ''; 
    display += pen ? ` (${pen})` : '';
    display += jyut ? ` ${jyut[prefRomanization]}` : '';
    return display;
  }).join(' or ');
}

function groupByN(arr, n) {
  return arr.reduce((r, e, i) =>
    (i % n ? r[r.length - 1].push(e) : r.push([e])) && r
  , []);
}

function calcNPages(arr) {
  return Math.ceil(arr.length / RESULTS_PER_PAGE);
}

function getNthGrp(arr, n) {
  return arr.slice(n * RESULTS_PER_PAGE, Math.min((n + 1) * RESULTS_PER_PAGE, arr.length));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate a message to a specified language.')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to translate.')
        .setRequired(true)),
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const message = interaction.options.getString('message');
    await interaction.deferReply();

    // ask api
    const response = await axios.get(`${API_ENDPOINT}/translation`, {
      params: {
        phrase: message,
        src_lang: 'UNK'
      }
    });

    if (response.status !== 200) {
      logger.error(`Error while fetching translation data: ${response.status}`);
      await interaction.editReply('There was an error while fetching the translation data.');
      return;
    }

    const { data } = response;

    let prefRomanization = 'GC';

    const pagination = new Pagination(interaction, data, calcNPages(data.translations), (data, i) => {
      const embTitle = `Translation for ${data.original_phrase}`;
      // const embDesc = `Translations for ${data.original_phrase}`;
      const embDesc = `from [${data.metadata.dictionary_name}](${data.metadata.dictionary_url}) dictionary`

      const selectedTrnslns = getNthGrp(data.translations, i);
      const embFields = selectedTrnslns.map((trnsln) => ({
          fieldTitle: combineDisplayChinese(prefRomanization, trnsln.chinese),
          description: trnsln.english
      }));

      return new TranslationEmbed({
        title: embTitle, 
        desc: embDesc, 
        footer: "Szechuan ur Bot", 
        fields: embFields
      });
    });

    await interaction.editReply({ embeds: [pagination.render()] });
  }
}
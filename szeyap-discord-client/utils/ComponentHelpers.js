const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { ROMANIZATION_SYSTEMS } = require('../config.js')

// =====================================================================
// All custom Ids have the format group.action for easy identification
// =====================================================================

function wasd() {
  const next = new ButtonBuilder()
    .setCustomId('wasd.next')
    .setLabel('前 \u25b6')
    .setStyle(ButtonStyle.Primary);
  const prev = new ButtonBuilder()
    .setCustomId('wasd.prev')
    .setLabel('\u25c0 後')
    .setStyle(ButtonStyle.Primary);
  const up = new ButtonBuilder()
    .setCustomId('wasd.up')
    .setLabel('\u25b2 上')
    .setStyle(ButtonStyle.Primary);
  const down = new ButtonBuilder()
    .setCustomId('wasd.down')
    .setLabel('下 \u25bc')
    .setStyle(ButtonStyle.Primary);

  return [prev, up, down, next];
}

function romanization(current) {
  const select_romanization = new StringSelectMenuBuilder()
    .setCustomId('romanization.select')
    .setPlaceholder('Select Romanization')
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel(ROMANIZATION_SYSTEMS['HSR'])
        .setValue('HSR'),
      new StringSelectMenuOptionBuilder()
        .setLabel(ROMANIZATION_SYSTEMS['SL'])
        .setValue('SL'),
      new StringSelectMenuOptionBuilder()
        .setLabel(ROMANIZATION_SYSTEMS['GC'])
        .setValue('GC'),
      new StringSelectMenuOptionBuilder()
        .setLabel(ROMANIZATION_SYSTEMS['DJ'])
        .setValue('DJ'),
      new StringSelectMenuOptionBuilder()
        .setLabel(ROMANIZATION_SYSTEMS['JW'])
        .setValue('JW'))
    .setMinValues(1)
    .setMaxValues(1)
    .setPlaceholder((ROMANIZATION_SYSTEMS[current] || 'Select') + ' Romanization');
  return select_romanization;
}

function toggleTxt(isEmbed) {
  const toggleEmbedText = new ButtonBuilder()
    .setCustomId(isEmbed ? 'toggle_txt.to_text' : 'toggle_txt.to_embed')
    .setLabel(isEmbed ? '\u21c6 to copyable text' : '\u21c6 to embed')
    .setStyle(ButtonStyle.Secondary);
  return toggleEmbedText;
}

function reportErr() {
  const reportError = new ButtonBuilder()
    .setCustomId('report_error.error')
    .setLabel('Report Error in translation')
    .setStyle(ButtonStyle.Danger);
  return reportError;
}

function reportMiss() {
  const reportMissing = new ButtonBuilder()
    .setCustomId('report_error.missing')
    .setLabel('Report Missing Translation')
    .setStyle(ButtonStyle.Danger);
  return reportMissing;
}

function reportModal(action) {
  const trnslnErrTxt = {
    title: 'Report Translation Error',
    placeholder: 'Enter a description of the error',
    isRequired: true
  }
  const trsnlnMissingTxt = {
    title: 'Report Missing Translation',
    placeholder: 'Enter any additional information about translation',
    isRequired: false
  }

  const modalTxt = action === 'missing' ? trsnlnMissingTxt : trnslnErrTxt;

  const description = new TextInputBuilder()
    .setCustomId('report_error.description')
    .setPlaceholder(modalTxt.placeholder)
    .setLabel('Description')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(modalTxt.isRequired)
    .setMaxLength(1_000)
    .setMinLength(10);
  const reportModal = new ModalBuilder()
    .setTitle(modalTxt.title)
    .setCustomId('report_error.modal')
    .addComponents(new ActionRowBuilder().addComponents(description))
  return reportModal;
}

module.exports = {
  wasd,
  romanization,
  reportErr,
  reportModal,
  toggleTxt,
  reportMiss
}
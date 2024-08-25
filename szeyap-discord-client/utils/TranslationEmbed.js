const { EmbedBuilder } = require('discord.js');
const indexjs = require('../index.js');

function wrapText(string, max, delim='\n') {
  const words = string.split(' ');
  let curr = '';
  let lines = [];
  for (let i = 0; i < words.length; i++) {
    if (curr.length + words[i].length + 1 <= max) {
      curr += words[i] + ' ';
    } else {
      lines.push(curr);
      curr = words[i] + ' ';
    }
  }
  lines.push(curr);
  return lines.join(delim);
}

class TranslationEmbed {

    /**
     * @param {String} title The title of the embed
     * @param {Array<Object>} fields An array of objects each with keys 'field_title' and 'field_value'
     */
    constructor({ title, desc, footer, fields }) {
      this.title = title;
      this.desc = desc;
      this.footer = footer
      this.fields = fields;
      this.selFld = 0;
      this.nFields = fields.length;
    }

    selectDown() {
      this.selFld = this.selFld + 1 % this.nFields;
      return this.render();
    }
    
    selectUp() {
      this.selFld = (this.selFld - 1 + this.nFields) % this.nFields;
      return this.render();
    }

    render() {
      // const field_desc = "__**不知好歹 būt jï hāo āi**__\n> not know good from bad; can't tell chalk from cheese; not know kindness from malice.⁶"
      return new EmbedBuilder()
        .setColor([205,215,175])
        .setTitle(this.title)
        .setDescription(this.desc + "\n\u200B")
        // .setAuthor({ name: this.title, iconURL: indexjs.client.user.avatarURL() })
        .addFields(this.fields.map(({ fieldTitle, description }, i) => {
          if (i == this.selFld) {
            return { name: `__**${fieldTitle}**__`, value: `>>> \`\`\`fix\n${description}\`\`\`` };
          } else {
            return { name: fieldTitle, value: `\`\`\`${description}\`\`\``};
          }
        }))
        .setTimestamp()
        .setFooter({ text: this.footer, iconURL: indexjs.client.user.avatarURL()});
    }

    renderAsText() {
      return `## ${this.title}
${this.desc}

${this.fields.map(({ fieldTitle, description }, i) => {
  if (i == this.selFld) {
    return `__**${fieldTitle}**__\n> ${description}`;
  } else {
    return `**${fieldTitle}**\n> ${description}`;
  }
}).join('\n\n')}
`
    }
}

module.exports = { TranslationEmbed };
const { EmbedBuilder } = require('discord.js');
const indexjs = require('../index.js');

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
      this.selFld = (this.selFld - 1 + this.nFields) % this.nFields;
      return this.render();
    }

    selectUp() {
      this.selFld = this.selFld + 1 % this.nFields;
      return this.render();
    }

    render() {
      return new EmbedBuilder()
        .setColor([205,215,175])
        .setTitle(this.title)
        .setDescription(this.desc + "\u200B")
        // .setAuthor({ name: indexjs.client.user.username, iconURL: indexjs.client.user.avatarURL() })
        .addFields(this.fields.map(({ fieldTitle, description }, i) => {
          const wrapA = `\`\`\`fix\n${i==this.selFld ? '=> ' : ''}`;
          const wrapB = `${i==this.selFld ? ' <=' : ''}\n\`\`\``;
          return { name: fieldTitle, value: `${wrapA}${description}${wrapB}` };
        }))
        .setTimestamp()
        .setFooter({ text: this.footer, iconURL: indexjs.client.user.avatarURL()});
    }
}

module.exports = { TranslationEmbed };
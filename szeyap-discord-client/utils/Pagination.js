const { CommandInteraction, User, MessageEmbed } = require('discord.js');
const { TranslationEmbed } = require('./TranslationEmbed');
// This is the class that will be used to handle pagination of messages the bot sends

class Pagination {

    /**
     * @param {CommandInteraction} interaction The interaction object this pagination is in response to
     * @param {Object} data The data that will be used to render the pages
     * @param {Array} pages The pages that will be paginated, each element should be able to be made into an discord Embed object
     * @param {Function} page_renderer The function that will be used to render the pages, should return an object that represent a page and it must have a render() method
     */
    constructor(interaction, data, nPages, page_renderer) {
        this.interaction = interaction;
        this.data = data;
        this.page_renderer = page_renderer;
        this.currentPage = 0;
        this.nPages = nPages;
    }

    _constructPage(n) {
      return this.page_renderer(this.data, n);
    }

    _constructCurrentPage() {
      return this._constructPage(this.currentPage);
    }

    next() {
      this.currentPage = (this.currentPage + 1) % this.nPages;
      return this.render();
    }

    prev() {
      this.currentPage = (this.currentPage - 1 + this.nPages) % this.nPages;
      return this.render();
    }

    render(n=null) {
      return n === null ? this._constructCurrentPage().render() : this._constructPage(n).render();
    }

}

module.exports = { Pagination };
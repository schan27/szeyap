const { CommandInteraction, User, MessageEmbed } = require('discord.js');
const logger = require('../logging/logger');
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
        this.currentPageIdx = 0;
        this.currentPage = null;
        this.nPages = nPages;
    }

    _constructPage(n) {
      this.currentPage = this.page_renderer(this.data, n);
      return this.currentPage;
    }

    _constructCurrentPage() {
      return this._constructPage(this.currentPageIdx);
    }

    next() {
      this.currentPageIdx = (this.currentPageIdx + 1) % this.nPages;
      return this.render();
    }

    prev() {
      this.currentPageIdx = (this.currentPageIdx - 1 + this.nPages) % this.nPages;
      return this.render();
    }

    update(action) {
      if (action === 'next') {
        return this.next();
      } else if (action === 'prev') {
        return this.prev();
      } else if (action === 'up') {
        return this.currentPage.selectUp();
      } else if (action === 'down') {
        return this.currentPage.selectDown();
      } else {
        logger.error(`Invalid action ${action} in Pagination.update()`);
        return this.keep();
      }
    }

    render(n=null) {
      return n === null ? this._constructCurrentPage().render() : this._constructPage(n).render();
    }

    keep() {
      return this.currentPage.render();
    }

    keepAsText() {
      return this.currentPage.renderAsText();
    }

}

module.exports = { Pagination };
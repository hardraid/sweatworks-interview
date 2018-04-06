/**
 * Article Model
 */

const Resource = require('../db/resource.model'),
    Author = require('../author/author.model');

const table = 'article';

class Article extends Resource {

    constructor(title, body, authorId) {
        super(table, 'id');
        this.title = title;
        this.body = body;
        this.authorId = authorId;
    }

    /**
     * Save Article
     * 
     * @async
     * @return {Promise<any>}
     */
    async save() {
        return await super.save({ title: this.title, body: this.body, author_id: this.authorId });
    }

    /**
     * Load data by ID
     * 
     * @async
     * @param {int} id ID
     * @return {Promise<any>}
     */
    async load(id) {
        let data = await super.load(id);
        this.title = data.title;
        this.body = data.body;
        this.createdAt = data.created_at;
        this.authorId = data.author_id;

        return data;
    }

    /**
     * Delete data from DB
     * 
     * @async
     * @return {Promise<any>}
     */
    async delete() {
        return await super.delete();
    }

    /**
     * Retrieve a list of articles
     * 
     * @static
     * @async
     * @param   {int} page Page number
     * @param   {int} size Size number
     * @param   {string} search Search term
     * @param   {int} authorId Author ID
     * @returns {Promise<any>}
     */
    static async getList(page, size, search, authorId) {

        let data = await Resource.list(table, page, size, 'created_at', authorId, search);

        if (authorId) {
            const author = await (new Author()).load(authorId);
            data.list.map(a => {
                a.author = author;
            });
        } else {
            for (let i = 0,a,author; i < data.list.length; i++) {
                a = data.list[i];
                author = await (new Author()).load(a.author_id);
                a.author = author;
            }
        }

        return data;
    }
}

module.exports = Article;
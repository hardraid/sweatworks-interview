let Resource = require('../db/resource.model'),
    moment = require('moment');

const table = 'author';

class Author extends Resource {

    constructor(name, email, birthdate) {
        super(table, 'id');
        this.name = name;
        // Check if email is valid
        if (email && !/\S+@\S+\.\S+/.test(email))
            throw new Error('Invalid email address.');
        this.email = email;
        // Check ISO date format
        if (birthdate && !moment(birthdate).isValid())
            throw new Error('Invalid birth date.');
        this.birthdate = birthdate;
    }

    /**
     * Save Author
     * 
     * @async
     * @return {Promise<any>}
     */
    async save() {
        if (!this.birthdate)
            throw new Error('Please enter birth date');
        
        return await super.save({ name: this.name, email: this.email, birth_date: this.birthdate });
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
        this.name = data.name;
        this.email = data.email;
        this.birthdate = data.birth_date;

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
     * Retrieve a list of authors
     * 
     * @static
     * @async
     * @returns {Promise<array>}
     */
    static async getList() {
        return await Resource.list(table);
    }
}

module.exports = Author;
/**
 * Resource Model for DB abstraction
 */

let sqlite = require('sqlite3').verbose();

class Resource {

    constructor(tableName, keyColumn) {
        this.db = new sqlite.Database('./db/sample.db');
        this.table = tableName;
        this.key = keyColumn;
        this.isNew = true;
        this.id = null;
    }

    /**
     * Close DB connection
     */
    close() {
        this.db.close();
    }

    /**
     * Load and retrieve a row by ID
     * 
     * @param {int} id ID
     * @return {Promise<any>} row data if it was successful, otherwise an error
     */
    load(id) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM ${this.table} WHERE ${this.key} = ?`, [id], (err, row) => {

                if (err || !row)
                    return reject(err);

                this.id = row.id;
                this.isNew = false;
                resolve(row);
            })
        });
    }

    /**
     * Save data given into model's table
     * 
     * @param {Object} data Map column:value
     * @return {Promise<any>} Row data if it was successful, otherwise an error
     */
    save(data) {
        return new Promise((resolve, reject) => {

            let keys = Object.keys(data)

            if (this.isNew) {

                let values = Object.values(data).map(v => `'${v}'`),
                    self = this;

                this.db.run(`INSERT INTO ${this.table}(${keys}) VALUES(${values.join()})`, [], function (err) {
                    if (err)
                        return reject(err);
                    self.isNew = false;
                    self.id = this.lastID;
                    resolve({ result: true });
                });
            } else if (this.id) {
                let set = keys.map(column => `${column} = '${data[column]}'`).join();
                this.db.run(`UPDATE ${this.table} SET ${set} WHERE ${this.key} = ?`, [this.id], function (err) {
                    if (err)
                        return reject(err);
                    resolve({ result: true });
                });
            } else {
                reject(`There is no data to save in this model (${this.table}).`);
            }
        });
    }

    /**
     * Retrieve table listing
     * 
     * @static
     * @param {string} table Table name
     * @param {int} page Page
     * @param {int} size Size/Limit
     * @param {string} orderBy Order by column given
     * @param {int} authorId Author ID
     * @param {string} search Search Term
     * @return {Promise<any>} rows if it was successful, otherwise an error
     */
    static list(table, page, size, orderBy, authorId, search) {
        return new Promise((resolve, reject) => {

            this.db = new sqlite.Database('./db/sample.db');
            let where = '',
                limit = '',
                order = '';

            if (authorId && !isNaN(authorId))
                where = ` WHERE author_id = ${authorId}`;
            else if(search)
                where = ` WHERE title LIKE '%${search}%'`;

            if (orderBy)
                order = ` ORDER BY ${orderBy}`;

            if ((page && !isNaN(page)) && (size && !isNaN(size)))
                limit = ` LIMIT ${size} OFFSET ${((page - 1) * size)}`;

            this.db.all(`SELECT * FROM ${table}${where}${order}${limit}`, [], (err, rows) => {
                if (err)
                    return reject(err);
                this.db.get(`SELECT COUNT(*) AS qty FROM ${table}${where}`, [], (err, row) => {
                    if (err)
                        return reject(err);
                    resolve({ list: rows, total: row.qty });
                });
            }).close();
        });
    }

    /**
     * Delete loaded row from DB
     * 
     * @return {Promise<any>} true if it was successful, otherwise an error
     */
    delete() {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM ${this.table} WHERE ${this.key} = ?`, [this.id], err => {
                if (err)
                    return reject(err);
                resolve({ result: true });
            })
        });
    }
}

module.exports = Resource;
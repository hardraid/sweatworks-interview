/**
 * Author CRUD
 */

let express = require('express'),
    router = express.Router(),
    Author = require('./author.model'),
    Article = require('../article/article.model');

// Retrieve all
router.get('/', (req, res, next) => {
    Author.getList().then(list => res.json(list)).catch(next);
});

// Retrieve Articles by author ID
router.get('/:id([0-9]+)/articles', (req, res, next) => {
    let author = new Author();
    author.load(req.params.id).then(a => {
        const page = !isNaN(req.query.page) ? req.query.page : null;
        const size = !isNaN(req.query.size) ? req.query.size : null;
        Article.getList(page, size, null, author.id).then(articles => res.json(articles)).catch(next);
    }).catch(next);
});

// Create new author
router.post('/', (req, res, next) => {

    let data = req.body;

    if (Object.keys(data).length) {
        try {
            let author = new Author(data.name, data.email, data.birthdate);
            author.save().then(a => res.json(a)).catch(next);
        } catch (err) {
            next(err);
        }
    } else {
        next('No data to save');
    }
});

// Retrieve an author by ID
router.get('/:id([0-9]+)', (req, res, next) => {
    let author = new Author();
    author.load(req.params.id).then(a => res.json(a)).catch(next);
});

// Update author by ID
router.put('/:id([0-9]+)', (req, res, next) => {

    let data = req.body,
        author = new Author(),
        oldData = author.load(req.params.id);

    oldData.then(a => {
        if (Object.keys(data).length) {

            if (data.name)
                author.name = data.name;
            if (data.email)
                author.email = data.email;
            if (data.birthdate)
                author.birthdate = data.birthdate;

            author.save().then(a => res.json(a)).catch(next);
        } else {
            res.json(a);
        }
    }).catch(next);
});

// Delete author by ID
router.delete('/:id([0-9]+)', (req, res, next) => {
    let author = new Author();
    author.load(req.params.id).then(a => {
        author.delete().then(r => res.json(r));
    }).catch(next);
});

module.exports = router;
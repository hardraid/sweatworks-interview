/**
 * Articles CRUD
 */

let express = require('express'),
    router = express.Router(),
    Article = require('./article.model'),
    Author = require('../author/author.model');

// Retrieve all articles or per page
router.get('/', (req, res, next) => {
    const page = !isNaN(req.query.page) ? req.query.page : null;
    const size = !isNaN(req.query.size) ? req.query.size : null;
    const search = req.query.search ? req.query.search : null;
    Article.getList(page, size, search).then(list => res.json(list)).catch(next);
});

// Create new article
router.post('/', (req, res, next) => {

    let data = req.body;

    if (Object.keys(data).length) {
        try {
            let article = new Article(data.title, data.body, data.author_id);
            article.save().then(a => res.json(a)).catch(next);
        } catch (err) {
            next(err);
        }
    } else {
        next('No data to save');
    }
});

// Retrieve an article by ID
router.get('/:id([0-9]+)', (req, res, next) => {
    let article = new Article();
    article.load(req.params.id).then(a => {
        (new Author()).load(a.author_id).then(data => {
            a.author = data;
            res.json(a);
        });
    }).catch(next);
});

// Update article by ID
router.put('/:id([0-9]+)', (req, res, next) => {

    let data = req.body,
        article = new Article(),
        oldData = article.load(req.params.id);

    oldData.then(a => {
        if (Object.keys(data).length) {
            
            if (data.title)
                article.title = data.title;
            if (data.body)
                article.body = data.body;
            if (data.author_id)
                article.authorId = data.author_id;

            try {
                article.save().then(a => res.json(a)).catch(next);
            } catch (err) {
                next(err);
            }
        } else {
            res.json(a);
        }
    }).catch(next);
});

// Delete article by ID
router.delete('/:id([0-9]+)', (req, res, next) => {
    let article = new Article();
    article.load(req.params.id).then(a => {
        article.delete().then(r => res.json(r));
    }).catch(next);
});

module.exports = router;
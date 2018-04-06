const assert = require('assert'),
      request = require('supertest'),
      server = require('./server'),
      req = request(server);


let exampleId, firstAuthorId;

describe('Author endpoints', () => {

    describe('POST /author', () => {
        it('Create an author and response true', (done) => {
            req
            .post('/author')
            .send({'name': 'Foo', 'email': 'foo@mail.com', 'birthdate': '1989-12-21'})
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .expect(200)
            .expect(res => {
                assert.ok(res.body.result, 'The operation failed');
            })
            .end(done);
        });
    });

    describe('GET /author', () => {
        it('Retrieves an array with all authors', (done) => {
            req
            .get('/author')
            .expect(200)
            .expect(res => {
                assert.ok(Array.isArray(res.body.list), 'It\'s not an array');
                if (res.body.list.length) {
                    firstAuthorId = res.body.list[0].id;
                    exampleId = res.body.list.pop().id;
                }
            })
            .end(done);
        });
    });

    describe('GET /author/authorId', () => {
        it('Retrieves an author object', (done) => {
            req
            .get('/author/' + exampleId)
            .expect(200)
            .expect(res => {
                assert.ok(res.body.id === exampleId, 'operation failed');
                assert.ok(typeof res.body === 'object', 'The response is not an Object');
            })
            .end(done);
        });
    });

    describe('PUT /author/authorId', () => {
        it('Updates author and response true', (done) => {
            req
            .put('/author/' + exampleId)
            .send({'name': 'Foo Updated', 'email': 'foo@mail.com', 'birthdate': '1989-12-21'})
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .expect(200)
            .expect(res => {
                assert.ok(typeof res.body === 'object', 'The response is not an Object');
                assert.ok(res.body.result, 'The operation failed');
            })
            .end(done);
        });
    });

    describe('DELETE /author/authorId', () => {
        it('Delete author and response true', (done) => {
            req
            .delete('/author/' + exampleId)
            .expect(200)
            .expect(res => {
                assert.ok(res.body.result, 'The operation failed');
            })
            .end(done);
        });
    });
});

describe('Article endpoints', () => {

    describe('POST /article', () => {
        it('Creates article and responses true', (done) => {
            req
            .post('/article')
            .send({'title': 'Bar', 'body': 'Lorem ipsum', 'author_id': firstAuthorId})
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .expect(200)
            .expect(res => {
                assert.ok(res.body.result, 'The operation failed');
            })
            .end(done);
        });
    });

    describe('GET /article', () => {

        it('Retrieves an array with all articles', (done) => {
            req
            .get('/article')
            .expect(200)
            .expect(res => {
                assert.ok(Array.isArray(res.body.list), 'It\'s not an array');
                if (res.body.list.length)
                    exampleId = res.body.list.pop().id;
            })
            .end(done);
        });

        it('Retrieves an array with articles per page', (done) => {
            req
            .get('/article?page=1&size=10')
            .expect(200)
            .expect(res => {
                assert.ok(Array.isArray(res.body.list), 'It\'s not an array');
                assert.ok(res.body.list.length, 'Array empty, it must contain one article at least');
                assert.ok(res.body.list.length <= 10, 'Pagination failed');
            })
            .end(done);
        });
    });

    describe('GET /article/articleId', () => {
        it('Retrieves an article object', (done) => {
            req
            .get('/article/' + exampleId)
            .expect(200)
            .expect(res => {
                assert.ok(res.body.id === exampleId, 'operation failed');
                assert.ok(typeof res.body === 'object', 'The response is not an Object');
                assert.ok(res.body.author, 'No author related to the article');
            })
            .end(done);
        });
    });

    describe('PUT /article/articleId', () => {
        it('Updates article and response true', (done) => {
            req
            .put('/article/' + exampleId)
            .send({'title': 'Bar Updated'})
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .expect(200)
            .expect(res => {
                assert.ok(typeof res.body === 'object', 'The response is not an Object');
                assert.ok(res.body.result, 'The operation failed');
            })
            .end(done);
        });
    });

    describe('GET /author/authorId/articles', () => {

        it('Retrieves all articles related to the author', (done) => {
            req
            .get('/author/' + firstAuthorId + '/articles')
            .expect(200)
            .expect(res => {
                assert.ok(Array.isArray(res.body.list), 'It\'s not an array');
                assert.ok(res.body.list.length >= 1, 'No article related to the author');
            })
            .end(done);
        });

        it('Retrieves articles related to the author per page', (done) => {
            req
            .get('/author/' + firstAuthorId + '/articles?page=1&size=10')
            .expect(200)
            .expect(res => {
                assert.ok(Array.isArray(res.body.list), 'It\'s not an array');
                assert.ok(res.body.list.length >= 1, 'No article related to the author');
                assert.ok(res.body.list.length <= 10, 'Pagination failed');
            })
            .end(done);
        });
    });

    describe('DELETE /article/articleId', () => {
        it('Delete article and response true', (done) => {
            req
            .delete('/article/' + exampleId)
            .expect(200)
            .expect(res => {
                assert.ok(res.body.result, 'The operation failed');
            })
            .end(done);
        });
    });
});
const LIMIT = 10;

angular
    .module('Sweatworks', ['ngRoute'])
    .factory('Articles', ['$http', function ($http) {
        return {
            header: 'All',
            list: [],
            pages: 0,
            currentPage: 1,
            pageSize: 5,
            author: null,
            term: null,
            load: function (author) {

                this.term = null;

                if (author !== undefined && author !== null && !isNaN(author.id)) {

                    this.header = author.name;

                    if (!this.author || this.author.id !== author.id) {
                        this.author = author;
                        this.currentPage = 1;
                    }

                    $http.get(`/author/${author.id}/articles?page=${this.currentPage}&size=${this.pageSize}`).then(res => {
                        this.list = res.data.list;
                        this.prepare();
                        this.pages = Math.ceil(res.data.total / this.pageSize);
                    });

                } else {

                    this.header = 'All';

                    if (this.author) {
                        this.author = null;
                        this.currentPage = 1;
                    }

                    $http.get(`/article?page=${this.currentPage}&size=${this.pageSize}`).then(res => {
                        this.list = res.data.list;
                        this.pages = Math.ceil(res.data.total / this.pageSize);
                        this.prepare();
                    });
                }
            },
            prepare: function () {
                this.list.map(a => {
                    a.created_at = new Date(a.created_at);
                });
            },
            getPages: function () {
                return (new Array(this.pages)).fill().map((el, i) => i + 1);
            },
            loadPage: function (page) {
                if (this.currentPage !== page) {
                    this.currentPage = page;

                    if (this.term !== null)
                        this.search(this.term);
                    else
                        this.load(this.author);
                }
            },
            search: function (term) {
                if (term && term !== undefined) {

                    if (this.term === null || this.term !== term) {
                        this.term = term;
                        this.currentPage = 1;
                    }

                    $http.get(`/article?page=${this.currentPage}&size=${this.pageSize}&search=${this.term}`).then(res => {
                        this.header = `Search "${this.term}"`;
                        this.author = null;
                        this.list = res.data.list;
                        this.pages = Math.ceil(res.data.total / this.pageSize);
                        this.prepare();
                    });
                }
            }
        };
    }])
    .controller('AuthorController', ['$scope', '$http', '$rootScope', 'Articles', function ($scope, $http, $rootScope, Articles) {

        $rootScope.articles = Articles;
        $scope.authors = [];

        $http.get('/author').then(res => {
            $scope.authors = res.data.list;
        });

        $scope.showArticles = function (author) {
            Articles.load(author);
        };
    }])
    .controller('ArticleController', ['$scope', '$http', '$rootScope', 'Articles', function ($scope, $http, $rootScope, Articles) {

        $scope.articles = Articles;

        Articles.load();
    }]);
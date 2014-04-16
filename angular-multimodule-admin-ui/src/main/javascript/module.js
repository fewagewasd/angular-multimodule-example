angular.module('multimodule.example.admin.movies',['multimodule.example.base'])
    .config(function($routeProvider,$apiProvider) {
        $routeProvider.when('/admin/movies', {
            templateUrl: 'movies/movie-list.tpl.html',
            controller: 'MovieListController'
        }).when('/admin/movies/:id', {
            templateUrl: 'controllers/base-detail-controller.tpl.html',
            controller: 'MovieDetailController'
        });
        $apiProvider.endpoint('movie',{
            url: 'movies',
            model: window.Movie
        })
    });

angular.module('multimodule.example.admin',['multimodule.example.base','multimodule.example.admin.movies']);
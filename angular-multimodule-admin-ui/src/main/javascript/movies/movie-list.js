angular.module('multimodule.example.admin.movies')
    .controller('MovieListController', function ($scope, $api) {
        $scope.movies = [];
        $scope.movieApi = $api.movie;
    });
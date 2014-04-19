'use strict';
angular.module('multimodule.example.admin.movies')
    .controller('MovieDetailController', function ($injector, $scope, $api) {
        // params for BaseDetailController:
        // $scope, $routeParams, $breadcrumbs, $location, endpoint, editTemplateUrl, viewTemplateUrl, baseUrl
        // -> we don't need to manually specify the ones that angular knows
        $injector.invoke(window.BaseDetailController, this, {
            $scope: $scope,
            endpoint: $api.movie,
            editTemplateUrl: 'movies/movie-detail-edit.tpl.html',
            viewTemplateUrl: 'movies/movie-detail-view.tpl.html',
            baseUrl: '/admin/movies'
        });
    });
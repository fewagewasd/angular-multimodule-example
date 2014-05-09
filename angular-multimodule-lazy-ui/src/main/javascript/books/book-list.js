'use strict';
window.providers.$controllerProvider
    .register('BookListController', function ($scope, $api, templateUrl) {
        $scope.books = [];
        $scope.bookApi = $api.book;

        $scope.templateUrl = templateUrl;
    });



window.templates = window.templates || [];
'use strict';
window.providers.$controllerProvider
    .register('BookDetailController', function ($injector, $scope, $api, $templateCache, templateUrl) {
        $scope.templateUrl = templateUrl;
        // params for BaseDetailController:
        // $scope, $routeParams, $breadcrumbs, $location, endpoint, editTemplateUrl, viewTemplateUrl, baseUrl
        // -> we don't need to manually specify the ones that angular knows
        $injector.invoke(window.BaseDetailController, this, {
            $scope: $scope,
            endpoint: $api.book,
            editTemplateUrl: 'books/book-detail-edit.tpl.html',
            viewTemplateUrl: 'books/book-detail-view.tpl.html',
            baseUrl: '/admin/books'
        });

        $templateCache.put();
    });
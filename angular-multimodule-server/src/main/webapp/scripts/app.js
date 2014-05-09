'use strict';

window.providers = {};
window.services = {};
window.configure = [];

function lazyRoute(config, dependencies) {
    return {
        template: '<div ng-include="templateUrl"></div>',
        controller: config.controller,
        resolve: {
            deps : function ($q, $rootScope) {
                var deferred = $q.defer();
                $script(dependencies, function () {
                    $rootScope.$apply(function () {
                        if (!!window.configure) {
                            var configure = window.configure;
                            window.configure = [];
                            _.forEach(configure, function (config) {
                                config();
                            });
                        }
                        deferred.resolve();
                    });
                });

                return deferred.promise;
            },
            templateUrl: function() {
                return config.templateUrl;
            }
        }
    };
}

angular.module('multimoduleApp', [
    'http-auth-interceptor',
    'ngSanitize',
    'ngRoute',
    'restangular',
    'ui.bootstrap',
    'multimodule.example.base',
    'multimodule.example.admin'
])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainController'
            });

        // routes for lazy loaded module
        $routeProvider
            .when('/lazy/books',lazyRoute({
                templateUrl: 'books/book-list.tpl.html',
                controller: 'BookListController'
            }, 'scripts/modules/angular-multimodule-lazy-ui.js'))
            .when('/admin/books/:id', lazyRoute({
                templateUrl: 'controllers/base-detail-controller.tpl.html',
                controller: 'BookDetailController'
            }, 'scripts/modules/angular-multimodule-lazy-ui.js'));
    })

    .config(function ($compileProvider, $controllerProvider, $apiProvider) {
        window.providers.$compileProvider = $compileProvider;
        window.providers.$controllerProvider = $controllerProvider;
        window.providers.$apiProvider = $apiProvider;
    })
    .run(function ($templateCache) {
        window.services.$templateCache = $templateCache;
    })
    .controller('MainController', function ($scope) {});

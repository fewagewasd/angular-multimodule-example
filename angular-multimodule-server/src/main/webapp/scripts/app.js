'use strict';

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
    })
    .controller('MainController', function ($scope) {});

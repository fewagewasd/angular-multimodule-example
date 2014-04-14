'use strict';

angular.module('eocsApp', [
    'http-auth-interceptor',
    'ngSanitize',
    'ngRoute',
    'restangular',
    'ui.bootstrap',
    'app.base',
    'app.admin'
//  'app.map'
])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainController'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginController'
            })
            .when('/logout', {
                templateUrl: 'views/login.html',
                controller: 'LogoutController'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .config(function (RestangularProvider) {
        RestangularProvider.setBaseUrl('/api');
    })
    .run(['$rootScope', '$location', 'AuthenticationService', 'Restangular', '$log',
        function ($rootScope, $location, AuthenticationService, Restangular, $log) {

            var _setAccount = function (account) {
                if (account !== null) {
                    $rootScope.account = account;
                    Restangular.all('account').all('profiles').getList().then(function (data) {
                        if ($rootScope.account !== null) {
                            $rootScope.profiles = data;
                            $rootScope.currentProfile = _.find($rootScope.profiles, function (x) {
                                return x.id === $rootScope.account.currentProfileId;
                            });
                            Restangular.all('account').all('allowedactions').getList().then(function (data) {
                                $rootScope.allowedActions = data;
                            });
                        }
                    });
                } else {
                    $rootScope.account = null;
                    $rootScope.profiles = null;
                    $rootScope.currentProfile = null;
                    $rootScope.allowedActions = null;
                }
            };

            $rootScope.messages = {
                success: '',
                info: '',
                warning: '',
                error: ''
            };

            $rootScope.isAllowed = function (action) {
                if (!!$rootScope.allowedActions) {
                    for (var i = 0; i < $rootScope.allowedActions.length; i++) {
                        if ($rootScope.allowedActions[i] === action) {
                            return true;
                        }
                    }
                }
                return false;
            };

            $rootScope.$on('$routeChangeStart', function (event, next, current) {
                // Check if the status of the user. Is it authenticated or not?
                AuthenticationService.authenticate().then(function (response) {
                    if (response.data === '') {
                        $rootScope.$broadcast('event:auth-loginRequired');
                    } else {
                        $rootScope.authenticated = true;
                        _setAccount(response.data);

                        // If the login page has been requested and the user is already logged in
                        // the user is redirected to the home page
                        if ($location.path() === '/login') {
                            $location.path('/').replace();
                        }
                    }
                });
            });

            $rootScope.switchProfile = function () {
                if ($rootScope.authenticated && this.profile !== null) {
                    Restangular.all('account').customPOST({}, 'profiles', {'profileId': this.profile.id}).then(function (data) {
                        _setAccount(data);
                        $location.path('/');
                    });
                }
            };

            // Call when the 401 response is returned by the client
            $rootScope.$on('event:auth-loginRequired', function (rejection) {
                $rootScope.authenticated = false;
                if ($location.path() !== '/login' && $location.path() !== '') {
                    $location.path('/login').replace();
                }
            });

            // Call when the user logs out
            $rootScope.$on('event:auth-loginCancelled', function () {
                _setAccount(null);
                $rootScope.authenticated = false;
                $location.path('/login');
            });

            var fireKeyPressEvent = function (combination) {
                $rootScope.$broadcast('KeyboardShortcut', combination);
            };

            var changeRoute = function (newRoute) {
                $rootScope.$apply(function() {
                    $location.path(newRoute);
                });
            };

            // override key filters so we always can access hotkeys, regardless if we are
            // focusing an input field or not
            key.filter = function(event){
                return true;
            };

            // route changing key combinations
            key('ctrl+alt+c', function () {changeRoute('/admin/commandcenters');});
            key('ctrl+alt+u', function () {changeRoute('/admin/users');});
            key('ctrl+alt+o', function () {changeRoute('/admin/organizationunits');});

            // event triggering combinations
            key('alt+f', function(){fireKeyPressEvent('alt+f');});
            key('alt+n', function(){fireKeyPressEvent('alt+n');});
            key('alt+e', function(){fireKeyPressEvent('alt+e');});
            key('alt+esc', function(){fireKeyPressEvent('alt+esc');});
            key('alt+left', function(){fireKeyPressEvent('alt+left');});
        }]);

'use strict';
window.BaseDetailController = function($scope, $routeParams, $location, endpoint, editTemplateUrl, viewTemplateUrl, baseUrl) {

    $scope.detail = undefined;
    $scope.editDetail = undefined;
    $scope.baseUrl = baseUrl;

    var reload = function() {
        endpoint.get($routeParams.id).then(function(data) {
            $scope.detail = data;
        });
    };

    $scope.exists = !! $routeParams.id && $routeParams.id !== 'new';

    $scope.add = function() {
        $scope.include = editTemplateUrl;
        $scope.editDetail = {};
    };

    $scope.edit = function() {
        $scope.include = editTemplateUrl;
        $scope.editDetail = angular.copy($scope.detail);
    };

    $scope.cancelEdit = function() {
        $scope.include = viewTemplateUrl;
        if ($scope.exists) {
            $scope.editDetail = undefined;
        } else {
            $location.path(baseUrl);
        }
    };

    $scope.remove = function() {
        endpoint.remove($scope.detail.id).then(function() {
            $location.path(baseUrl);
        }, function() {
            window.alert('Failed to delete object!');
        });
    };

    $scope.save = function() {
        endpoint.save($scope.editDetail).then(function(response) {
            if (!$scope.exists) {
                var loc = response.headers('location');
                var id = loc.substring(loc.lastIndexOf('/') + 1);
                $location.path(baseUrl + '/' + id);
            } else {
                $scope.editDetail = undefined;
                $scope.include = viewTemplateUrl;
                reload();
            }
        }, function() {
            window.alert('Failed to save object!');
        });
    };

    if ($scope.exists) {
        reload();
        $scope.include = viewTemplateUrl;
    } else {
        $scope.add();
    }
};

window.BaseDetailController.$inject = ['$scope', '$routeParams', '$location', 'endpoint', 'editTemplateUrl', 'viewTemplateUrl', 'baseUrl'];

'use strict';

/**
 * BaseListController can be extended in order to include basic list functionality, such as pagination.
 * @param $scope
 * @param $reloadFn function that is called when data should be reloaded (e.g. page changes)
 * @constructor
 */
window.BaseListController = function ($scope,$reloadFn) {

    $scope.filter = {};

    $scope.sort = {
        isDesc: false,
        property: 'name'
    };

    $scope.pagination = {
        page: 1,
        size: 10
    };

    $scope.toggleSort = function(property) {
        if($scope.sort.property === property) {
            $scope.sort.isDesc = !$scope.sort.isDesc;
        } else {
            $scope.sort.property = property;
            $scope.sort.isDesc = false;
        }
    };

    // no manual call of $reloadFn is neccessary as angular treats the initial watch as as a modification as well
    // and therefor calls $relaodFn automatically
    $scope.$watch('pagination', $reloadFn, true);
};
window.BaseListController.$inject = ['$scope','$reloadFn'];


'use strict';
angular.module('multimodule.example.base.directives')
    .directive('mmePaginated', function() {
        return {
            replace: true,
            restrict: 'E',
            transclude: true,
            scope: {
                api: '=',
                collection: '='
            },
            templateUrl: 'directives/mme-paginated.tpl.html',
            link: function(scope,element,attrs) {
                if(scope.api === undefined) throw 'Attribute "api" must be set.';
                if(scope.collection === undefined) throw 'Attribute "collection" must be set and reference a scope property.';

                if(!!attrs.searchProps) {
                    scope.searchProps = _.filter(attrs.searchProps.split(','),function(prop) { return !!prop; });
                }
            },
            controller: function ($scope) {
                $scope.count = 0;

                var searchRequest = new window.SearchRequest();

                var reload = function () {
                    $scope.api.list(searchRequest).then(function (data) {
                        $scope.count = data.page.totalElements;
                        $scope.collection = data._embedded[$scope.api.resource()];
                        $scope.isSinglePageList = data.page.totalElements < $scope.pagination.size;
                    });
                };

                $scope.search = searchRequest.search();

                $scope.sort = searchRequest.sort({
                    isDesc: false,
                    property: 'name'
                });

                $scope.pagination = searchRequest.pagination();

                $scope.$emit('SortChanged', $scope.sort);

                $scope.$watch('pagination', reload,true);
                $scope.$watch('search', reload,true);

                $scope.$on('SortChanged', function (event, value) {
                    $scope.sort = searchRequest.sort(value);
                    reload();
                });
            }
        };
    });

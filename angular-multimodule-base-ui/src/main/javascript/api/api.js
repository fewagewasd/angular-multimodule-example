'use strict';

function ApiEndpoint(url, endpointName, settings, _$http_) {
    var _endpointUrl = url + (settings.url || endpointName);
    var ModelClass = settings.model;
    var $http = _$http_;
    var that = this;

    var toUrlParams = function (data, appendTo) {
        return !!data ? (!!appendTo ? appendTo : '' ) + _.reduce(_.map(_.keys(data), function (key) {
            return key + '=' + data[key];
        }), function (result, next) {
            return result + '&' + next;
        }) : '';
    };

    var fixPaginationOffset = function(paginationParams) {
        if (!paginationParams) {
            return paginationParams;
        }
        var params = angular.copy(paginationParams);
        if(!!paginationParams.page) {
            params.page = paginationParams.page - 1;
        }
        return params;
    };

    this.list = function (paginationParams) {
        var params = fixPaginationOffset(paginationParams);
        return $http.get(_endpointUrl + toUrlParams(params, '?')).then(function (response) {
            if (!!response.data.totalCount) {
                return {
                    totalCount: response.data.totalCount,
                    elements: _.map(response.data.elements, function (elem) {
                        return new ModelClass(elem);
                    })
                };
            } else {
                return _.map(response.data, function (elem) {
                    return new ModelClass(elem);
                });
            }
        });
    };

    this.listAll = function(params) {
        return that.list({all:true});
    };

    this.get = function (id) {
        return $http.get(_endpointUrl + '/' + id).then(function (response) {
            return new ModelClass(response.data);
        });
    };

    this.save = function (object) {
        if (!!object.id) {
            return $http.put(_endpointUrl + '/' + object.id, object).then(function (response) {
                return new ModelClass(response.data);
            });
        } else {
            return $http.post(_endpointUrl, object).then(function (response) {
                return new ModelClass(response.data);
            });
        }
    };

    this.remove = function (id) {
        return $http.delete(_endpointUrl + '/' + id);
    };
}

function ApiProvider() {
    var _urlPrefix = '/api/';
    var _endpoints = {};

    this.endpoint = function (path, settings) {
        _endpoints[path] = settings;
    };

    this.$get = ['$http', function ($http) {
        var $api = {};

        _.forEach(_.keys(_endpoints), function (path) {
            var settings = _endpoints[path];
            $api[path] = new ApiEndpoint(_urlPrefix, path, settings, $http);
        });

        return $api;
    }];
}

angular.module('multimodule.example.base.api').provider('$api', ApiProvider);

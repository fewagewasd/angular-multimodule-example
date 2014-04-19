'use strict';

function ApiEndpoint(url, endpointName, settings, _$http_) {
    var _endpointUrl = url + (settings.url || endpointName);
    var ModelClass = settings.model;
    var $http = _$http_;

    this.list = function (searchRequest) {
        var searchQuery = !!searchRequest && searchRequest instanceof window.SearchRequest ? '?' + searchRequest.urlEncoded() : '';
        return $http.get(_endpointUrl + searchQuery).then(function (response) {
            if (!_.isEmpty(response.data._embedded) && !!response.data._embedded[settings.url]) {
                console.log('mapping movies to domain object');
                // map the returned data to domain objects
                response.data._embedded[settings.url] = _.map(response.data._embedded[settings.url], function (data) {
                    return new ModelClass(data);
                });
            }
            return response.data;
        });
    };

    this.get = function (id) {
        return $http.get(_endpointUrl + '/' + id).then(function (response) {
            return new ModelClass(response.data);
        });
    };

    this.save = function (object) {
        if (!!object.id) {
            return $http.put(_endpointUrl + '/' + object.id, object);
        } else {
            return $http.post(_endpointUrl, object);
        }
    };

    this.remove = function (id) {
        return $http.delete(_endpointUrl + '/' + id);
    };

    this.resource = function () {
        return settings.url;
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

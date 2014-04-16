'use strict';
window.SearchRequest = function () {
    var _pagination = {
        page: 1,
        size: 10
    };
    var _sort = {};
    var _search = {};

    var _encodeSort = function () {
        return (!!_sort.property ? 'sort=' + _sort.property + ',' + (_sort.isDesc ? 'desc' : 'asc') : '');
    };

    var _encodePagination = function () {
        return 'page=' + (!!_pagination.page ? Math.max(0, _pagination.page - 1) : 0) + '&size=' + _pagination.size || 20;
    };

    var _concatenate = function (result, next) {
        if (!result) {
            return next;
        }

        if (!next) {
            return result;
        }
        return result + '&' + next;
    };

    var _encodeSearch = function () {
        return !!_search && !_.isEmpty(_search) ? _.reduce(_.map(_.keys(_search), function (key) {
            var searchTerm = !!_search[key] ? _search[key].trim() : undefined;
            return !!searchTerm ? key + '=' + searchTerm : undefined;
        }), _concatenate) : '';
    };

    this.pagination = function (pagination) {
        if (pagination === undefined) {
            return _pagination;
        } else {
            _pagination = pagination;
            return _pagination;
        }
    };

    this.sort = function(sort) {
        if(sort === undefined) {
            return _sort;
        } else {
            _sort = sort;
            return _sort;
        }
    };

    this.search = function (search) {
        if (search === undefined) {
            return _search;
        } else {
            _search = search;
            return _search;
        }
    };

    this.urlEncoded = function () {
        return _([_encodePagination(), _encodeSort(), _encodeSearch()]).reduce(_concatenate);
    };
};
'use strict';
angular.module('multimodule.example.base.directives')
    .directive('mmeConfirmClick', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var msg = attr.mmeConfirmClick || 'Are you sure?';
                var clickAction = attr.mmeOnConfirm;
                element.bind('click', function (event) {
                    if (window.confirm(msg)) {
                        scope.$eval(clickAction);
                    }
                });
            }
        };
    });

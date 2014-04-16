angular.module('multimodule.example.base.controllers', []);
angular.module('multimodule.example.base.directives', []);
angular.module('multimodule.example.base.api', []);
angular.module('multimodule.example.base', ['multimodule.example.base.api', 'multimodule.example.base.directives', 'multimodule.example.base.controllers']);

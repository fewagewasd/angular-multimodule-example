angular.module('multimodule.example.base.service', []);
angular.module('multimodule.example.base.directives', []);
angular.module('multimodule.example.base.api', []);
angular.module('multimodule.example.base', ['multimodule.example.base.api', 'multimodule.example.base.service', 'multimodule.example.base.template']);


'use strict';

(function(){

	angular.module('anapro.formly.select-async', [])

	.run(function(formlyConfig){

		var controller = function($scope, anaproFormlyFactoryAsyncOptions){

			$scope.options.data = $scope.options.data || {};

			anaproFormlyFactoryAsyncOptions.getInstance($scope).init();

		};

		formlyConfig.setType({
			name: 'select-async',
			extends: 'select',
			controller: controller
		});

	})

	;

})();

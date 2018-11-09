
'use strict';

(function(){

	angular.module('anapro.formly.switch', [])

	.run(function(
		formlyConfig
	){

		var controller = function($scope){

			$scope.onclick = function(event){
				if($scope.options.data && typeof $scope.options.data.onclick == 'function'){
					$scope.options.data.onclick(event, $scope.options);
				}
			};

		};

		formlyConfig.setType({
			name: 'anaproSwitch',
			templateUrl: 'formly-templates/switch.html',
			defaultOptions: {
				ngModelAttrs: {
					customTrueValue: {
						attribute: 'ng-true-value'
					},
					customFalseValue: {
						attribute: 'ng-false-value'
					}
				}
			},
			controller: controller
		});

	})

	;

})();

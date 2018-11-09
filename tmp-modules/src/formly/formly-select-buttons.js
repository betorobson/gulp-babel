
'use strict';

(function(){

	angular.module('anapro.formly.select-buttons', [])

	.run(function(formlyConfig){

		var controller = function($scope){

			var setModel = function(option){

				if(
					$scope.model[$scope.options.key] == option.value
					&&
					!$scope.to.required
				){
					delete $scope.model[$scope.options.key];
				}else{
					$scope.model[$scope.options.key] = option.value;
				}

			};

			$scope.select = function(option){

				setModel(option);

				if($scope.options.data && $scope.options.data.onChange){
					$scope.options.data.onChange($scope.options, option.value);
				}

			};

		};

		formlyConfig.setType({
			name: 'anaproSelectButtons',
			templateUrl: 'formly-templates/select-buttons.html',
			extends: 'input',
			controller: controller
		});

	})

	;

})();

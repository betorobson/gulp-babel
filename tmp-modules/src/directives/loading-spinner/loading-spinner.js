
'use strict';

(function(){

	angular.module('directives.loading-spinner',[])

	.controller(
		'LoadingSpinnerController',

		function(
			$scope
		){
			$scope;
		}
	)

	.directive('loadingSpinner', function(){
		return {
			restrict: 'E',
			templateUrl: 'loading-spinner/loading-spinner.html',
			controller: 'LoadingSpinnerController as loadingSpinner'
		};
	});

})();

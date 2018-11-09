
'use strict';

(function(){

	angular.module('directives.card-actions-tour',[])

	.controller(
		'CardActionsTourController',

		function(
			$scope
		){
			$scope;
		}
	)

	.directive('cardActionsTour', function(){

		return {
			restrict: 'E',
			templateUrl: 'card-actions/card-actions-tour.html',
			controller: 'CardActionsTourController',
			scope: {
				active: '='
			},
			replace: true
		};

	});

})();

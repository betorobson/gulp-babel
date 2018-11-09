
'use strict';

(function(){

	angular.module('directives.card-actions-sms',[])

	.controller(
		'CardActionsSmsController',

		function(
			$scope
		){
			$scope;
		}
	)

	.directive('cardActionsSms', function(){

		return {
			restrict: 'E',
			templateUrl: 'card-actions/card-actions-sms.html',
			controller: 'CardActionsSmsController',
			scope: {
				active: '='
			},
			replace: true
		};

	});

})();

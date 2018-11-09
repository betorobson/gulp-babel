
'use strict';

(function(){

	angular.module('directives.icon-medal', [])

	.controller(
		'IconMedalController',

		function(
			$scope
		){
			$scope;
		}
	)

	.directive('iconMedal', function(){
		return {
			restrict: 'E',
			scope: {
				number: '@number',
			},
			templateUrl: 'icon-medal/icon-medal.html',
			controller: 'IconMedalController as iconMedal'
		};
	})

	;

})();

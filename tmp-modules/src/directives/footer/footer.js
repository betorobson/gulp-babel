
'use strict';

(function(){

	angular.module('directives.footer',[])

	.controller(
		'FooterController',

		function(
			$scope,
			$window
		){

			$scope.version = $window.VERSION;
		}
	)

	.directive('footer', function(){
		return {
			restrict: 'E',
			templateUrl: 'footer/footer.html',
			controller: 'FooterController'
		};
	});

})();

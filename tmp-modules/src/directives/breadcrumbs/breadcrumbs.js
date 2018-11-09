
'use strict';

(function(){

	angular.module('directives.breadcrumbs',[])

	.controller(
		'BreadcrumbsController',

		function(
			$scope,
			path
		){

			// add home as first
			$scope.trail.splice(0,0,{
				label: path.getLabel('home'),
				path: path.getPath('home')
			});

			console.log($scope.trail);

		}
	)

	.directive('breadcrumbs', function(){
		return {
			restrict: 'E',
			scope: {
				trail: '='
			},
			templateUrl: 'breadcrumbs/breadcrumbs.html',
			controller: 'BreadcrumbsController'
		};
	});

})();

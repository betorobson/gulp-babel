
'use strict';

(function(){

	angular.module('directives.view-title',[])

	.controller(
		'ViewTitleController',

		function(
			$scope
		){

			if($scope.extra && $scope.extra.constructor.name != 'Array'){
				$scope.extra = [$scope.extra];
			}

		}
	)

	.directive('viewTitle', function(){
		return {
			restrict: 'E',
			link: function(scope, element, attrs){
				attrs.$set('title', null);
			},
			scope: {
				title: '=',
				subtitle: '=',
				desc: '=',
				extra: '='
			},
			templateUrl: 'view-title/view-title.html',
			controller: 'ViewTitleController',
			transclude: true
		};
	});

})();

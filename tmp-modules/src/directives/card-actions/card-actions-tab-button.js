
'use strict';

(function(){

	angular.module('directives.card-actions-tab-button',[])

	.controller(
		'CardActionsTabButtonController',

		function(
			$scope
		){

			$scope.setTabSelected = function(){
				$scope.$parent.setTabSelected({
					targetId: $scope.targetId
				});
				// if($scope.dataToggle){
				// 	$scope.$parent.tabSelected = $scope.targetId;
				// }
			};

		}
	)

	.directive('cardActionsTabButton', function(mainController){

		var link = function(scope, element, attributes){
			if(mainController.getDevice() == 'desktop' && /mailto|wa\.me/.test(attributes.ngHref)){
				element.find('a').attr('target', '_blank');
			}
		};

		return {
			restrict: 'E',
			templateUrl: 'card-actions/card-actions-tab-button.html',
			controller: 'CardActionsTabButtonController',
			transclude: true,
			replace: true,
			link: link,
			scope: {
				targetId: '@targetId',
				href: '@',
				icon: '@',
				active: '=',
				disabled: '@'
			}
		};

	});

})();


'use strict';

(function(){

	angular.module('directives.card-actions-sells',[])

	.controller(
		'CardActionsSellsController',

		function(
			$scope,
			$window
		){

			$scope.$parent.cardActionsTabSelectedDelegate['sells'] = function(){

				if($scope.$parent.modalDelegate){
					$scope.$parent.modalDelegate.setTitle($scope.$parent.tabSelected);
				}

				$window.open(
					'https://crm.anapro.com.br/webcrm/pages/pageredirect.aspx?url='
					+ $scope.delegate.data.urlModuleSells,
					'AnaproModuleSells'
				);

				$scope.$parent.setTabSelected({
					targetId: 'activity'
				});

				if($scope.$parent.modalDelegate){
					$scope.$parent.modalDelegate.hide();
				}

			};

		}
	)

	.directive('cardActionsSells', function(){

		return {
			restrict: 'E',
			templateUrl: 'card-actions/card-actions-sells.html',
			controller: 'CardActionsSellsController',
			scope: {
				delegate: '=?'
			},
			replace: true
		};

	});

})();

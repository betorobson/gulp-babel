
'use strict';

(function(){

	angular.module('directives.card-actions-email-select',[])

	.controller(
		'CardActionsEmailSelect',

		function(
			$scope
		){

			$scope.delegate = $scope.delegate || {};

			$scope.emailSelect = function(email){

				if(typeof $scope.delegate.emailSelected == 'function'){
					$scope.delegate.emailSelected(email);
				}

			};

		}
	)

	.directive('cardActionsEmailSelect', function(){

		return {
			restrict: 'E',
			templateUrl: 'card-actions/directives/email-select/email-select.html',
			controller: 'CardActionsEmailSelect',
			scope: {
				item: '=?',
				delegate: '=?'
			},
		};

	});

})();

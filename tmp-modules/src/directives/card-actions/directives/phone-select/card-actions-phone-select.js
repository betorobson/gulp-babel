
'use strict';

(function(){

	angular.module('directives.card-actions-phone-select',[])

	.controller(
		'CardActionsPhoneSelect',

		function(
			$scope
		){

			$scope.delegate = $scope.delegate || {};

			$scope.phoneSelect = function(phoneNumber){

				if(typeof $scope.delegate.phoneSelected == 'function'){
					$scope.delegate.phoneSelected(phoneNumber);
				}

			};

		}
	)

	.directive('cardActionsPhoneSelect', function(){

		return {
			restrict: 'E',
			templateUrl: 'card-actions/directives/phone-select/card-actions-phone-select.html',
			controller: 'CardActionsPhoneSelect',
			scope: {
				item: '=?',
				delegate: '=?'
			},
		};

	});

})();

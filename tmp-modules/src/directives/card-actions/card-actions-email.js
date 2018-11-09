
'use strict';

(function(){

	angular.module('directives.card-actions-email',[])

	.controller(
		'CardActionsEmailController',

		function(
			$scope,
			cardActionFactory,
			mainController
		){

			$scope.cardActionsEmailSelectDelegate = {
				emailSelected: function(email){
					$scope.delegate.data.emailClient = email;
					send();
				}
			};

			$scope.$parent.cardActionsTabSelectedDelegate['email'] = function(){

				if($scope.$parent.modalDelegate){
					$scope.$parent.modalDelegate.setTitle($scope.$parent.tabSelected);
				}

				if($scope.delegate.data.emails.length > 1){
					$scope.delegate.data.emailClient = null;
				}else{
					send();
				}

			};

			var getMessageUrl = function(){
				return cardActionFactory
					.getContactLinks($scope.delegate.data)
					.email;
			};

			var send = function(){

				var newWindow = mainController.getDevice() == 'desktop';

				if(newWindow){
					window.open(getMessageUrl(), 'AnaproAppSendEmail');
				}else{
					document.location = getMessageUrl();
				}

				$scope.$parent.setTabSelected({
					targetId: 'activity'
				});

				if($scope.$parent.modalDelegate){
					$scope.$parent.modalDelegate.hide();
				}

			};

		}
	)

	.directive('cardActionsEmail', function(){

		return {
			restrict: 'E',
			templateUrl: 'card-actions/card-actions-email.html',
			controller: 'CardActionsEmailController',
			scope: {
				active: '=?',
				delegate: '=?'
			},
			replace: true
		};

	});

})();

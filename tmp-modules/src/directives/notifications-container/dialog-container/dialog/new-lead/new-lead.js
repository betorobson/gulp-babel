
'use strict';

(function(){

	angular.module('directives.notifications-container.dialog.new-lead',[])

	.config(function(notificationsContainerDialogProvider){

		notificationsContainerDialogProvider.putDialogType(
			'newLead',
			{
				priority: 1,
				limit: 2,
				collectionKey: 'pendingProcessingTransactionWaitingAttend',
				directive: 'new-lead',
				sound: 'new-lead',
				desktopNotification: {
					icon: '/assets/imgs/icons/notification-new-lead.png'
				}
			}
		);

	})

	.controller(
		'NotificationsContainerDialogNewLeadController',

		function(
			$rootScope,
			$scope,
			path,
			notificationCenterDialogs
		){

			var dialogId = $scope.dialog.data.id;

			$scope.newLeadImg = $scope.dialog.data.prospectUrlImagem;

			$scope.open = function(){

				$rootScope.mainController.go(
					path.get('transaction').withItem({
						id: $scope.dialog.data.atendimentoIdGuid
					})
				);

				$scope.remove(null, {
					actionOrigin: 'open'
				});
			};

			$scope.onRemoveDialogType = function(){
				notificationCenterDialogs.removeById(dialogId, true);
			};

		}
	)

	.directive('dialogNewLead', function(){

		return {
			restrict: 'E',
			templateUrl: 'notifications-container/dialog-container/dialog/new-lead/new-lead.html',
			controller: 'NotificationsContainerDialogNewLeadController',
		};

	});

})();

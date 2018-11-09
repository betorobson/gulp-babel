
'use strict';

(function(){

	angular.module('directives.notifications-container',[
		'directives.notifications-container.dialog-container'
	])

	.run(function(toastrConfig){

		angular.extend(toastrConfig, {
			maxOpened: 10,
			extendedTimeOut: 0,
			positionClass: 'toast-bottom-right',
			// target: document.querySelector('#toastr-container-wrapper') || 'body'
		});

	})

	.controller(
		'NotificationsContainerController',

		function(
			$scope,
			$timeout,
			toastrFactory,
			notificationCenter
		){

			$timeout(function(){
				notificationCenter.init();
			});

		}
	)

	.directive(
		'notificationsContainer',

		function(
			toastrConfig,
			desktopNotificationsFactory
		){

			var postLInk = function(){

				angular.extend(toastrConfig, {
					target: '#toastr-container-wrapper'
				});

				desktopNotificationsFactory.hasPermission();

			};

			return {
				restrict: 'E',
				templateUrl: 'notifications-container/notifications-container.html',
				controller: 'NotificationsContainerController',
				scope: {},
				link: {
					post: postLInk
				}
			};

		}
	);

})();

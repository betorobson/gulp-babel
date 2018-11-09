
'use strict';

(function() {

	angular.module('directives.navigationBarChat', [])

		.controller(
			'NavigationBarChatController',

			function(
				$scope,
				userStatusFactory,
				notificationCenterTransactionsAwaiting
			) {

				$scope.isEnabled = function(){
					return userStatusFactory.isEnabled('chat');
				};

				var bulletClass = {};

				$scope.getBulletClass = function(){

					angular.merge(
						bulletClass,
						{
							disabled: userStatusFactory.isDisabled('chat'),
							online: userStatusFactory.isOnline('chat'),
							offline: userStatusFactory.isOffline('chat'),
							paused: userStatusFactory.isPaused('chat')
						}
					);

					return bulletClass;

				};

				$scope.getTotalChats = function(){
					return notificationCenterTransactionsAwaiting.getTotalChats() || '';
				};

			}
		)

		.directive('navigationBarChat', function() {
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'navigation-bar/chat/navigation-bar-chat.html',
				controller: 'NavigationBarChatController as navigationBarChatController'
			};
		});

})();

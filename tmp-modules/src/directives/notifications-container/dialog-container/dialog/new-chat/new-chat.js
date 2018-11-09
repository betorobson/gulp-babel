
'use strict';

(function(){

	angular.module('directives.notifications-container.dialog.new-chat',[])

	.config(function(
		notificationsContainerDialogProvider,
		firebaseCollections
	){

		notificationsContainerDialogProvider.putDialogType(
			'newChat',
			{
				priority: 0,
				limit: 1,
				collectionKey: firebaseCollections.chat,
				directive: 'new-chat',
				sound: 'chat1',
				desktopNotification: {
					icon: '/assets/imgs/icons/notification-new-chat.png'
				}
			}
		);

	})

	.controller(
		'NotificationsContainerDialogNewChatController',

		function(
			$scope,
			$timeout,
			audioFactory
		){

			var sound;
			var soundTimer;

			var playSound = function(){
				soundTimer = $timeout(function(){
					sound = audioFactory.play('chat2', playSoundResume);
					sound.loop = true;
				},2000);
			};

			var playSoundResume = function(){
				if(soundTimer){
					playSound();
				}
			};

			playSound();

			$scope.open = function(){
				window.open('//' + $scope.dialog.data.Href, 'AnaproChat');
				$scope.remove();
			};

			$scope.onRemoveDialogType = function(){

				if(sound){
					sound.pause();
					sound.src = '';
					sound = null;
				}

				if(soundTimer){
					$timeout.cancel(soundTimer);
					soundTimer = null;
				}

			};

		}
	)

	.directive('dialogNewChat', function(){

		return {
			restrict: 'E',
			templateUrl: 'notifications-container/dialog-container/dialog/new-chat/new-chat.html',
			controller: 'NotificationsContainerDialogNewChatController',
		};

	});

})();

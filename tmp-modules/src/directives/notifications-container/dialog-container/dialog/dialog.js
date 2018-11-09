
'use strict';

(function(){

	angular.module('directives.notifications-container.dialog',[
		'directives.notifications-container.dialog.provider',
		'directives.notifications-container.dialog.new-lead',
		'directives.notifications-container.dialog.new-chat'
	])

	.controller(
		'NotificationsContainerDialogController',

		function(
			$scope,
			audioFactory,
			desktopNotificationsFactory
		){

			var
				dialogType = $scope.dialog.getType(),
				sound,
				soundResume = true;

			var playSound = function(){
				if(dialogType.sound && soundResume){
					sound = audioFactory.play(dialogType.sound, playSound);
				}
			};

			playSound();

			$scope.stopSound = function(){

				if(sound){
					sound.pause();
					sound.src = '';
					sound = null;
				}

				soundResume = false;
			};

			$scope.dialogClick = function(){
				if($scope.dialog.data.minimized && $scope.open){
					$scope.open();
				}
			};

			var closeDesktopNotification = function(){
				if($scope.dialog.data.id){
					desktopNotificationsFactory.closeById($scope.dialog.data.id);
				}
			};

			$scope.remove = function(event, attrs){

				closeDesktopNotification();

				if(event){
					event.stopPropagation();
				}

				$scope.dialog.remove(attrs);
			};

			$scope.onRemove = function(){

				$scope.stopSound();

				if($scope.onRemoveDialogType){
					$scope.onRemoveDialogType();
				}

			};

		}
	)

	.directive(
		'notificationsContainerDialog',

		function(
			$compile
		){

			var compile = function(){

				return {

					pre: function(scope, iElement){

						var type = scope.dialog.getType();

						var dialogTypeElement = $compile(
							'<dialog-'
								+ type.directive
								+ ' layout="row" '
								+ ' layout-fill '
								+ ' layout-align="start center" '
								+ '></' + type.directive + '>'
						)(scope);

						iElement.append(dialogTypeElement);

					},

					post: function(scope, iElement){

						iElement.on(
							'$destroy',
							function(){
								scope.$destroy();
								delete scope.dialog;
							}
						);

						scope.$on(
							'$destroy',
							function(){
								scope.onRemove();
								scope.$destroy();
								delete scope.dialog;

							}
						);

					}
				};

			};

			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'notifications-container/dialog-container/dialog/dialog.html',
				controller: 'NotificationsContainerDialogController',
				scope: {
					dialog: '='
				},
				compile: compile
			};

		}

	);

})();


'use strict';

(function(){

	angular.module('directives.notifications-container.dialog-container',[
		'directives.notifications-container.dialog'
	])

	.provider('notificationsContainerDialogContainer', function(){

		var self = this;

		var element;

		var scope;

		self.setElement = function(scopeElement, directiveElement){
			scope = scopeElement;
			element = directiveElement;
		};

		self.getNewScope = function(){
			return scope.$new();
		};

		self.$get = function(
			$timeout
		){

			self.append = function(dialog){

				$timeout(function(){
					element.append(dialog.element);
				});

			};

			return self;

		};

	})

	.controller(
		'NotificationsContainerDialogContainerController',

		function($scope){
			$scope;
		}
	)

	.directive(
		'notificationsContainerDialogContainer',

		function(notificationsContainerDialogContainer){

			return {
				restrict: 'E',
				templateUrl: 'notifications-container/dialog-container/dialog-container.html',
				controller: 'NotificationsContainerDialogContainerController',
				scope: {},
				compile: function(){
					return {
						pre: function(scope, element){
							notificationsContainerDialogContainer.setElement(scope, element);
						}
					};
				}
			};

		}
	);

})();

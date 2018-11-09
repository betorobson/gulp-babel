
'use strict';

(function(){

	angular.module('directives.user-status-bullet',[])

	.factory(
		'UserStatusBulletFactory',
		function(){

			var popovers = [];

			var hideAll = function(){
				popovers.map(function(popover){
					popover.hide();
				});
			};

			var putPopover = function(popover){
				popovers.push(popover);
			};

			return {
				putPopover: putPopover,
				hideAll: hideAll
			};

		}
	)

	.controller(
		'UserStatusBulletController',

		function(
			$scope,
			$element,
			$timeout,
			$popover,
			$attrs,
			UserStatusBulletFactory,
			userStatusFactory,
			userStatusLabels
		){

			$scope.getChannelValueLabel = function(channel){
				return userStatusFactory.getChannelValueLabel(channel);
			};

			var listAllChannels = typeof $attrs.list != 'undefined';

			$scope.listAllChannels = function(){
				return listAllChannels;
			};

			$scope.getClass = function(){

				var overall = userStatusFactory.get().overall;

				return angular.merge(
					{
						switchers: !!$scope.switchers || $element.attr('switchers') === ''
					},
					overall
						? {online: true}
						: {offline: true}
				);

			};

			$scope.getChannelClass = function(channel){

				if(userStatusFactory.isDisabled(channel)){
					return {
						disabled: true
					};
				}else{
					return {
						offline: userStatusFactory.isOffline(channel),
						online: userStatusFactory.isOnline(channel),
						paused: userStatusFactory.isPaused(channel),
					};
				}

			};

			$scope.getChannelLabel = function(channel){
				return userStatusLabels[channel];
			};

			$scope.canUserChangeChannelStatus = function(channel){
				return userStatusFactory.canUserChange(channel);
			};

			$scope.layout = $attrs.layout;

			if(listAllChannels){
				$scope.allUserStatus = userStatusFactory.get();
			}

			if($scope.switchers || $element.attr('switchers') === ''){
				$timeout(function(){

					UserStatusBulletFactory.putPopover(
						$popover(
							angular.element($element[0].querySelector('div')),
							{
								scope: $scope,
								title: 'Status nos canais',
								contentTemplate: 'user-status/user-status-switchers-popover.html',
								trigger: 'click',
								autoClose: true,
								animation: 'am-flip-x',
								placement: 'bottom-left',
								onBeforeShow: UserStatusBulletFactory.hideAll
							}
						)
					);

				},0);
			}

			$scope.getNextPositionInQueues = function(channel){

				var position = userStatusFactory.getNextPositionInQueues(channel);

				if(/string|number/.test(typeof position)){
					return '[' + position + ']';
				}

				return '';

			};

		}
	)

	.directive('userStatusBullet', function(
		userStatusFactory
	){

		var compile = function(){

			return {

				// remove bullet status if there is not any available channel
				pre: function(scope, iElement){
					if(userStatusFactory.get().noChannelsAvailable){
						iElement.remove();
					}
				}
			};

		};

		return {
			restrict: 'E',
			compile: compile,
			scope: {
				switchers: '=',
				list: '='
			},
			// replace: true,
			templateUrl: 'user-status/user-status-bullet.html',
			controller: 'UserStatusBulletController'
		};
	});

})();


'use strict';

(function(){

	angular.module('directives.user-position-in-queues',[
		'directives.user-position-in-queues.channel-position-in-queue'
	])

	.controller(
		'UserPositionInQueuesController',

		function(
			$scope,
			userStatusLabels,
			permission,
			userStatusFactory,
			notificationCenterPositionInQueues
		){

			$scope.data = [];

			var dispatchCallbackAttrs = {
				success: function(data){

					$scope.data = data;

				}
			};

			notificationCenterPositionInQueues.dispatchCallback(dispatchCallbackAttrs);

			$scope.hasQueues = function(){

				var hasQueues = false;

				for(var i=0; i<$scope.data.length; i++){

					if($scope.isChannelQueueVisible($scope.data[i].channelProperties.channel)){
						hasQueues = true;
						break;
					}
				}

				return hasQueues;

			};

			var channelLabelPreprositions = {
				'chat' : 'do',
				'phone': 'da',
				'others': 'de'
			};

			$scope.getChannelLabel = function(channel){
				return channelLabelPreprositions[channel]
					+ ' '
					+ userStatusLabels[channel];
			};

			$scope.isChannelQueueVisible = function(channel){
				return userStatusFactory.isOnline(channel)
				||
				userStatusFactory.isPaused(channel);
			};

			$scope.$on(
				'$destroy',
				function(){
					// prevent memory leaks
					dispatchCallbackAttrs.success = null;
				}
			);

		}
	)

	.directive('userPositionInQueues', function(){
		return {
			restrict: 'E',
			scope: {},
			templateUrl: 'user-position-in-queues/user-position-in-queues.html',
			controller: 'UserPositionInQueuesController'
		};
	});

})();

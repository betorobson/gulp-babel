
'use strict';

(function(){

	angular.module('directives.user-position-in-queues.channel-position-in-queue',[])

	.controller(
		'ChannelPositionInQueueController',

		function(
			$rootScope,
			$scope,
			$modal,
			path
		){

			$scope.showQueue = function(item){
				$rootScope.mainController.go(
					path.get('queues-handler-position').withItem(item)
				);
			};

			$scope.showRules = function(){
				$modal({
					templateUrl: 'user-position-in-queues/rules-modal.html',
					show: true,
					animation: 'am-fade-and-slide-top',
					scope: $scope
				});
			};

		}
	)

	.directive('channelPositionInQueue', function(){
		return {
			restrict: 'E',
			replace: true,
			controller: 'ChannelPositionInQueueController',
			scope: {
				item: '=',
				queueName: '='
			},
			templateUrl: 'user-position-in-queues/channel-position-in-queue.html'
		};
	});

})();

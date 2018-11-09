
'use strict';

(function(){

	angular.module('directives.chat',[])

	.controller(
		'ChatController',

		function(
			$scope
		){

			$scope;

		}
	)

	.directive('chat', function(){
		return {
			restrict: 'E',
			templateUrl: 'chat/chat.html',
			controller: 'ChatController'
		};
	});

})();

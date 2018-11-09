
'use strict';

(function(){

	angular.module('directives.mainController',[])

	.controller(
		'MainController',

		function(
			$rootScope,
			$scope,
			$location,
			$element,
			$timeout,
			path,
			mainController,
			usersService
		){

			console.log('main controller');

			// redirect between views
			// used by ng-click
			var go = function(view, replace){
				if(view){
					if(replace)
						$location.path(view).replace();
					else
						$location.path(view);
				}
			};

			// automatically invoked by provider.path.setCurrent(name)
			// do NOT call it by yourself
			var setViewAttribute = function(){

				$($element).attr(
					'view',
					path.getCurrentViewName()
				);

				$scope.mainController.currentView = path.getCurrentViewName();

			};

			$scope.userProfileLoaded = function(){
				return usersService.isProfileLoaded();
			};

			// hold all main controller communication
			$rootScope.mainController = {
				device: mainController.getDevice(),
				go: go,
				currentView: null,
				setViewAttribute: setViewAttribute
			};

			// set device attribute
			$($element).attr(
				'device',
				$scope.mainController.device
			);

		}
	)

	.directive('mainController', function(){
		return {
			restrict: 'E',
			templateUrl: 'main-controller/main-controller.html',
			controller: 'MainController'
		};
	});

})();


'use strict';

(function() {

	angular.module('directives.navigationBarMobileUserStatus', [])

	.controller(
		'NavigationBarMobileUserStatusController',

		function(
			$scope,
			$element,
			$timeout,
			path,
			userStatusFactory,
			usersService
		) {

			$scope.userProfile = {};
			$scope.delegate = $scope.delegate || {};

			$scope.classToggle = {
				show: false
			};

			$scope.toggle = function(){
				$scope.classToggle.show = !$scope.classToggle.show;
				runDelegate();
			};

			$element.on(
				'click',
				function(event){
					if(!$(event.target).closest('[hide-mobile-menu-on-tap]').length){
						event.stopPropagation();
					}
				}
			);

			var runDelegate = function(){
				if($scope.classToggle.show && $scope.delegate.show){
					$scope.delegate.show();
				}else if(!$scope.classToggle.show && $scope.delegate.hide){
					$scope.delegate.hide();
				}
			};

			var getUserProfile = function(reload){
				usersService.getUserProfile({
					reload: reload,
					success: function(response){
						$scope.userProfile = response.data;
					}
				});
			};

			runDelegate();
			getUserProfile();

		}
	)

	.directive('navigationBarMobileUserStatus', function() {
		return {
			restrict: 'E',
			scope: {
				delegate: '='
			},
			templateUrl: 'navigation-bar/mobile-user-status/mobile-user-status.html',
			controller: 'NavigationBarMobileUserStatusController as navigationBarMobileUserStatusController'
		};
	});

})();

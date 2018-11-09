
'use strict';

(function(){

	angular.module('directives.perfil',[
		'directives.perfil-transactions-report',
		'services.users'
	])

	.controller(
		'PerfilController',

		function(
			$scope,
			path,
			usersService
		){

			$scope.pathUserProfile = path.getPath('user-profile');
			$scope.userProfile = {};

			$scope.collapse = function($event){
				if($($event.target).closest('user-status-bullet').length){
					$event.stopPropagation();
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

			getUserProfile();

		}
	)

	.directive('perfil', function(){
		return {
			restrict: 'E',
			templateUrl: 'perfil/perfil.html',
			controller: 'PerfilController'
		};
	});

})();

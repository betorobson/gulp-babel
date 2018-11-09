
'use strict';

(function(){

	angular.module('views.auth',[])

	.controller(
		'ViewAuthController',

		function(
			$scope,
			$location,
			$timeout,
			path,
			authService
		){

			path.setCurrent('auth');

			$scope.showForm = !!window.APIFAKE;
			$scope.loading = false;
			$scope.submitStatus = {
				success: false,
				error: false
			};

			$scope.forms = {
				auth: null
			};
			$scope.model = {};
			$scope.fields = [
				{
					type: 'input',
					key: 'username',
					templateOptions: {
						type: 'text',
						label: 'Usuário',
						required: true
					}
				},
				{
					type: 'input',
					key: 'password',
					templateOptions: {
						type: 'password',
						label: 'Senha',
						required: true
					}
				}
			];

			var postExecute = function(response){
				$timeout(function(){

					$scope.submitStatus.success = false;
					$scope.submitStatus.error = false;
					$scope.loading = false;

					if(response.data.token){
						$location.path(path.getPath('home')).replace();
					}

				},500);
			};

			$scope.loginSubmit = function(){
				if($scope.forms.auth.$valid && !$scope.loading){
					$scope.loading = true;
					authService.post({
						data: $scope.model,
						success: function(response){
							$scope.submitStatus.success = true;
							postExecute(response);
						},
						error: function(response){
							$scope.submitStatus.error = true;
							postExecute(response);
						}
					});
				}
			};

		}
	);

})();

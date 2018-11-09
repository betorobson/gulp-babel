
'use strict';

(function(){

	angular.module('config.logout',[])

	.run(function(
		$rootScope,
		$location,
		$timeout,
		authCookieFactory,
		authService,
		firebaseProvider,
		longpollingService,
		path,
		toastr,
		toastrFactory,
		usersService
	){

		var dispatchToastrMessages = function(response){

			toastr.clear();

			if(!response.config.goToAnaproLogin){

				var toastrObj = {
					target: 'body',
					allowHtml: true,
					closeButton: false,
					onTap: function(){
						authCookieFactory.goToAnaproLogin();
					}
				};

				response.config = response.config || {};

				angular.merge(
					response.config,
					{
						toastrMessages: {}
					}
				);

				angular.merge(
					toastrObj,
					{
						title: 'Login encerrado!',
						message: 'Clique aqui para efetuar login novamente.',
					},
					response.config.toastrMessages.payloadError || {}
				);

				toastrFactory.error(toastrObj);

			}
		};

		var stopServices = function(){
			longpollingService.stop();
			firebaseProvider.signout();
		};

		var logoutSuccess = function(response){
			if(response.config.goToAnaproLogin){
				authCookieFactory.goToAnaproLogin();
			}else{
				$location.path(path.getPath('auth')).replace();
			}
		};

		// request user authentication
		$rootScope.$on('requestUserAuthentication', function(event, response){

			console.log('$rootScope.$on.requestUserAuthentication -> triggered', response);

			if(usersService.isProfileLoaded()){
				dispatchToastrMessages(response);
			}

			stopServices();
			authService.logoutSuccess();
			logoutSuccess(response);
			usersService.clearCache();

		});

		var logout = function(event, response){

			console.log('$rootScope.$on.logout -> triggered', response);

			dispatchToastrMessages(response);
			stopServices();

			authService.logout({
				success: function(){
					logoutSuccess(response);
				}
			});

		};

		$rootScope.$on('logout', logout);

	});

})();

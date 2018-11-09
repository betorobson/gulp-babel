
'use strict';

(function(){

	angular.module('config.init.token',[])

	.run(function(authCookieFactory, authService){

		authService.clearStorageWheLastTokenHasBeenChanged();
		authService.getToken();
		authCookieFactory.checkCookie();

		if(!authService.token){
			authCookieFactory.goToAnaproLogin();
		}

	});

})();

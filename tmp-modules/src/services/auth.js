
'use strict';

(function(){

	angular.module('services.auth', [])

		.run(function(
			$rootScope,
			$location,
			authService
		){

			// Token Cookie Has Been Changed
			$rootScope.$on('tokenCookieHasBeenChanged', function(){
				console.log('tokenCookieHasBeenChanged triggered');
				authService.cookieHasBeenChanged();
				$location.path('/').replace();
			});

			// Token Cookie Has Been Changed But User is the same
			$rootScope.$on('tokenCookieHasBeenChangedButUserIsTheSame', function(){
				console.log('tokenCookieHasBeenChangedButUserIsTheSame triggered');
				authService.cookieHasBeenChangedButUserIsTheSame();
			});

		})

		.factory(

			'authService',

			function(
				$window,
				$http,
				$rootScope,
				CacheFactory,
				authCookieFactory,
				apiToken,
				usersService,
				urls,
				analyticsService
			){

				var cacheToken = apiToken.getCache();

				var loadUserProfile = function(){
					if(service.token){
						usersService.getUserProfile({
							goToAnaproLogin: true,
							noCache: true,
							success: function(){
								analyticsService.setUsername();
							}
						});
					}
				};

				var logoutSuccess = function(response, attrs){

					attrs = attrs || {};

					service.removeToken();
					CacheFactory.clearAll();
					authCookieFactory.clear();

					if(typeof attrs.success == 'function'){
						attrs.success(response || {});
					}

				};

				var getCacheToken = function(){
					return cacheToken.get('token') || undefined;
				};

				var service = {

					token: null,

					logoutSuccess: logoutSuccess,

					clearStorageWheLastTokenHasBeenChanged: function(){

						var currentTokenCookie = authCookieFactory.get();
						var lastTokenCookie = (getCacheToken() || {}).token;

						if(lastTokenCookie != currentTokenCookie){
							console.log([
								'clearStorageWheLastTokenHasBeenChanged',
								'lastTokenCookie: ' + lastTokenCookie,
								'currentTokenCookie: ' + currentTokenCookie
							]);
							CacheFactory.clearAll();
						}

					},

					getCookie: function(){

						var tokenCookie = authCookieFactory.get();

						if(tokenCookie){

							service.saveToken({
								token: tokenCookie
							});

						}

					},

					saveToken: function(data){
						if(data){
							service.token = data;
							cacheToken.put('token', data);
							service.addDefaultHeaderToken(data);
						}
					},

					getToken: function(){
						service.getCookie();
						service.token = getCacheToken();
						service.addDefaultHeaderToken(service.token);
						loadUserProfile();
					},

					removeToken: function(){
						cacheToken.remove('token');
						service.token = null;
						service.addDefaultHeaderToken(undefined);
					},

					logout: function(attrs){

						if(!service.token){
							logoutSuccess(null, attrs);

							return;
						}

						$http({
							url: urls.apiHost + urls.apiPaths.logout,
							method: 'GET',
							toastrMessages: {
								success: null
							}
						}).then(
							function(response){
								logoutSuccess(response, attrs);
							},
							function(response){
								console.error('Logout error', response);
								logoutSuccess(response, attrs);
							}
						);

						usersService.clearCache();

					},

					cookieHasBeenChanged: function(){
						CacheFactory.clearAll();
						usersService.clearCache();
						service.getCookie();
						$window.location.reload();
					},

					cookieHasBeenChangedButUserIsTheSame: function(){
						service.saveToken({
							token: authCookieFactory.get()
						});
					},

					// add token on default request headers
					addDefaultHeaderToken: function(tokenObj){

						$http.defaults.withCredentials = true;

						if(tokenObj && tokenObj.token){
							$http.defaults.headers.common['access_token'] = tokenObj.token;
						}else{
							$http.defaults.headers.common['access_token'] = undefined;
						}
					},

					post: function(attrs){

						$http({
							url: urls.apiHost + urls.apiPaths.auth,
							method: 'POST',
							data: attrs.data
						}).then(
							function(response){
								if(typeof attrs.success == 'function'){
									service.saveToken(response.data);
									attrs.success(response);
								}
							},
							function(response){
								if(typeof attrs.error == 'function'){
									attrs.error(response);
								}
							}
						);

					}

				};

				return service;

			});

})();


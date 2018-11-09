
'use strict';

(function(){

	angular.module('anaproApp').run(

		function(
			$rootScope,
			$location,
			$route,
			$timeout,
			path,
			authService,
			usersService,
			permission,
			toastrFactory,
			analyticsService
		){

			$rootScope['pathProvider'] = path;

			var setUserIsLogged = function(){
				$rootScope.isLogged = !!authService.token;
			};

			var viewRequireLogin = function(event, next, viewConfig){

				if(viewConfig){

					if(!$rootScope.isLogged && viewConfig.requireLogin){

						console.error('Access denied:', $location.$$path);
						event.preventDefault();
						$location.path(path.getPath('auth')).replace();
						console.groupEnd();

						return true;

					}else{

						console.info(
							'Route do not request user to be logged in',
							next
						);

						if($rootScope.isLogged && viewConfig.redirToDefaultWhenLoggedIn){
							console.info(
								'Ow! you are already authenticated, redirecting you to home: '
							);
							event.preventDefault();
							$location.path(path.getPath('home')).replace();
							console.groupEnd();

							return true;
						}

						return false;

					}

				}

				console.groupEnd();

				return false;

			};

			var checkProfileLoaded = function(event, next){

				if($rootScope.isLogged
					&&
					!usersService.isProfileLoaded()
				){
					console.warn(
						'$routeChangeStart on hold due to user profile is not loaded',
						next
					);
					// event.preventDefault();
					console.groupEnd();

					return true;
				}

				return false;
			};

			var checkPermissions = function(event, next, viewConfig){

				if($rootScope.isLogged){

					var hasUserViewPermission = true;
					var permissionDescription = '';

					if(viewConfig && viewConfig.configPath.permissions){

						hasUserViewPermission = permission.permissionStatus(
							viewConfig.configPath.permissions
						);

						permissionDescription = permission.getDescription(viewConfig.configPath.permissions)
							||
							viewConfig.configPath.permissionDescription
						;

						console.log(
							'request permission: ' + viewConfig.configPath.permissions
						);

					}else{
						console.log(
							'view do not requets any permission'
						);
					}

					console.log(
						'permission status: ' + hasUserViewPermission
					);

					if(hasUserViewPermission !== true){
						event.preventDefault();
						$location.path(path.getPath('home')).replace();
						console.groupEnd();

						if(hasUserViewPermission === false){
							toastrFactory.warn({
								title: 'Desculpe, você não tem permissão para '
									+ permissionDescription
							});
						}else{
							toastrFactory.error({
								title: 'Desculpe, a funcionalidade '
									+ permissionDescription + ' está momentaneamente desligada'
							});
						}

						return false;
					}

				}

				console.groupEnd();

				return true;

			};

			var isPathLogout = function(event){

				if((new RegExp('^(' + path.getPath('logout') + ')'))
					.test($location.$$path + '/')
				){
					event.preventDefault();

					$rootScope.$broadcast('logout', {
						config: {
							goToAnaproLogin: true
						}
					});

					return true;
				}

				return false;

			};

			var analyticsPageTrack = function(next){

				console.log(next);

				if(next.$$route && next.$$route.originalPath){
					analyticsService.pageTrack(next);
				}
			};

			//watch for route changes
			$rootScope.$on('$routeChangeStart', function(event, next){

				var viewConfig = next.$$route;

				console.group('Route Change Listener');

				analyticsPageTrack(next);

				if(next.$$route){
					console.log(next.$$route.originalPath);
				}

				if(isPathLogout(event)){
					return;
				}

				setUserIsLogged();

				if(viewRequireLogin(event, next, viewConfig)){
					return;
				}

				if(checkProfileLoaded(event, next)){
					return;
				}

				if(!checkPermissions(event, next, viewConfig)){
					return;
				}

				console.groupEnd();

			});

		});

})();

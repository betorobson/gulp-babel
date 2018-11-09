
'use strict';

(function(){

	angular.module('services.users', [])

		.factory(

			'usersService',

			function(
				$rootScope,
				$http,
				$timeout,
				urls,
				navigationBarFactory,
				permission,
				permissionsService
			){
				var callbacksWhenNotLoaded = [];

				var cache = null;
				var profileLoaded = false;

				var isProfileLoaded = function(registerCallbackWhenNotLoaded){

					if(!profileLoaded && typeof registerCallbackWhenNotLoaded == 'function'){
						callbacksWhenNotLoaded.push(registerCallbackWhenNotLoaded);
					}

					return profileLoaded;
				};

				$rootScope.isProfileLoaded = isProfileLoaded;

				var setNavigationBarLogo = function(){
					navigationBarFactory.logo.set({
						company: cache.data.extraInfo.contaSistemaNome
					});
				};

				var runRegisteredCallbacks = function(){

					if(callbacksWhenNotLoaded.length){
						callbacksWhenNotLoaded.map(function(func, index){
							if(typeof func == 'function'){
								var registeredFunction = func;
								callbacksWhenNotLoaded[index] = null;
								registeredFunction();
							}
						});
					}

					callbacksWhenNotLoaded = [];

				};

				var getUserProfileSuccess = function(attrs, response){

					profileLoaded = true;

					if(typeof attrs.success == 'function'){
						attrs.success(response);
					}

					runRegisteredCallbacks();

					setNavigationBarLogo();
				};

				var setUserPermissions = function(profile){
					if(profile.perfilUsuarioAdm){
						permission.setAdm();
					}else if(profile.perfilUsuarioKeys){
						permission.set(profile.perfilUsuarioKeys);
					}else{
						permission.set([]);
					}
				};

				var getAllPermissionsDescription = function(attrs, response){

					permissionsService.get({
						success: function(){
							cache = response;

							setUserPermissions(response
								.data
								.expand
								.userprofiles.fields.perfilUsuario
							);

							getUserProfileSuccess(attrs, response);

						}
					});

				};

				var clearCache = function(){
					profileLoaded = false;
					cache = null;
				};

				var getUserProfile = function(attrs){

					attrs = attrs || {};

					if(attrs.noCache){
						clearCache();
					}

					if(cache && !attrs.reload){
						getUserProfileSuccess(attrs, cache);

						return;
					}

					$http({
						url: urls.apiHost + urls.apiPaths.userProfile,
						method: 'GET',
						params: {
							'_embed': 'firebase,servicechannel',
						},
						goToAnaproLogin: attrs.goToAnaproLogin,
						toastrMessages: attrs.toastrMessages
					}).then(
						function(response){
							getAllPermissionsDescription(attrs, response);
						},
						function(response){
							if(typeof attrs.error == 'function'){
								attrs.error(response);
							}
						}
					);

				};

				var get = function(attrs){

					attrs = attrs || {};

					$http({
						url: urls.apiHost + urls.apiPaths.users + '/' + attrs.id,
						method: 'GET',
					}).then(
						function(response){
							if(typeof attrs.success == 'function'){
								attrs.success(response);
							}
						},
						function(response){
							if(typeof attrs.error == 'function'){
								attrs.error(response);
							}
						}
					);

				};

				var getMyUser = function(attrs){

					attrs = attrs || {};

					$http({
						url: urls.apiHost + urls.apiPaths.myUser,
						method: 'GET',
					}).then(
						function(response){
							if(typeof attrs.success == 'function'){
								attrs.success(response);
							}
						},
						function(response){
							if(typeof attrs.error == 'function'){
								attrs.error(response);
							}
						}
					);
				};

				var patch = function(attrs){

					attrs = attrs || {};

					$http({
						url: urls.apiHost + urls.apiPaths.users + '/' + attrs.id,
						method: 'PATCH',
						data: attrs.data
					}).then(
						function(response){
							if(typeof attrs.success == 'function'){
								attrs.success(response);
							}
						},
						function(response){
							if(typeof attrs.error == 'function'){
								attrs.error(response);
							}
						}
					);

				};

				var patchMyUser = function(attrs){

					attrs = attrs || {};

					$http({
						url: urls.apiHost + urls.apiPaths.myUser,
						method: 'PATCH',
						data: attrs.data
					}).then(
						function(response){
							if(typeof attrs.success == 'function'){
								attrs.success(response);
							}
						},
						function(response){
							if(typeof attrs.error == 'function'){
								attrs.error(response);
							}
						}
					);

				};

				var updateCurrentProfile = function(item){
					// angular.merge(cache.data.fields.usuario, item);
					cache.data.fields.usuario = item;
				};

				var isAdm = function(){
					return cache
						.data
						.expand
						.userprofiles
						.fields
						.perfilUsuario
						.perfilUsuarioAdm;
				};

				var service = {

					get: get,
					patch: patch,
					patchMyUser: patchMyUser,
					getUserProfile: getUserProfile,
					getMyUser: getMyUser,
					isProfileLoaded: isProfileLoaded,
					updateCurrentProfile: updateCurrentProfile,
					isAdm: isAdm,
					clearCache: clearCache

				};

				return service;

			});

})();

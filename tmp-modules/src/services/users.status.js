
'use strict';

(function(){

	angular.module('services.users.status', [])

		.factory(

			'usersStatusService',

			function(
				$http,
				$timeout,
				usersService,
				urls
			){

				var get = function(attrs){

					attrs = attrs || {};

					$http({
						url: urls.apiHost
							+ urls.apiPaths.users
							+ '/' + attrs.id
							+ urls.apiPaths.usersServiceChannel,
						method: 'GET'
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
						url: urls.apiHost
							+ urls.apiPaths.users
							+ '/' + attrs.id
							+ urls.apiPaths.usersServiceChannel,
						method: 'PATCH',
						data: {
							fields: attrs.data
						}
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

				var getCurrentUserProfileSuccess = function(attrs, response){

					if(response.data.embed.servicechannel){
						attrs.success({
							data: response.data.embed.servicechannel
						});
					}else{
						get({
							id: response.data.id,
							success: attrs.success,
							error: attrs.error
						});
					}

				};

				var getCurrentUserProfile = function(attrs){
					usersService.getUserProfile({
						success: function(response){
							getCurrentUserProfileSuccess(attrs, response);
						}
					});
				};

				var getCurrentUser = function(attrs){

					attrs = attrs || {};

					if(usersService.isProfileLoaded(function(){
						getCurrentUserProfile(attrs);
					})){
						getCurrentUserProfile(attrs);
					}

				};

				var patchCurrentUser = function(attrs){

					attrs = attrs || {};

					getCurrentUserProfile({
						success: function(response){
							patch({
								id: response.data.id,
								data: attrs.data,
								success: attrs.success,
								error: attrs.error
							});
						}
					});

				};

				var service = {
					get: get,
					patch: patch,
					getCurrentUser: getCurrentUser,
					patchCurrentUser: patchCurrentUser
				};

				return service;

			});

})();

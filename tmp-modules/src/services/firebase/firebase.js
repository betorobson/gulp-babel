
'use strict';

(function(){

	angular.module('services.firebase', [])

	.factory(
		'firebaseService',

		function(
			$rootScope,
			$timeout,
			$http,
			usersService,
			firebaseProvider,
			urls
		){

			var listeners = [];

			var firebaseInitSuccess = function(){
				listeners.map(function(listenerProvider){
					if(listenerProvider.start){
						listenerProvider.start();
					}
				});
			};

			var addListener = function(listenerProvider){
				listeners.push(listenerProvider);
			};

			var getTokenFromUserProfile = function(attrs){
				usersService.getUserProfile({
					success: function(response){

						var embedResouceFirebase = ((response.data.embed || {}).firebase);

						if(embedResouceFirebase){

							if(attrs.success){
								attrs.success(embedResouceFirebase);
							}

						}else if(attrs.error){
							attrs.error();
						}

					}
				});
			};

			var getTokenFromService = function(attrs){
				$http({
					url: urls.apiHost + urls.apiPaths.firebaseToken,
					method: 'GET'
				}).then(function(response){
					attrs.success(response);
				});
			};

			var getToken = function(attrs){

				if(attrs.fromUserProfile){
					getTokenFromUserProfile({
						success: function(embedResourceFirebase){
							if(embedResourceFirebase){
								attrs.success({
									data: embedResourceFirebase
								});
							}else{
								getTokenFromService({
									success: attrs.success
								});
							}
						},
						error: function(){
							getTokenFromService({
								success: attrs.success
							});
						}
					});
				}else{
					getTokenFromService({
						success: attrs.success
					});
				}

			};

			var init = function(){

				firebaseProvider.init({
					getToken: getToken,
					success: firebaseInitSuccess
				});

			};

			return {
				init: init,
				getToken: getToken,
				addListener: addListener
			};

		}
	);

})();

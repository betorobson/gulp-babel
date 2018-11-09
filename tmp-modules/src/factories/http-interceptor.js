
'use strict';

(function(){

	angular.module('factories.http-interceptor', [])

	.factory(

		'httpInterceptor',

		function(
			$q,
			$rootScope,
			$location,
			authCookieFactory,
			urls,
			errorMessage,
			defaultErrorMessages
		){

			var matchApiHost = new RegExp(urls.apiHost);

			var mergeFriendlyMessage = function(response, type){

				if(matchApiHost.test(response.config.url)){

					var friendlyMessageObj = {};

					response.data = response.data || {};

					friendlyMessageObj[type] = response.data.friendlyMessage || {};

					// normalize
					angular.merge(
						response.config,
						{
							toastrMessages: {}
						}
					);

					if(response.config.toastrMessages[type] !== null){
						angular.merge(
							response.config,
							response.data.friendlyMessage
								? {toastrMessages: friendlyMessageObj}
								: {}
						);
					}

					delete response.data.friendlyMessage;

					dispatchToastrBroadcast(response,type);
					setResponseConfigErrorMessage(response, type);

				}

			};

			var dispatchToastrBroadcast = function(response, type){

				if(
					(
						type != 'success'
						&&
						response.config.toastrMessages[type] !== null
						&&
						!(response.config.toastrMessages[type] || {}).onlyErrorMessage
					)
					||
					type == 'success' && response.config.toastrMessages.success
				){
					$rootScope.$broadcast(
						'factories.toastr.' + type,
						response
					);
				}

			};

			var setResponseConfigErrorMessage = function(response, type){

				if(type != 'success'){

					var errorMessage = angular.merge(
						defaultErrorMessages[type] || {},
						response.config.toastrMessages[type] || {}
					);

					response.config.errorMessage = errorMessage;
				}

			};

			return {

				request: function(config){

					if(matchApiHost.test(config.url)){

						var hasCookieChangedToOtherUser = authCookieFactory.checkCookie();

						if(hasCookieChangedToOtherUser){
							return $q.reject(config);
						}

					}

					return config;
				},

				response: function(response){

					mergeFriendlyMessage(response, 'success');

					return response;
				},

				responseError: function(response){

					console.log('http-interceptor.responseError');
					console.log(response);

					var errorType = errorMessage.getErrorType(response.status);

					if(response.status == 401){

						$rootScope.$broadcast(
							'requestUserAuthentication',
							response
						);

					}else{

						mergeFriendlyMessage(response, errorType);

					}

					return $q.reject(response);
				}

			};

		}
	);

})();


'use strict';

(function(){

	angular.module('services.longpolling', [
		'services.longpolling.cacheFactory'
	])

			.factory(
				'longpollingService',

				function(
					$rootScope,
					$timeout,
					urls,
					path,
					CacheFactory,
					longpollingTimer,
					authService,
					authCookieFactory
				){

					var cache = CacheFactory.get('longpolling');

					var timer;

					var hasStarted = false;

					var setTimer = function(){
						stop();
						timer =	setTimeout(ping, longpollingTimer);
					};

					var stop = function(){
						hasStarted = false;
						clearTimeout(timer);
					};

					var init = function(){
						if(!hasStarted){
							ping();
						}
					};

					var success = function(	){
						authCookieFactory.checkCookie();
						setTimer();
					};

					var error = function(response){

						if(response.status == 401){

							var payloadErrorMessage = {
								title: 'Acesso encerrado!'
							};

							var friendlyMessageHeader =
								decodeURIComponent(response.getResponseHeader('friendlyMessage'))
								.replace(/\+/g,' ');

							if(friendlyMessageHeader){
								payloadErrorMessage['message'] = friendlyMessageHeader;
							}

							$rootScope.$broadcast('requestUserAuthentication', {
								config: {
									toastrMessages: {
										payloadError: payloadErrorMessage
									}
								}
							});
						}else{
							setTimer();
						}
					};

					window.error401 = error;

					var canPing = function(){

						if(navigator.onLine === false){
							return false;
						}

						var lastPing = cache.get('lastPing') || 0;

						return ((new Date()).getTime() - lastPing) >= longpollingTimer;
					};

					var ping = function(){
						hasStarted = true;

						if(!canPing()){
							success();

							return;
						}

						cache.put('lastPing', (new Date().getTime()));

						if(authService.token){

							var headers = {
								'access_token': authService.token.token
							};

							if(urls.ocpApimSubscriptionKey){
								headers['Ocp-Apim-Subscription-Key'] = urls.ocpApimSubscriptionKey;
							}

							// using jQuery ajax in order to prevent memory leak
							$.ajax({
								url : urls.apiHost + urls.apiPaths.legacyLongPollingPresence,
								method: 'HEAD',
								headers: headers
							}).then(
								success,
								error
							);

						}else{
							error();
						}

					};

					$rootScope.$on('tokenCookieHasBeenChanged', function(){
						console.log('services.longpolling.$on.tokenCookieHasBeenChanged');
						init();
					});

					// Token Cookie Has Been Changed But User is the same
					$rootScope.$on('tokenCookieHasBeenChangedButUserIsTheSame', function(){
						console.log('services.longpolling.$on.tokenCookieHasBeenChangedButUserIsTheSame');
						init();
					});

					return {
						stop: stop,
						init: init
					};
				}
			);
})();


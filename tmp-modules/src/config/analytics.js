
'use strict';

(function(){

	angular.module('config.analytics', [
		'angulartics',
		'angulartics.google.tagmanager'
	])

	.config(

		function(
			$analyticsProvider
		){

			$analyticsProvider.virtualPageviews(false);

			// [todo] cordova google analytics plugin
			// if(window.cordova){
			// 	googleAnalyticsCordovaProvider.trackingId = GATrackingIdsProvider.id;
			// 	googleAnalyticsCordovaProvider.period = 10;
			// 	googleAnalyticsCordovaProvider.debug = false;
			// }

		}
	)

	.factory(
		'analyticsService',
		function(
			$location,
			$analytics,
			usersService
		){

			var setUsername = function(){
				usersService.getUserProfile({
					success: function(response){
						$analytics.setUsername(response.data.fields.usuario.usuarioIdGuid);
					}
				});
			};

			var pageTrack = function(next){

				next = angular.merge(
					next || {},
					{
						$$route: {
							configPath:{}
						}
					}
				);

				if(next.$$route.configPath.getPageTrack){
					$analytics.pageTrack(next.$$route.configPath.getPageTrack(next));
				}else{
					$analytics.pageTrack($location.path());
				}

			};

			return {
				pageTrack: pageTrack,
				setUsername: setUsername
			};

		}
	)

	;

})();



'use strict';

(function(){
	angular.module('services.longpolling')

			.constant('longpollingTimer', 2000)

			.run(function(
				longpollingService,
				usersService
			){

				var init = function(){
					longpollingService.init();
				};

				if(usersService.isProfileLoaded(init)){
					init();
				}

			});

	angular.module('services.longpolling.cacheFactory', [])

			.run(function(CacheFactory){

				CacheFactory(
					'longpolling',
					{
						storagePrefix: 'AnaproAPP-Caches.',
						storageMode: 'localStorage'
					}
				);
			});
})();

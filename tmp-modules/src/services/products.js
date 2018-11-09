
'use strict';

(function(){

	angular.module('services.products',[])

	// .run(function(CacheFactory){
	// 	CacheFactory(
	// 		'cachefollowupService',
	// 		{
	// 			storagePrefix: 'AnaproAPP-Caches.',
	// 			storageMode: 'localStorage'
	// 		}
	// 	);
	// })

	.factory(

		'productsService',

		function(
			$http,
			// CacheFactory,
			urls
		){

			// var cache = CacheFactory.get('cachefollowupService');
			// cache.removeAll();

			// var saveCacheFollowup = function(response){
			// 	cache.put('followupSubTypes', response);
			// };

			var get = function(attrs){

				$http({
					url: urls.apiHost
						+ urls.apiPaths.products,
					method: 'GET',
					params: {
						atendimentoIdGuid: attrs.item.id
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

			var factory = {
				get: get
			};

			return factory;
		}
	);

})();

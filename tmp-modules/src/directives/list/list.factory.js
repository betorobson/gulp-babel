
'use strict';

(function(){

	angular.module('directives.list.factory', [])

		.run(function(CacheFactory){

			CacheFactory(
				'cacheLinks',
				{
					storagePrefix: 'AnaproAPP-Caches.',
					storageMode: 'localStorage',
					capacity: 100
				}
			);

		})

		.factory('listFactory',

			function(
				CacheFactory
			){

				var cacheLinks = CacheFactory.get('cacheLinks');

				var saveAttrsAndGetHashLink = function(attrs){

					var hash = 0;
					var stringAttrs = {};

					try{
						stringAttrs = JSON.stringify(attrs);
					}catch(e){}

					for(var i=0; i<stringAttrs.length; i++){
						hash = ((hash << 5) - hash) + stringAttrs.charCodeAt(i);
					}

					hash = hash.toString(36);

					if(!cacheLinks.get(hash)){
						cacheLinks.put(hash, attrs);
					}

					return hash;

				};

				var getAttrsFromHash = function(hash){
					return cacheLinks.get(hash);
				};

				var getAttrsFromRouteParams = function(routeParams){

					if(routeParams.hash){
						return getAttrsFromHash(routeParams.hash) || {};
					}else if(routeParams.q){
						return {
							params: {
								q: routeParams.q
							}
						};
					}else{
						return {};
					}

				};

				var service = {
					saveAttrsAndGetHashLink: saveAttrsAndGetHashLink,
					getAttrsFromRouteParams: getAttrsFromRouteParams
				};

				return service;

			}
		);

})();

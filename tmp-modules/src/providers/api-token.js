
'use strict';

(function(){

	angular.module('provider.apiToken', [])

		.run(function(CacheFactory){

			CacheFactory(
				'token',
				{
					storagePrefix: 'AnaproAPP-Caches.',
					storageMode: 'localStorage'
				}
			);

		})

		.provider('apiToken', function(){

			this.$get = function(CacheFactory){

				this.getCache = function(){
					return CacheFactory.get('token');
				};

				return this;
			};

		})

	;

})();

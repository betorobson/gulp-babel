
'use strict';

(function(){

	angular.module('services.utils', [
		'services.utils-states'
	])

		.run(function(CacheFactory){

			CacheFactory(
				'cacheUtils',
				{
					storagePrefix: 'AnaproAPP-Caches.',
					storageMode: 'localStorage'
				}
			);

		})

		.factory(

			'utilsService',

			function(
				$http,
				$timeout,
				CacheFactory,
				urls
			){

				var cache = CacheFactory.get('cacheUtils');

				var getOccupations = function(attrs){

					var cacheOccupations = cache.get('occupations');

					if(cacheOccupations){

						if(typeof attrs.success == 'function'){
							attrs.success(cacheOccupations);
						}

						return;
					}

					$http({
						url: urls.apiHost + urls.apiPaths.utilsOccupations,
						method: 'GET'
					}).then(
						function(response){

							cache.put('occupations', response);

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

				var getStates = function(attrs){

					var cacheStates = cache.get('states');

					if(cacheStates){

						if(typeof attrs.success == 'function'){
							attrs.success(cacheStates);
						}

						return;
					}

					$http({
						url: urls.apiHost
						+ urls.apiPaths.utilsLocation.base
						+ urls.apiPaths.utilsLocation.states,
						method: 'GET'
					}).then(
						function(response){

							cache.put('states', response);

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

				var getCities = function(attrs){

					var cacheCities = cache.get(attrs.params.state + '/cities');

					if(cacheCities){

						if(typeof attrs.success == 'function'){
							attrs.success(cacheCities);
						}

						return;
					}

					$http({
						url: urls.apiHost
							+ urls.apiPaths.utilsLocation.base
							+ urls.apiPaths.utilsLocation.states
							+ '/' + attrs.params.state
							+ urls.apiPaths.utilsLocation.cities,
						method: 'GET'
					}).then(
						function(response){

							cache.put(attrs.params.state + '/cities', response);

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

				var getNeighborhoods = function(attrs){

					var cacheNeighborhoods = cache.get(attrs.params.idCity + '/neighborhoods');

					if(cacheNeighborhoods){

						if(typeof attrs.success == 'function'){
							attrs.success(cacheNeighborhoods);
						}

						return;
					}

					$http({
						url: urls.apiHost
							+ urls.apiPaths.utilsLocation.base
							+ urls.apiPaths.utilsLocation.cities
							+ '/' + attrs.params.idCity
							+ urls.apiPaths.utilsLocation.neighborhoods,
						method: 'GET'
					}).then(
						function(response){

							cache.put(attrs.params.idCity + '/neighborhoods', response);

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

				var service = {

					getOccupations: getOccupations,
					getStates: getStates,
					getCities: getCities,
					getNeighborhoods: getNeighborhoods

				};

				return service;

			});

})();

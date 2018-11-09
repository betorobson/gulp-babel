
'use strict';

(function(){

	angular.module('services.pending-processing', [])

	.factory(
		'pendingProcessingService',

		function(
			$rootScope,
			$http,
			urls,
			firebaseBroadcastsNames,
			notificationCenterFactory,
			firebaseCollections
		){

			var
				lastTick,
				itemsIdByType = {
					pendingProcessingTransactionWaitingAttend: 'pendingProcessingHashKey'
				};

			var normalizeDataItemsIds = function(data){
				Object.keys(data).map(function(key){
					if(data[key].constructor.name == 'Array' && itemsIdByType[key]){
						data[key].map(function(item){
							item.id = item[itemsIdByType[key]];
						});
					}
				});
			};

			// var createEmptyArrayForTypesWhenUndefined = function(data){
			// 	Object.keys(itemsIdByType).map(function(type){
			// 		data[type] = data[type] || [];
			// 	});
			// };

			var getSuccess = function(response){

				start = response.data.id;

				var data = response.data.fields || {};

				normalizeDataItemsIds(data);

				// createEmptyArrayForTypesWhenUndefined(data);

				notificationCenterFactory.dispatch(
					firebaseCollections.pendingProcessing,
					data
				);

			};

			var start = 0;

			var get = function(data){

				if(data && typeof data.ticks != 'undefined'){

					$http({
						url: urls.apiHost + urls.apiPaths.servicesPendingprocessing,
						method: 'GET',
						params: {
							start: start,
							end: data.ticks
						}
					}).then(
						getSuccess,
						function(response){
							console.error(response);
						}
					);

				}

			};

			var init = function(){

				$rootScope.$on(
					firebaseBroadcastsNames.pendenciaprocessamento,

					function(
						event,
						data
					){

						var dataCopied = angular.copy(data);

						data = data || {};
						data = angular.merge({ticks: 0}, data);

						if(lastTick != data.ticks){

							lastTick = data.ticks;

							console.log(
								'listener ' + firebaseBroadcastsNames.pendenciaprocessamento + ':',
								dataCopied,
								data
							);
							get(data);

						}else{

							console.warn(
								'listener ' + firebaseBroadcastsNames.pendenciaprocessamento + ' same last ticks ignored: ',
								dataCopied,
								data
							);

						}

					}

				);

			};

			var setEmptyTransactionsAwaiting = function(){

				notificationCenterFactory.dispatch(
					firebaseCollections.pendingProcessing,
					{
						pendingProcessingTransactionWaitingAttend: []
					}
				);

			};

			return {
				get: get,
				setEmptyTransactionsAwaiting: setEmptyTransactionsAwaiting,
				init: init
			};

		}
	);

})();

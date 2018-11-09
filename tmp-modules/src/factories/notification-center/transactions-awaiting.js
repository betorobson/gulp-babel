
'use strict';

(function(){

	angular.module('factories.notification-center.transactions-awaiting',[
		'factories.favico'
	])

	.run(function(
		notificationCenterFactory,
		notificationCenterTransactionsAwaiting,
		firebaseCollections
	){

		notificationCenterFactory.registerToGetNotifications({
			collection: [
				firebaseCollections.pendingProcessing,
				firebaseCollections.chat
			],
			service: notificationCenterTransactionsAwaiting,
			types: [
				'pendingProcessingTransactionWaitingAttend',
				firebaseCollections.chat
			]
		});

	})

	.factory(
		'notificationCenterTransactionsAwaiting',

		function(
			firebaseCollections,
			favicoFactory
		){

			var data = {
				pendingProcessingTransactionWaitingAttend: [],
			};
			data[firebaseCollections.chat] = [];

			var dispatch = function(collectionKeys){

				console.log([
					'notificationCenterTransactionsAwaiting.dispatch('
					+ Object.keys(collectionKeys).join(',')
					+ ')',
					angular.copy(collectionKeys)
				]);

				Object.assign(data, collectionKeys);

				setFavico();

			};

			var removeByAttribute = function(attrs){

				Object.keys(data).map(function(collectionKey){
					data[collectionKey] = data[collectionKey].filter(function(item){
						return item[attrs.attribute] != attrs.value;
					});
				});

				setFavico();

			};

			var removeById = function(id){

				Object.keys(data).map(function(collectionKey){
					data[collectionKey] = data[collectionKey].filter(function(item){
						return item.id != id;
					});
				});

				setFavico();

			};

			var setFavico = function(){
				favicoFactory.set({
					chat: data[firebaseCollections.chat].length,
					clients: data.pendingProcessingTransactionWaitingAttend.length
				});
			};

			var getTotalNewClients = function(){
				return data.pendingProcessingTransactionWaitingAttend.length;
			};

			var getTotalChats = function(){
				return data[firebaseCollections.chat].length;
			};

			return {
				dispatch: dispatch,
				removeByAttribute: removeByAttribute,
				removeById: removeById,
				getTotalNewClients: getTotalNewClients,
				getTotalChats: getTotalChats
			};
		}
	);

})();

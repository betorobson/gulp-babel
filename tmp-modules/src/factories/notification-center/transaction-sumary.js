
'use strict';

(function(){

	angular.module('factories.notification-center.transactionSumary',[])

	.run(function(
		notificationCenterFactory,
		notificationCenterTransactionSumary,
		firebaseCollections
	){

		notificationCenterFactory.registerToGetNotifications({
			collection: [
				firebaseCollections.pendingProcessing
			],
			service: notificationCenterTransactionSumary,
			types: [
				'pendingProcessingTransactionsSummary'
			]
		});

	})

	.factory(
		'notificationCenterTransactionSumary',

		function(
			
		){
			var callbacks = [];
			var result;
			
			var dispatch = function(data){
					console.log([
						'factories.notification-center.notificationCenterTransactionSumary.dispatch()',
						angular.copy(data)
					]);					
					result = data.pendingProcessingTransactionsSummary;
					runCallbacks();

				},
				
				dispatchCallback = function(attrs){
					
					var found = callbacks.indexOf(attrs);

					if(found < 0){
						callbacks.push(attrs);
					}

					if(result){
						attrs.success(result);
					}
				},

				runCallbacks = function(){
					callbacks = callbacks.filter(function(callback){
						return typeof callback.success == 'function';
					});
					
					callbacks.map(function(callback){
						callback.success(result);
					});
				},

				factory = {
					dispatch: dispatch,
					dispatchCallback: dispatchCallback
				};

			return factory;
		}
	);

})();

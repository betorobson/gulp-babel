
'use strict';

(function(){

	angular.module('services.firebase')

	.factory(
		'firebaseListenerQueuesChannel',
		function(
			$rootScope,
			firebaseProvider,
			firebaseCollections
		){

			var getListener = function(attrs){

				return firebaseProvider
				.getFirestoreDB()
				.collection(firebaseCollections.queuesChannel[attrs.channel])
				.doc(attrs.id)
				.onSnapshot(function(doc){

					var data = doc.data();

					if(data){

						console.log([
							'firebaseListenerQueuesChannel.getListenerOnSnapShort()',
							attrs,
							angular.copy(data)
						]);

						data.collection = firebaseCollections.queuesChannel[attrs.channel];
						data.channel = attrs.channel;

						if(typeof attrs.success == 'function'){
							attrs.success(data);
						}

					}else{

						if(typeof attrs.error == 'function'){
							attrs.error({});
						}

					}

					$rootScope.$digest();

				});

			};

			return {
				getListener: getListener
			};

		}
	);

})();

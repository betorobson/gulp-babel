
'use strict';

(function(){

	angular.module('services.firebase')

	.run(function(
		firebaseService,
		firebaseListenerPendenciaProcessamento
	){

		firebaseService.addListener(firebaseListenerPendenciaProcessamento);

	})

	.provider(
		'firebaseListenerPendenciaProcessamento',
		function(){

			var self = this;

			self.$get = function(
				$rootScope,
				firebaseProvider,
				firebaseBroadcastsNames,
				firebaseCollections
			){

				var start = function(){

					firebaseProvider
					.getFirestoreDB()
					.collection(firebaseCollections.pendingProcessing)
					.doc(firebaseProvider.getCurrentUser().uid)
					.onSnapshot(function(doc){
						$rootScope.$broadcast(
							firebaseBroadcastsNames.pendenciaprocessamento,
							doc.data()
						);
					});

				};

				self.start = start;

				return self;

			};

		}
	);

})();

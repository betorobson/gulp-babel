
'use strict';

(function(){

	angular.module('services.firebase')

	.run(function(
		firebaseService,
		firebaseListenerChatLegacy
	){

		firebaseService.addListener(firebaseListenerChatLegacy);

	})

	.provider(
		'firebaseListenerChatLegacy',
		function(){

			var self = this;

			self.$get = function(
				$rootScope,
				firebaseProvider,
				firebaseBroadcastsNames,
				firebaseCollections,
				firebaseCollectionsItemId,
				notificationCenterFactory
			){

				var onSnapshot = function(snapshot){

					var chats = [];

					snapshot.forEach(function(doc){

						var data = doc.data();
						data.id = data[firebaseCollectionsItemId.chat];

						chats.push(data);

					});

					notificationCenterFactory.dispatch(
						firebaseCollections.chat,
						chats
					);

					$rootScope.$digest();

				};

				var start = function(){

					firebaseProvider
					.getFirestoreDB()
					.collection(firebaseCollections.chat)
					.where('UsuarioIdGuid', '==', firebaseProvider.getCurrentUser().uid)
					.where('ChatStatus', '==', 'Criado')
					.onSnapshot(onSnapshot);

				};

				self.start = start;

				return self;

			};

		}
	);

})();

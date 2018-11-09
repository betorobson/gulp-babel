
'use strict';

(function(){

	angular.module('services.firebase')

	.run(function(
		firebaseService,
		firebaseListenerPositionInQueues
	){

		firebaseService.addListener(firebaseListenerPositionInQueues);

	})

	.provider(
		'firebaseListenerPositionInQueues',
		function(){

			var self = this;

			self.$get = function(
				$rootScope,
				notificationCenterFactory,
				firebaseProvider,
				firebaseBroadcastsNames,
				firebaseCollections,
				usersService
			){

				var onSnapshot = function(doc){
					notificationCenterFactory.dispatch(
						firebaseCollections.queuesChannelChatByUser,
						doc.data() || {}
					);
				};

				var getUserProfile = function(){

					usersService.getUserProfile({
						success: function(response){
							startFirebaseCollectionSnapshot({
								usuarioIdGuid: response.data.fields.usuario.usuarioIdGuid,
								contaSistemaIdGuid: response.data.extraInfo.contaSistemaIdGuid
							});
						}
					});

				};

				var startFirebaseCollectionSnapshot = function(attrs){

					console.log([
						'firebaseListenerPositionInQueues.startFirebaseCollectionSnapshot',
						attrs,
						'/' + firebaseCollections.queuesChannelChatByUser
						+ '/' + attrs.contaSistemaIdGuid + ':' + attrs.usuarioIdGuid
					]);

					firebaseProvider
					.getFirestoreDB()
					.collection(firebaseCollections.queuesChannelChatByUser)
					.doc(attrs.contaSistemaIdGuid + ':' + attrs.usuarioIdGuid)
					.onSnapshot(onSnapshot);

				};

				var start = function(){

					getUserProfile();

				};

				self.start = start;

				return self;

			};

		}
	);

})();

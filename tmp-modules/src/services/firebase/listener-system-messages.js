
'use strict';

(function(){

	angular.module('services.firebase')

	.run(function(
		firebaseService,
		firebaseListenerSystemMessages
	){

		firebaseService.addListener(firebaseListenerSystemMessages);

	})

	.provider(
		'firebaseListenerSystemMessages',
		function(){

			var self = this;

			self.$get = function(
				$rootScope,
				firebaseProvider,
				firebaseBroadcastsNames,
				firebaseCollections,
				notificationCenterFactory,
				usersService
			){

				var contaSistemaIdGuid;

				var getUserDocumentPath = function(){
					return firebaseCollections.systemMessages
					+ '/'
					+ contaSistemaIdGuid
					+ ':'
					+ firebaseProvider.getCurrentUser().uid;
				};

				var setMessageRead = function(id){
					firebaseProvider
						.getFirestoreDB()
						.doc(getUserDocumentPath(contaSistemaIdGuid))
						.collection('messages')
						.doc(id)
						.set({
							unread: false
						},
						{
							merge: true
						});
				};

				var startFirebaseCollection = function(){

					if(contaSistemaIdGuid){

						console.log(contaSistemaIdGuid + ':' + firebaseProvider.getCurrentUser().uid);

						firebaseProvider
							.getFirestoreDB()
							.doc(getUserDocumentPath(contaSistemaIdGuid))
							.collection('messages')
							.where('unread', '==', true)
							.onSnapshot(function(snapshot){

								var newMessages = [];

								snapshot.docChanges.forEach(function(change){
									if(change.type == 'added'){

										var data = change.doc.data();

										if(!data.id){
											data.id = change.doc.id;
										}

										data.onTap = function(){
											setMessageRead(data.id);
										};

										data.onHidden = function(){
											setMessageRead(data.id);
										};

										newMessages.push(data);
									}
								});

								notificationCenterFactory.dispatch(
									firebaseCollections.systemMessages,
									{
										systemMessages: newMessages
									}
								);

							});
					}
				};

				var start = function(){

					usersService.getUserProfile({
						success: function(response){
							contaSistemaIdGuid = response.data.extraInfo.contaSistemaIdGuid;
							startFirebaseCollection();
						}
					});

				};

				self.start = start;

				return self;

			};

		}
	);

})();

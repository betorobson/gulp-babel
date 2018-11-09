'use strict';

(function(){

	angular.module('services.firebase')

	.constant('firebaseConfig', {
		apiKey: 'AIzaSyAEPm3MNQtwK1dejcNkYDhrLcf4YiSOrpo',
		authDomain: 'anaprobr-e469e.firebaseapp.com',
		databaseURL: 'https://anaprobr-e469e.firebaseio.com',
		projectId: 'anaprobr-e469e',
		storageBucket: 'anaprobr-e469e.appspot.com',
		messagingSenderId: '297244363461'
	})

	.constant('firebaseCollections', {
		pendingProcessing: 'pendenciaprocessamento',
		systemMessages: 'system-messages',
		chat: 'chatlegacy',
		queuesChannelChatByUser: 'queuesChannelChatByUser',
		queuesChannel: {
			chat: 'queuesChannelChat'
		}
	})

	.constant('firebaseCollectionsItemId', {
		chat: 'ChatIdGuid'
	})

	.constant('firebaseBroadcastsNames', {
		pendenciaprocessamento: 'firebaseService.pendenciaprocessamento',
		systemMessages: 'firebaseService.systemMessages',
		chat: 'firebaseService.chat',
		queuesChannelChatByUser: 'firebaseService.queuesChannelChatByUser'
	})

	.run(
		function(
			firebaseConfig,
			firebaseProvider
		){

			firebase.initializeApp(firebaseConfig);

			firebaseProvider.setFirestoreDB();

		}
	)

	;

})();

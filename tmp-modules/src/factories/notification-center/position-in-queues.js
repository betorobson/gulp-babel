
'use strict';

(function(){

	angular.module('factories.notification-center.position-in-queues',[])

	.run(function(
		notificationCenterFactory,
		notificationCenterPositionInQueues,
		firebaseCollections
	){

		notificationCenterFactory.registerToGetNotifications({
			collection: [
				firebaseCollections.queuesChannelChatByUser
			],
			service: notificationCenterPositionInQueues,
			types: [
				firebaseCollections.queuesChannelChatByUser
			]
		});

	})

	.factory(
		'notificationCenterPositionInQueues',

		function(
			$rootScope,
			$timeout,
			userStatusFactory,
			permission
		){

			var channelsKey = {
				queuesChannelChatByUser: 'channelChat',
				queuesChannelPhoneByUser: 'channelPhone',
				queuesChannelOthersByUser: 'channelOthers'
			};

			var queues = [];
			var callbacks = [];

			var setQueues = function(data){

				queues.splice(0, queues.length);

				if(data){
					Object.keys(data).map(function(key){

						var channelName = userStatusFactory.getChannelsByKey(key);
						var channelQueue = data[key].Campanhas;
						var channelProperties = userStatusFactory.getChannelProperties(channelName) || {};

						if(
							!channelProperties.permissionPositionInQueue
							||
							channelProperties.permissionPositionInQueue
							&&
							permission.checkPermissions(channelProperties.permissionPositionInQueue)
							&&
							channelQueue
						){

							queues.push({
								channelProperties: channelProperties,
								queues: channelQueue
							});

						}

					});
				}

				setPositionToChannelWhenHasOnlyOne();

			};

			var setNextPositionInQueues = function(){

				queues.map(function(channel){

					var position = null;

					angular.merge(channel, {queues:[]});

					channel.queues.map(function(campaign){
						angular.merge(campaign, {Canais:[]});
						campaign.Canais.map(function(campaignChannel){

							angular.merge(campaignChannel, {Posicao: {}});

							if(
								typeof campaignChannel.Posicao.Ordem == 'number'
								&&
								(
									campaignChannel.Posicao.Ordem < position
									||
									position === null
								)

							){
								position = campaignChannel.Posicao.Ordem;
							}

						});
					});

					channel.nextPositionInQueues = position;

					userStatusFactory.setNextPositionInQueues(
						channel.channelProperties.channel,
						position
					);

				});

			};

			var setPositionToChannelWhenHasOnlyOne = function(){

				queues.map(function(item){
					if(
						item.queues
						&&
						item.queues.length == 1
						&&
						item.queues[0].Canais.length == 1
					){
						item.campaignChannel = item.queues[0].Canais[0];
					}
				});

			};

			var dispatch = function(data){

					var dataCopied = angular.copy(data);

					var dataFormatted = {};

					Object.keys(data).map(function(channelQueuesKey){

						userStatusFactory.setNextPositionInQueues(
							userStatusFactory.getChannelsByKey(channelsKey[channelQueuesKey]),
							null
						);

						dataFormatted[channelsKey[channelQueuesKey]] = data[channelQueuesKey];

					});

					setQueues(dataFormatted);
					setNextPositionInQueues();

					console.log([
						'factories.notification-center.notificationCenterPositionInQueues.dispatch()',
						dataCopied,
						queues
					]);

					runCallbacks();

					$rootScope.$digest();

				},

				dispatchCallback = function(attrs){

					var found = callbacks.indexOf(attrs);

					if(found < 0){
						callbacks.push(attrs);
					}

					if(attrs.success){
						attrs.success(queues);
					}
				},

				runCallbacks = function(){
					callbacks = callbacks.filter(function(callback){
						return typeof callback.success == 'function';
					});

					callbacks.map(function(callback){
						callback.success(queues);
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


'use strict';

(function(){

	angular.module('factories.notification-center.dialogs',[])

	.run(function(
		notificationCenterFactory,
		notificationCenterDialogs,
		notificationsContainerDialog,
		firebaseCollections
	){

		var types = [];

		notificationsContainerDialog.getDialogTypesByPriority().map(function(item){
			types.push(item.collectionKey);
		});

		notificationCenterFactory.registerToGetNotifications({
			collection: [
				firebaseCollections.pendingProcessing,
				firebaseCollections.chat
			],
			service: notificationCenterDialogs,
			types: types
		});

	})

	.factory(
		'notificationCenterDialogs',

		function(
			$rootScope,
			$location,
			CacheFactory,
			path,
			$timeout,
			audioFactory,
			firebaseCollections,
			notificationsContainerDialog,
			userStatusFactory,
			desktopNotificationsFactory,
			userStatusBroadcastName
		){

			var cache = CacheFactory(
				'dispatchedDialogsNotifications',
				{
					storagePrefix: 'AnaproAPP-Caches.',
					storageMode: 'localStorage'
				}
			);

			var
				newDialog = notificationsContainerDialog.put,
				dialogTypesByPriority = notificationsContainerDialog.getDialogTypesByPriority(),
				dispatchedNotifications = cache.get('doNotShowIdsAgain') || [], // only ids
				removedNotificationsByAttributeWaitingForDispatch = [],
				activedDialogs = {}, // grouped by type
				delayFurtherSameTypeNotificationsDuration = 2 * 60 * 1000, // 2 minutes
				delayFurtherSameTypeNotificationsPromisse,
				dataHoldingByUserStatusOffline = {},

				dataHoldingByChannelStatusCollectionType = {
					// others: [
					// 	'pendingProcessingTransactionWaitingAttend'
					// ]
				},

				desktopNotificationAttrsByType = {
					newLead: {
						title: 'Novo cliente',
						body: 'prospectNome',
						icon: 'prospectUrlImagem',
						onclick: function(){

							audioFactory.play('system');

							$rootScope.mainController.go(path.get('transaction').withItem({
								id: this.atendimentoIdGuid
							}));

						}
					},
					newChat: {
						title: 'Novo chat',
						body: 'ProspectNome',
						icon: 'ProspectUrlImagem',
						onclick: function(){

							audioFactory.play('system');

							window.open(
								'//'
									+ this.Href,
								'_blank'
							);

						}
					}
				};

			var cleanUpActivedDialogs = function(){
				// removed empty objects
				Object.keys(activedDialogs).map(function(key){
					activedDialogs[key] = activedDialogs[key].filter(function(item){
						return !!item.data;
					});
				});
			};

			dialogTypesByPriority.map(function(item){
				activedDialogs[item.type] = [];
			});

			var removeWaitingNotificationsRemovedByAttribute = function(data){

				removedNotificationsByAttributeWaitingForDispatch.map(function(notification){

					Object.keys(data).map(function(collectionKey){
						data[collectionKey] = data[collectionKey].filter(function(dataItem){
							if(dataItem[notification.data.attribute] != notification.data.value){

								return true;

							}else{

								var indexOf = removedNotificationsByAttributeWaitingForDispatch
									.indexOf(notification);

								if(indexOf >= 0){

									console.log([
										'factories.notification-center.dialogs.removeWaitingNotificationsRemovedByAttribute()',
										angular.copy({
											dataItem: dataItem,
											notification: notification
										})
									]);

									removedNotificationsByAttributeWaitingForDispatch
										.splice(indexOf, 1);
								}

								setDoNotShowAgain(dataItem.id, notification.doNotShowAgain);

								return false;

							}
						});
					});

				});

			};

			// remove notifications from pendingProcessing that has been already dispatched
			var cleanUpData = function(data){

				removeWaitingNotificationsRemovedByAttribute(data);

				Object.keys(data).map(function(collectionKey){
					data[collectionKey] = data[collectionKey].filter(function(dataItem){
						return dispatchedNotifications.indexOf(dataItem.id) == -1;
					});
				});

			};

			var dispatchDesktopNotification = function(dialog){

				if(!document.hasFocus()){

					var data = dialog.data;
					var dialogType = notificationsContainerDialog.getDialogType(data.type);
					dialogType.desktopNotification = dialogType.desktopNotification || {};

					dialog.desktopNotification = desktopNotificationsFactory.send({
						tag: data.id,
						title: desktopNotificationAttrsByType[data.type].title,
						body: data[desktopNotificationAttrsByType[data.type].body],
						icon:
							dialogType.desktopNotification.icon
							||
							data[desktopNotificationAttrsByType[data.type].icon],
						requireInteraction: true,
						renotify: true,
						callback: desktopNotificationAttrsByType[data.type].onclick.bind(data)
					});

				}

			};

			var dispatchNewDialogNotification = function(nextNotification){
				if(nextNotification){

					var dialogObj = newDialog(
						angular.merge(
							{
								type: nextNotification.dialogTypeObj.type
							},
							nextNotification.notification
						)
					);

					activedDialogs[nextNotification.dialogTypeObj.type].push(dialogObj);

					dispatchDesktopNotification(dialogObj);

					dispatchedNotifications.push(dialogObj.data.id);

				}
			};

			var selectNextGroupTypeNotificationsByPriority = function(data){

				var nextGroupTypeNotificationsByPriority;

				for(var i=0; i<dialogTypesByPriority.length; i++){

					var dialogTypeObj = dialogTypesByPriority[i];

					if(dialogTypeObj.collectionKey
						&& data[dialogTypeObj.collectionKey]
						&& data[dialogTypeObj.collectionKey].length
					){
						nextGroupTypeNotificationsByPriority = {
							dialogTypeObj: dialogTypeObj,
							items: data[dialogTypeObj.collectionKey]
						};
						break;
					}

				}

				return nextGroupTypeNotificationsByPriority;

			};

			var hasGroupTypeNotificationsSlotsFree = function(groupTypeNotifications){
				return (
					activedDialogs[groupTypeNotifications.dialogTypeObj.type].length
					<
					groupTypeNotifications.dialogTypeObj.limit
				);
			};

			var getNextPriorityNotification = function(data){

				var
					nextGroupTypeNotificationsByPriority = selectNextGroupTypeNotificationsByPriority(data),
					nextNotification;

				if(
					nextGroupTypeNotificationsByPriority
					&&
					hasGroupTypeNotificationsSlotsFree(nextGroupTypeNotificationsByPriority)
				){

					nextNotification = {
						dialogTypeObj: nextGroupTypeNotificationsByPriority.dialogTypeObj,
						notification: nextGroupTypeNotificationsByPriority.items.shift()
					};

				}

				return nextNotification;

			};

			var delayFurtherSameTypeNotifications = function(data){

				var
					hasMoreNotifications = false,
					dataKeys = Object.keys(data);

				for(var i=0; i<dataKeys.length; i++){
					if(data[dataKeys[i]].length){
						hasMoreNotifications = true;
						break;
					}
				}

				if(hasMoreNotifications){

					$timeout.cancel(delayFurtherSameTypeNotificationsPromisse);

					console.log([
						'factories.notification-center.dialogs.delayFurtherSameTypeNotifications()',
						angular.copy(data)
					]);

					delayFurtherSameTypeNotificationsPromisse = $timeout(
						function(){
							getAndShowNextNotification(data);
						},
						delayFurtherSameTypeNotificationsDuration
					);
				}

			};

			var moveDataCollectionsTypeToOnHold = function(channel, data){
				dataHoldingByChannelStatusCollectionType[channel].map(function(collectionKey){
					if(data[collectionKey]){
						dataHoldingByUserStatusOffline[collectionKey] = data[collectionKey];
						delete data[collectionKey];
					}
				});
			};

			var moveDataToOnHold = function(data){

				Object.keys(dataHoldingByChannelStatusCollectionType).map(function(channel){
					if(!userStatusFactory.isOnline(channel)){
						moveDataCollectionsTypeToOnHold(channel, data);
					}
				});

				if(Object.keys(dataHoldingByUserStatusOffline).length){
					console.log([
						'factories.notification-center.dialogs.moveDataCollectionsTypeToOnHold',
						angular.copy(dataHoldingByUserStatusOffline)
					]);
				}

			};

			var getAndShowNextNotification = function(data){

				cleanUpData(data);

				moveDataToOnHold(data);

				console.log([
					'factories.notification-center.dialogs.getAndShowNextNotification',
					angular.copy(data)
				]);

				cleanUpActivedDialogs();

				var nextNotification = getNextPriorityNotification(data);

				dispatchNewDialogNotification(nextNotification);

				delayFurtherSameTypeNotifications(data);

			};

			var removeMissedDialogsNotifications = function(data){

				Object.keys(activedDialogs).map(function(type){

					var dialogType = notificationsContainerDialog.getDialogType(type);

					var dialogsNotFound = [];

					activedDialogs[type].map(function(dialog){

						if(dialog.data && data[dialogType.collectionKey]){

							var dialogFound = data[dialogType.collectionKey]
								.filter(function(dataItem){
									return dataItem.id === dialog.data.id;
								})[0];

							if(!dialogFound){
								dialogsNotFound.push(dialog.data.id);
								console.warn('Dialog Notification Missed!', dialog.data);
								dialog.remove();
							}

						}

					});

					activedDialogs[type] = activedDialogs[type].filter(function(dialog){
						return dialog.data && dialogsNotFound.indexOf(dialog.data.id) < 0;
					});

				});

			};

			var removeNotification = function(dialog){

				if(dialog.desktopNotification){
					dialog.desktopNotification.close();
					delete dialog.desktopNotification;
				}

			};

			var setDoNotShowAgain = function(id, doNotShowAgain){

				dispatchedNotifications.push(id);

				if(doNotShowAgain){
					addIdNotificationCache(id);
				}

			};

			var removeById = function(id, doNotShowAgain){

				setDoNotShowAgain(id, doNotShowAgain);

				dialogTypesByPriority.map(function(typeObj){
					activedDialogs[typeObj.type].map(function(dialog){
						if(dialog && dialog.data && dialog.data.id == id){

							console.log([
								'factories.notification-center.dialogs.removeById()',
								angular.copy(dialog.data)
							]);

							removeNotification(dialog);

							dialog.remove();

						}
					});
				});

			};

			var removeByAttribute = function(attrs, doNotShowAgain){

				var found = false;

				dialogTypesByPriority.map(function(typeObj){
					activedDialogs[typeObj.type].map(function(dialog){
						if(dialog && dialog.data && dialog.data[attrs.attribute] == attrs.value){

							console.log([
								'factories.notification-center.dialogs.removeByAttribute()',
								angular.copy(dialog.data)
							]);

							setDoNotShowAgain(dialog.data.id, doNotShowAgain);

							removeNotification(dialog);

							dialog.remove();

							found = true;

						}
					});
				});

				if(!found){

					console.log([
						'factories.notification-center.dialogs.removeByAttribute().WaitingForDispatch',
						angular.copy(attrs)
					]);

					removedNotificationsByAttributeWaitingForDispatch.push({
						data: attrs,
						doNotShowAgain: doNotShowAgain
					});

				}

			};

			var addIdNotificationCache = function(id){

				var ids = cache.get('doNotShowIdsAgain') || [];
				ids.push(id);
				cache.put('doNotShowIdsAgain', ids);

			};

			// release all on hold data and clean it up
			var releaseDataOnHold = function(){

				var data = dataHoldingByUserStatusOffline;
				dataHoldingByUserStatusOffline = {};

				if(Object.keys(data).length){

					console.log([
						'factories.notification-center.dialogs.releaseDataOnHold()',
						angular.copy(data)
					]);

					getAndShowNextNotification(data);

				}

			};

			var groupChats = function(data){

				var groupedChats = [];

				if(data[firebaseCollections.chat] && data[firebaseCollections.chat].length){

					var chats = angular.copy(data[firebaseCollections.chat]);

					groupedChats.push(chats.pop());

					chats.map(function(chat){
						groupedChats[0].ProspectNome += ', ' + chat.ProspectNome;
					});

					data[firebaseCollections.chat] = groupedChats;

				}

			};

			var dispatch = function(data){

				console.log([
					'factories.notification-center.dialogs.dispatch('
						+ Object.keys(data).join(',')
						+ ')',
					angular.copy(data)
				]);

				groupChats(data);

				// prevent dispatch dialog notifications twice
				$timeout.cancel(delayFurtherSameTypeNotificationsPromisse);

				removeMissedDialogsNotifications(data);

				getAndShowNextNotification(data);

			};

			$rootScope.$on(
				userStatusBroadcastName,
				releaseDataOnHold
			);

			var factory = {
				name: 'dialogs',
				dispatch: dispatch,
				removeById: removeById,
				removeByAttribute: removeByAttribute
			};

			return factory;
		}
	);

})();

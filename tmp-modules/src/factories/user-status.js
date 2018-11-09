
'use strict';

(function(){

	angular.module('factories.user-status',[])

	.constant('pendingProcessingUserStatus', 'pendingProcessingServiceChannel')
	.constant('userStatusBroadcastName', 'factories.user-status.broadcast')
	.constant('userStatusLabels', {
		chat: 'Chat',
		others: 'Outros',
		phone: 'Telefonia'
	})
	.constant('userStatusValuesProperties', {
		enabled: {
			status: 'isAllowed',
			label: 'Permitido'
		},
		disabled: {
			status: 'notAllowed',
			label: 'inativo'
		},
		offline: {
			status: 'offline',
			label: 'Offline'
		},
		online: {
			status: 'online',
			label: 'Online'
		},
		paused: {
			status: 'pause',
			label: 'Pausado'
		}
	})
	.constant('userQueueStatusProperties', {
		Online: {
			label: 'Online',
			icon: 'thumb-up'
		},
		Pausa: {
			label: 'Pausa',
			icon: 'pause-button-circle-filled'
		},
		NaoResponde: {
			label: 'Sem conexão',
			icon: 'cloud-error-filled'
		}
	})

	.run(function(
		notificationCenterFactory,
		userStatusFactory,
		pendingProcessingUserStatus,
		firebaseCollections
	){

		notificationCenterFactory.registerToGetNotifications({
			collection: [
				firebaseCollections.pendingProcessing
			],
			service: userStatusFactory,
			types: [
				pendingProcessingUserStatus
			]
		});

	})

	.factory(

		'userStatusFactory',

		function(
			$rootScope,
			$timeout,
			$filter,
			mainController,
			permission,
			pendingProcessingUserStatus,
			userStatusBroadcastName,
			usersStatusService,
			userStatusValuesProperties
		){

			var valuePropertieByStatus = {};
			Object.keys(userStatusValuesProperties).map(function(key){
				valuePropertieByStatus[userStatusValuesProperties[key].status] = userStatusValuesProperties[key].label;
			});

			var availableChannels = [];

			if(mainController.getDevice() == 'desktop'){
				availableChannels = availableChannels.concat([
					{
						key: 'channelChat',
						channel: 'chat',
						permission: 'chat_atender',
						permissionPositionInQueue: 'chat_visualizar_ordem_fila',
						permissionHandlerPositionInQueue: 'chat_mudar_ordem_fila',
						hasPausedStatus: true,
						canUserChange: true
					}
				]);
			}

			availableChannels = availableChannels.concat([
				{
					key: 'channelOthers',
					channel: 'others',
					permission: null,
					canUserChange: true
				},
				{
					key: 'channelActiveOffer',
					channel: 'activeOffer',
					permission: null,
					canUserChange: false
				},
				{
					key: 'channelPhone',
					channel: 'phone',
					permission: null,
					canUserChange: true,
					additionalOption: 'telefoneNumeroFull',
					customValueLabel: function(){

						var channelServiceData = getChannelServiceData(this.channel);

						if(channelServiceData[this.additionalOption]){
							return $filter('mask')(
								channelServiceData[this.additionalOption],
								'tel'
							);
						}else{
							return getValuePropertieByStatus(channels[this.channel]);
						}

					}
				}
			]);

			var channelsServiceData = {};
			var channels = {};
			var channelsByName = {};
			var channelsByKey = {};
			var channelsNextPosition = {};
			var statuses = {
				noChannelsAvailable: true,
				channels: channels,
				overall: false
			};

			var isEnabled = function(name){
				var key = channelsByName[name].key;

				return channelsServiceData[key][userStatusValuesProperties.enabled.status];
			};

			var isDisabled = function(name){
				return channels[name] == userStatusValuesProperties.disabled.status;
			};

			var isOnline = function(name){
				return channels[name] == userStatusValuesProperties.online.status;
			};

			var isOffline = function(name){
				return channels[name] == userStatusValuesProperties.offline.status;
			};

			var isPaused = function(name){
				return channels[name] == userStatusValuesProperties.paused.status;
			};

			var canUserChange = function(name){
				return channelsByName[name].canUserChange;
			};

			var canBePaused = function(name){
				return channelsByName[name].hasPausedStatus;
			};

			var getUserStatusFromService = function(){
				usersStatusService.getCurrentUser({
					success: function(response){
						createChannels();
						setChannels(response.data.fields.channel);
					}
				});
			};

			var getValuePropertieByStatus = function(status){
				return valuePropertieByStatus[status];
			};

			var getChannelValueLabel = function(channel){

				var label;
				var channelProperties = getChannelProperties(channel);

				if(channelProperties.customValueLabel){
					label = channelProperties.customValueLabel();
				}else{
					label = getValuePropertieByStatus(channels[channel]);
				}

				return label;

			};

			var createChannelByPermission = function(channel, permissionKey){

				if(!permissionKey || permission.checkPermissions(permissionKey)){
					// channels[channel] = cache.get(channel) || false;
					channels[channel] = userStatusValuesProperties.offline.status;
					statuses.noChannelsAvailable = false;
				}

			};

			var createChannels = function(){

				availableChannels.map(function(channel){

					createChannelByPermission(channel.channel, channel.permission);

					if(typeof channels[channel.channel] != undefined){
						channelsByKey[channel.key] = channel.channel;
						channelsByName[channel.channel] = channel;
					}

				});

			};

			var getOverall = function(){

				var status = false;

				for(var key in channels){
					if(isOnline(key) && canUserChange(key)){
						status = true;
						break;
					}
				}

				return status;
			};

			var broadcastStatus = function(){
				$rootScope.$broadcast(userStatusBroadcastName, get());
			};

			var getChannelServiceData = function(channel){
				return channelsServiceData[channelsByName[channel].key];
			};

			var getChannelProperties = function(channel){
				return channelsByName[channel];
			};

			var getChannelsByKey = function(key){
				return channelsByKey[key];
			};

			var get = function(){

				statuses.overall = getOverall();

				return statuses;

			};

			var channelServicePatch = function(channel, status, additionalOption){

				var channelParam = {};
				channelParam[channelsByName[channel].key] = {
					status: status
				};

				if(additionalOption){
					angular.merge(channelParam[channelsByName[channel].key], additionalOption);
				}

				var revertChannelServiceData = angular.copy(
					channelsServiceData[channelsByName[channel].key]
				);

				usersStatusService.patchCurrentUser({
					data: {
						channel: channelParam
					},
					success: function(response){
						setChannels(response.data.fields.channel);
					},
					error: function(){
						channels[channel] = userStatusValuesProperties.offline.status;
						channelsServiceData[channelsByName[channel].key] = revertChannelServiceData;
					}
				});

			};

			var set = function(channel, status, additionalOption){

				if(typeof channels[channel] !== 'undefined' && canUserChange(channel)){
					// cache.put(channel, status);
					channelServicePatch(channel, status, additionalOption);
					channels[channel] = status;

					if(additionalOption){
						angular.merge(getChannelServiceData(channel), additionalOption);
					}

				}

			};

			var setChannels = function(dataChannels){

				Object.keys(dataChannels).map(function(key){

					channelsServiceData[key] = dataChannels[key];

					if(typeof channels[channelsByKey[key]] != 'undefined'){

						channels[channelsByKey[key]]
							= dataChannels[key][userStatusValuesProperties.enabled.status]
							? dataChannels[key].status
							: userStatusValuesProperties.disabled.status;

					}
				});

				console.log('factories.user-status.setChannels()', channels, channelsServiceData);

			};

			var normalizeCollection = function(collection){

				collection[pendingProcessingUserStatus]
					= collection[pendingProcessingUserStatus] || {};

				angular.merge(
					collection[pendingProcessingUserStatus],
					{
						fields: {
							channel: {}
						}
					}
				);

			};

			var getNextPositionInQueues = function(channel){

				if(isOnline(channel) || isPaused(channel)){
					return channelsNextPosition[channel];
				}

				return null;

			};

			var setNextPositionInQueues = function(channel, nextPosition){
				channelsNextPosition[channel] = nextPosition;
			};

			var dispatch = function(collection){

				console.log(['factories.user-status.dispatch()', collection]);

				collection = collection || {};

				normalizeCollection(collection);

				var dataChannels = collection[pendingProcessingUserStatus].fields.channel;

				setChannels(dataChannels);

				broadcastStatus();

			};

			getUserStatusFromService();

			var factory = {
				get: get,
				set: set,
				getChannelsByKey: getChannelsByKey,
				getChannelValueLabel: getChannelValueLabel,
				getChannelServiceData: getChannelServiceData,
				getChannelProperties: getChannelProperties,
				isEnabled: isEnabled,
				isDisabled: isDisabled,
				isOnline: isOnline,
				isOffline: isOffline,
				isPaused: isPaused,
				canBePaused: canBePaused,
				canUserChange: canUserChange,
				getNextPositionInQueues: getNextPositionInQueues,
				setNextPositionInQueues: setNextPositionInQueues,
				dispatch: dispatch
			};

			return factory;
		}
	);

})();

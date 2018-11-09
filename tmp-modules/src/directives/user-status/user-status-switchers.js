
'use strict';

(function(){

	angular.module('directives.user-status-switchers',[])

	.run(function(formlyConfig){

		formlyConfig.setWrapper([
			{
				name: 'user-status-switchers-formly-wrapper',
				templateUrl: 'user-status/user-status-switchers-formly-wrapper.html'
			},
			{
				name: 'user-status-switcher-formly-wrapper-additional-options',
				templateUrl: 'user-status/user-status-switcher-formly-wrapper-additional-options.html'
			}
		]);

	})

	.controller(
		'UserStatusSwitchersController',

		function(
			$rootScope,
			$scope,
			$timeout,
			$filter,
			audioFactory,
			path,
			userStatusFactory,
			toastrFactory,
			usersService,
			userStatusBroadcastName,
			userStatusLabels,
			userStatusValuesProperties
		){

			var additionalOptions = {
				phone: []
			};

			var setStatuses = function(){
				$scope.statuses = userStatusFactory.get();
			};

			var set = function(channel, value, additionalOption){

				userStatusFactory.set(channel, value, additionalOption);

				if(channel == 'chat' && value == userStatusValuesProperties.online.status){
					audioFactory.play('system');
				}
			};

			var switchOnClick = function(event, options){

				var channelProperties = userStatusFactory.getChannelProperties(options.key);

				if(channelProperties.additionalOption){

					event.preventDefault();

					if(options.value() == userStatusValuesProperties.offline.status){
						options.data.selectAdditionalOption = true;
					}else{
						options.data.selectAdditionalOption = false;
						set(options.key, userStatusValuesProperties.offline.status);
					}

				}

				if(options.templateOptions.disabled){
					toastrFactory.warn({
						title: 'Desculpe',
						message: 'Você precisa estar vinculado a um grupo com permissão para atender o Chat',
						autoDismiss: true
					});
				}

			};

			var showValues = function(key){
				return userStatusFactory.getChannelValueLabel(key);
			};

			var fieldControllerDefault = function($scope){

				var channel = $scope.options.key;

				// var channelServiceData = userStatusFactory.getChannelServiceData(channel);
				var channelProperties = userStatusFactory.getChannelProperties(channel);

				$scope.getAdditionalOptions = function(){
					return additionalOptions[channel];
				};

				$scope.cancelAdditionalOption = function(){
					$scope.options.data.selectAdditionalOption = false;
				};

				$scope.addAdditionalOption = function(){

					$scope.options.data.selectAdditionalOption = false;

					switch(channel) {

						case 'phone':
							$rootScope.mainController.go(path.getPath('user-profile'));
							break;

					}

				};

				$scope.showValues = function(){
					return showValues(channel);
				};

				$scope.setChannelWithAdditionalOption = function(item){

					var additionalOption = {};
					additionalOption[channelProperties.additionalOption] = item;

					set(
						$scope.options.key,
						userStatusValuesProperties.online.status,
						additionalOption
					);

					$timeout(function(){
						$scope.options.data.selectAdditionalOption = false;
					},200);

				};

				$scope.hasAdditionalOptions = !!additionalOptions[channel];

			};

			var fieldControllerWhenChannelHasPauseStatus = function($scope){

				var channel = $scope.options.key;

				$scope.hasAdditionalOptions = false;

				$scope.showToggleButton = function(){
					return !userStatusFactory.isDisabled(channel)
						&&
						!userStatusFactory.isOffline(channel);
				};

				$scope.showValues = function(){
					return showValues(channel);
				};

				$scope.pauseToggle = function(){

					var status = userStatusFactory.isPaused(channel)
						? userStatusValuesProperties.online.status
						: userStatusValuesProperties.paused.status
					;

					console.log('status pauseToggle', channel, status);

					set(channel, status);
				};

			};

			var setFields = function(){

				if(!$scope.fields){

					$scope.fields = [];

					Object.keys($scope.statuses.channels).map(function(key){

						if(
							($scope.switchers && $scope.switchers[key] || !$scope.switchers)
							&&
							userStatusFactory.canUserChange(key)
						){
							$scope.fields.push(
								{
									type: 'anaproSwitch',
									key: key,
									controller: userStatusFactory.canBePaused(key)
										?	fieldControllerWhenChannelHasPauseStatus
										: fieldControllerDefault,
									wrapper: (function(){

										var wrappers = ['user-status-switcher-formly-wrapper-additional-options'];

										if(userStatusFactory.canBePaused(key)){
											wrappers.splice(0, 0, 'user-status-switchers-formly-wrapper');
										}

										return wrappers;

									})(),
									templateOptions: {
										label: userStatusLabels[key],
										onChange: function(value, field){
											set(field.key, value);
										},
										customTrueValue: '\'' + userStatusValuesProperties.online.status + '\'',
										customFalseValue: '\'' + userStatusValuesProperties.offline.status + '\''
									},
									expressionProperties: {
										'templateOptions.disabled': '$modelValue == \'' + userStatusValuesProperties.disabled.status + '\'',
										'templateOptions.paused': '$modelValue == \'' + userStatusValuesProperties.paused.status + '\'',
									},
									data: {
										onclick: switchOnClick
									}
								}
							);
						}

					});

				}

			};

			var setPhoneNumbers = function(){
				usersService.getUserProfile({
					success: function(response){
						additionalOptions.phone = response.data.fields.usuario.usuarioTelefones;
					}
				});
			};

			setPhoneNumbers();
			setStatuses();
			setFields();

			$rootScope.$on(userStatusBroadcastName, function(){
				console.log('directives.user-status-switchers.$on.user-status');
				setStatuses();
			});

		}
	)

	.directive('userStatusSwitchers', function(){
		return {
			restrict: 'E',
			scope: {
				switchers: '='
			},
			templateUrl: 'user-status/user-status-switchers.html',
			controller: 'UserStatusSwitchersController'
		};
	});

})();

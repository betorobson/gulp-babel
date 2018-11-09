'use strict';

(function(){

	angular.module('provider.urls', [])

	.provider('urls', function(
		$httpProvider
	){

		var self = this;

		var getCleanPath = function(path){
			return path.replace(/^.+(\/.+)$/,'$1');
		};

		self.config = {
			getCleanPath: getCleanPath
		};

		var addOcpApimSubscriptionKey = function(configs){
			if(configs.ocpApimSubscriptionKey){
				$httpProvider.defaults.headers.common['Ocp-Apim-Subscription-Key'] = configs.ocpApimSubscriptionKey;
			}
		};

		if(window.APIFAKE)
			self.environment = 'fake';
		else if(window.DEVELOPMENT === true)
			self.environment = 'development';
		else if(window.DEVELOPMENT === 1)
			self.environment = 'development-local';
		else
			self.environment = 'production';

		self.$get = [
			'URLs',
			'URLsFake',
			'URLsDevelopment',
			'URLsDevelopmentLocal',
			'URLsProduction',

			function(
				URLs,
				URLsFake,
				URLsDevelopment,
				URLsDevelopmentLocal,
				URLsProduction
			){
				var configs;

				console.info(
					'%cApp Version: '
						+ window.VERSION
						+ '.'
						+ (window.DEVELOPMENT ? 'dev' : 'prod'),
					'background: blue; color: white; padding: 0 30px;'
				);

				if(window.APIFAKE){
					console.info(
						'%cDefined fake API Environment: ' + window.APIFAKE,
						'background: red; color: white; padding: 0 30px;'
					);
				}else{
					console.info(
						'%cDefined Anapro API Environment: ' + self.environment,
						'background: green; color: white; padding: 0 30px;'
					);
				}

				switch(self.environment.toLowerCase()){
					case 'fake':
						configs = URLsFake;
						break;
					case 'production':
						configs = URLsProduction;
						break;
					case 'development':
						configs = URLsDevelopment;
						break;
					case 'development-local':
						configs = URLsDevelopmentLocal;
						break;
					default:
						throw new Error('Environment '
							+ self.getEnvironment()
							+ ' not available!'
						);
				}

				if(configs.apiPaths){
					configs.apiPaths = angular.extend(URLs.apiPaths, configs.apiPaths);
				}

				configs = angular.extend(URLs,configs);

				configs.environment = self.environment;

				self.config = angular.extend(self.config, configs);

				addOcpApimSubscriptionKey(configs);

				return self.config;
			}];
	});

})();

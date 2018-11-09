
'use strict';

(function(){

	angular.module('services.transactions-report', [])

		.factory(

			'transactionsReportService',

			function(
				$http,
				urls
			){

				var service = {

					get: function(attrs){

						$http({
							url: urls.apiHost + urls.apiPaths.transactionsReport,
							method: 'GET'
						}).then(
							function(response){
								if(typeof attrs.success == 'function'){
									attrs.success(response);
								}
							},
							function(response){
								if(typeof attrs.error == 'function'){
									attrs.error(response);
								}
							}
						);

					}

				};

				return service;

			});

})();


'use strict';

(function(){

	angular.module('views.calendar.link-integration-factory', [])

		.factory(

			'linkIntegrationFactory',

			function(
				$modal
			){

				var showModal = function(){
					$modal({
						templateUrl: 'calendar/directives/link-integration/link-integration-modal.html',
						show: true,
						animation: 'am-fade-and-slide-top',
						controller: function($scope) {
							$scope;
						},
						onHide: function() {
							console.log('modalAddClient hide');
						}
					});
				};

				var factory = {
					showModal: showModal
				};

				return factory;

			});

})();

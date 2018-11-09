
'use strict';

(function(){

	angular.module('directives.client-contacts.factory', [])

	.factory(
		'clientContactsFactory',

		function(
			$modal,
			$timeout,
			$popover
		){
			$popover;

			var showModal = function(attrs){

				$modal({
					templateUrl: 'client-contacts/client-contacts-modal.html',
					show: true,
					animation: 'am-fade-and-slide-top',
					controller: function($scope) {
						$scope.id = attrs.id;
						$scope.clientContactsResource = attrs.resource;

						$scope.modalDelegate = {
							hide: function(){
								console.log('hide');
							}
						};
					},
					onHide: function() {
						console.log('modalAddClient onHide');
					}
				});
			};

			var showPopover = function(attrs){

				var scope = attrs.scope.$new();
				scope.popoverAttrs = attrs;

				var popover = $popover(
					attrs.element,
					{
						scope: scope,
						title: 'Dados do cliente',
						contentTemplate: 'client-contacts/client-contacts-popover.html',
						trigger: 'manual',
						autoClose: true,
						animation: 'am-flip-x',
						placement: 'bottom-left'
					}
				);

				$timeout(popover.show);

				return popover;
			};

			var service = {
				showModal: showModal,
				showPopover: showPopover
			};

			return service;

		}
	)
	;

})();


'use strict';

(function() {

	angular.module('directives.card-followup-email-modal', [])

		.factory('originalEmailFactory',

			function($modal) {

				var show = function(attrs) {
					attrs = attrs || {};

					var emailModal = $modal({
						templateUrl: 'card-followup/item/email-modal/email-modal.html',
						show: true,
						animation: 'am-fade-and-slide-top',
						controller: function($scope) {
							$scope.emailSubject = attrs.item.fields.interacaoEmail.interacaoEmailAssunto || 'Email original';
							$scope.emailProspect = attrs.item.fields.interacaoEmail.interacaoEmailDestinatario;
						},
						onShow: function() {
							var emailBody = emailModal.$element[0].querySelector('modal-body .box-content');
							
							if(emailBody.attachShadow){
								
								emailBody = emailBody.attachShadow({
									mode: 'open'
								});
								
							}
							
							angular.element(emailBody).html(attrs.item.fields.interacaoEmail.interacaoEmailConteudoHtml);

						}
					});

				};

				return {
					show: show
				};
			}
		);

})();


'use strict';

(function(){

	angular.module('directives.card-followup-email', [])

		.controller(
			'CardFollowupEmail',
			function(
				$scope
			){

				$scope.getEmailTo = function(){
					return $scope.item.interacaoEmailDestinatario
						.replace(/,.+@email.anapro.com.br/,'');
				};

				$scope.emailContent = $scope
					.item
					.interacaoEmailConteudoTexto
					.replace(/\s+\r/g,'\n')
					.replace(/\n\s+/g,'\n\n');

			}
		)

		.directive('emailFollowupItem', function(){
			return {
				restrict: 'E',
				templateUrl: 'card-followup/item/email/email.html',
				controller: 'CardFollowupEmail',
				scope: {
					item: '='
				}
			};
		});

})();

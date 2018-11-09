
'use strict';

(function() {

	angular.module('directives.card-followup-ligacao', [])
		.controller(
			'CardFollowupLigacaoController',

			function(
				$scope,
				ligacaoFollowupFactory
			) {

				$scope.ligacaoOrigem = {
					status: $scope.item.interacaoLigacaoOrigemStatus,
					className: ligacaoFollowupFactory.pillColorClassName[$scope.item.interacaoLigacaoOrigemStatus] || ''
				};

				$scope.ligacaoDestino = {
					status: $scope.item.interacaoLigacaoDestinoStatus,
					className: ligacaoFollowupFactory.pillColorClassName[$scope.item.interacaoLigacaoDestinoStatus] || ''
				};
				
			}
		)

		.directive('ligacaoFollowupItem', function() {

			return {
				restrict: 'E',
				templateUrl: 'card-followup/item/ligacao/ligacao.html',
				controller: 'CardFollowupLigacaoController',
				scope: {
					item: '=item'
				}
			};

		})

		.factory('ligacaoFollowupFactory',

			function() {

				var generateLigacaoContent = function(attrs) {

					var telefoneDestino = '(' + attrs.item.interacaoLigacaoDestinoDDD + ') '
						+ attrs.item.interacaoLigacaoDestinoNumero;

					var telefoneOrigem = '(' + attrs.item.interacaoLigacaoOrigemDDD + ') '
						+ attrs.item.interacaoLigacaoOrigemNumero;

					var content = 'Ligação realizada a partir do telefone ' + telefoneOrigem
							+ ' para o telefone ' + telefoneDestino
						+ ' com duração de ' + attrs.item.interacaoLigacaoDuracao;

					return content;

				};

				var pillColorClassName = {
					'atendida': 'ligacaoAtendidaPillColor',
					'cancelada': 'ligacaoCanceladaPillColor',
					'sem resposta': 'ligacaoSemRespostaPillColor',
					'ocupado': 'ligacaoOcupadaPillColor'
				};

				return {
					generateLigacaoContent: generateLigacaoContent,
					pillColorClassName: pillColorClassName
				};
			}
		);

})();

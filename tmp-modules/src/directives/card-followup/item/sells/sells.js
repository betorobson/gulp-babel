
'use strict';

(function() {

	angular.module('directives.card-followup-sells', [])
		.controller(
			'CardFollowupSellsController',

			function(
				$scope
			){

				$scope;

			}
		)

		.directive('sellsFollowupItem', function() {

			return {
				restrict: 'E',
				templateUrl: 'card-followup/item/sells/sells.html',
				controller: 'CardFollowupSellsController',
				scope: {
					item: '=item'
				}
			};

		})

		.factory('sellsFollowupFactory',

			function() {

				var generateContent = function(attrs) {

					angular.merge(
						attrs.item,
						{
							interacaoNegociacaoProduto: {}
						}
					);

					return attrs.item.interacaoNegociacaoProduto.interacaoNegociacaoProdutoNome;

				};

				var pillColorClassName = {
					// 'atendida': 'ligacaoAtendidaPillColor',
					// 'cancelada': 'ligacaoCanceladaPillColor',
					// 'sem resposta': 'ligacaoSemRespostaPillColor',
					// 'ocupado': 'ligacaoOcupadaPillColor'
				};

				return {
					generateContent: generateContent,
					pillColorClassName: pillColorClassName
				};
			}
		);

})();

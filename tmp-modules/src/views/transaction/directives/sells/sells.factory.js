
'use strict';

(function(){

	angular.module('views.transaction')

	.factory(
		'viewTransactionSellsFactory',

		function(
			followupSubTypes
		){

			var getInteractions = function(newInteractions){

				return newInteractions.fields.done.filter(function(item){
					return item.fields.interacaoNegociacao
						&&
						item.fields.interacaoNegociacao.interacaoTipoSubSys == followupSubTypes.sellsSold;
				});

			};

			var service = {
				getInteractions: getInteractions
			};

			return service;
		}
	)
	;

})();

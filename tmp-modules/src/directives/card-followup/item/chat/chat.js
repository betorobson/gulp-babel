
'use strict';

(function(){

	angular.module('directives.card-followup-chat', [])
		.controller(
			'CardFollowupChat',
			function(
				$scope,
				chatFollowupFactory
			){
				$scope.item;
				$scope.clientName = chatFollowupFactory.getName($scope.item);
			}
		)

		.directive('chatFollowupItem', function(){
			return {
				'restrict': 'E',
				templateUrl: 'card-followup/item/chat/chat.html',
				controller: 'CardFollowupChat',
				scope: {
					item: '='
				}
			};
		})
		
		.factory('chatFollowupFactory',
			function(){

				var getName = function(item){
					
					var name;
					item.interacaoChatParticipantes.map(function(itemChat){									
						if(itemChat.interacaoChatParticipantePerfil == 'Solicitante'){
							name = itemChat.interacaoChatParticipanteNome;
						}
					});

					return name;
				};

				var generateChatContent = function(attrs){

					var content = 'Conversa entre os participantes: ';

					attrs.item.interacaoChatParticipantes.map(function(item, index){									
						content += (index ? ', ' : '')
							+ item.interacaoChatParticipanteNome;
					}); 

					return content;
				};

				return {
					generateChatContent: generateChatContent,
					getName: getName
				};
			}
		);

})();

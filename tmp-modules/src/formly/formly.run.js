
'use strict';

(function(){

	angular.module('anapro.formly')

	.run(function(formlyValidationMessages){

		// other example how set error messages
		// doc: http://docs.angular-formly.com/docs/formlyvalidationmessages
		// formlyValidationMessages.messages.required = 'to.label + " is required"'
		// formlyValidationMessages.messages.max = '"The max value allowed is " + to.max'
		// formlyValidationMessages.messages.min = '"The min value allowed is " + to.min'

		formlyValidationMessages.addStringMessage('required', 'Campo obrigatório');
		formlyValidationMessages.addStringMessage('minlength', 'Texto muito curto');
		formlyValidationMessages.addStringMessage('maxlength', 'Texto muito longo');
		formlyValidationMessages.addStringMessage('mask', 'Formato inválido');
		formlyValidationMessages.addStringMessage('cpf', 'CPF inválido');
		formlyValidationMessages.addStringMessage('cnpj', 'CNPJ inválido');
		formlyValidationMessages.addStringMessage('email', 'Email inválido');
		formlyValidationMessages.addTemplateOptionValueMessage(
			'min', 'minValue', 'O valor mínimo permitido é ', '', ''
		);
		formlyValidationMessages.addTemplateOptionValueMessage(
			'max', 'maxValue', 'O valor máximo permitido é ', '', ''
		);

	});

})();

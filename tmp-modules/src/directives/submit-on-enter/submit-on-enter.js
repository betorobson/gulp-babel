
'use strict';

(function() {

	angular.module('directives.submit-on-enter', [])

	.directive('submitOnEnter', function() {

		var link = function(scope, element){

			if(element[0].tagName != 'TEXTAREA'){
				console.warn('submitOnEnter is only allowed on <textarea> elements');

				return;
			}

			var onKeyDown = function(e){
				if(e.keyCode == 13){
					e.preventDefault();
					e.stopPropagation();
					triggerFormEvent();
				}
			};

			var triggerFormEvent = function(){
				angular.element($(element[0]).closest('form')[0]).triggerHandler('submit');
			};

			element.on('keydown', onKeyDown);

		};

		return {
			restrict: 'A',
			require: ['^^form'],
			link: link
		};
	});

}) ();

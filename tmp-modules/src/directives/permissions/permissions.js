
'use strict';

(function(){

	angular.module('directives.permissions',[])

	/*
	Attributes:
		- permissions="keys"
		which keys permissions user must role to render a component
		separate then by comma
		examples:	"resfim_mostrar"
							"resfim_mostrar && resfim_mostrar_atd_valor"
							"resfim_mostrar || resfim_mostrar_atd_valor"

		- permissions-disable-mode
		this attribute do not remove element when the user has no permission or
		the permission is disabled
		it also keep the attribute there for others uses for instance,
		add a custom css like as:
			element[permissions-disable-mode] { background: gray }

		- permissions-remove-attrs="attr1,attr2"
		All following attributes separated by comma will be removed from the element
		when the user has no permission or the permission is disabled

		- permissions-attrs-when-false:attr-name="value"
		This attribute can be used more than once in the same element
		The name, after two dots, will be the new attribute following by its value
		and added when the user has no permission

		- permissions-attrs-when-disabled:attr-name="value"
		This attribute can be used more than once in the same element
		The name, after two dots, will be the new attribute following by its value
		and added when the permission is disabled

		Full example of usage:

			<div
				class="box-content simulacao-proposta"
				attr-a="test-a"
				attr-b="test-b"
				bs-popover
				data-content="Popover funcionando"
				data-placement="bottom"
				data-trigger="hover"

				permissions="con_canais"
				permissions-disable-mode
				permissions-remove-attrs="attr-a,attr-b,bs-popover,data-content,data-placement"

				permissions-attrs-when-false:bs-tooltip
				permissions-attrs-when-false:data-title="Você não tem permissão"
				permissions-attrs-when-false:data-type="warn"

				permissions-attrs-when-disabled:bs-tooltip
				permissions-attrs-when-disabled:data-title="Desativado"
				permissions-attrs-when-disabled:data-type="error"
			>
				<p>
					permission test: resfim_mostrar<br/>
				</p>
			</div>

	*/

	.directive(
		'permissions',

		function(
			$compile,
			permission
		){

			var attrAddWhenFalseName = 'permissionsAttrsWhenFalse';
			var attrAddWhenDisabledName = 'permissionsAttrsWhenDisabled';

			var matchAttrAddWhenFalseName = new RegExp(attrAddWhenFalseName);
			var matchAttrAddWhenDisabledName = new RegExp(attrAddWhenDisabledName);

			var addAttributes = function(attrs, when){

				var match = when === false
					? matchAttrAddWhenFalseName
					: matchAttrAddWhenDisabledName;

				var keys = Object.keys(attrs);

				keys.map(function(key){
					if(match.test(key)){
						var newAttr = key.replace(match, '');
						attrs.$set(newAttr, attrs[key]);
						attrs.$set(key, null);
					}
				});

			};

			var clearAttributes = function(attrs){

				attrs.$set('permissions', null);
				attrs.$set('permissions-remove-attrs', null);

				var keys = Object.keys(attrs);

				keys.map(function(key){
					if((new RegExp(
						attrAddWhenFalseName+'|'+attrAddWhenDisabledName
					)).test(key)){
						attrs.$set(key, null);
					}
				});

			};

			var removeAttributes = function(attrs){

				var list = attrs.permissionsRemoveAttrs;

				if(list){

					var attributes = list.split(',');

					attributes.map(function(item){
						attrs.$set(item, null);
					});

				}

			};

			var compile = function(element, attrs){

				if(attrs.permissions !== ''){

					var doNotRemoveIt = typeof attrs.permissionsDisableMode != 'undefined';

					var permissionStatus = permission.checkPermissions(attrs.permissions);

					// console.log('-----> Directive Permissions ----< ');

					// console.log(element);

					// console.log(
					// 	'permissions: ' + attrs.permissions
					// );

					// console.log('status: ' + permissionStatus);

					// console.log('is set permissions-disable-mode: ' + doNotRemoveIt);

					// console.log('----------------------------');

					if(!permissionStatus || permissionStatus == 'disabled'){

						if(!doNotRemoveIt){
							element.remove();

							return;
						}

						removeAttributes(attrs);
						addAttributes(attrs, permissionStatus);

					}else{
						attrs.$set('permissions-disable-mode', null);
					}

					// clear attributes
					clearAttributes(attrs);

				}

				return function(scope, element){
					$compile(element)(scope);
				};

			};

			return {
				restrict: 'A',
				terminal: true,
				priority: 6000,
				compile: compile
			};
		}
	)

	;

})();

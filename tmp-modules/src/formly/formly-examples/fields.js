
'use strict';

(function(){

	angular.module('anapro.formly.examples',[])

	.controller(
		'FormlyExamplesController',

		function(
			$scope,
			$filter,
			anaproFormlyFactory
		){

			$scope.formBOptions = {};

			$scope.submit = function(){
				if($scope.formB.$valid){
					console.info(
						'Submitting...',
						[
							$scope.formB,
							$scope.filterModel
						]
					);
				}
			};

			$scope.reset = function(){
				// $scope.formBOptions.resetModel();
				anaproFormlyFactory.resetModel(
					$scope.formlyFields,
					$scope.filterModel
				);
			};

			var item = {
				date: '2017-09-09T09:00:00',
				time: '2017-08-08T08:00:00',
				masked: '03042001',
				address: {
					'TESTEprospectEnderecoLogradouro': 'Rua Piratininga',
					'TESTEprospectEnderecoNumero': '431',
					'TESTEprospectEnderecoBairroId': 24032,
					'TESTEprospectEnderecoBairroNome': 'Brás',
					'TESTEprospectEnderecoUF': 'SP',
					'TESTEprospectEnderecoCidadeId': 8860,
					'TESTEprospectEnderecoCidadeNome': 'São Paulo',
					'TESTEprospectEnderecoCEP': '03042001',
					'TESTEprospectEnderecoComplemento': 'ABCD'
				},
				addressMultiInput: [
					{
						id: 123,
						// addressObj: {
						'prospectEnderecoLogradouro': 'Rua Piratininga',
						'prospectEnderecoNumero': '111',
						'prospectEnderecoBairroId': 24032,
						'prospectEnderecoBairroNome': 'Brás',
						'prospectEnderecoUF': 'SP',
						'prospectEnderecoCidadeId': 8860,
						'prospectEnderecoCidadeNome': 'São Paulo',
						'prospectEnderecoCEP': '03042001'
						// }
					},
					{
						id: 456,
						// addressObj: {
						'prospectEnderecoLogradouro': 'Rua Piratininga',
						'prospectEnderecoNumero': '222',
						'prospectEnderecoBairroId': 24032,
						'prospectEnderecoBairroNome': 'Brás',
						'prospectEnderecoUF': 'SP',
						'prospectEnderecoCidadeId': 8860,
						'prospectEnderecoCidadeNome': 'São Paulo',
						'prospectEnderecoCEP': '03042001'
						// }
					}
				],
				phonesMultiInput: [
					{
						id: 1,
						phoneNumber: '1133334444'
					},
					{
						id: 2,
						phoneNumber: '1133335555'
					},
					{
						id: 3,
						phoneNumber: '1133335555'
					},
					// {
					// 	id: 4,
					// 	phoneNumber: '1133335555'
					// },
					// {
					// 	id: 5,
					// 	phoneNumber: '1133335555'
					// },
					// {
					// 	id: 6,
					// 	phoneNumber: '1133335555'
					// },
					// {
					// 	id: 7,
					// 	phoneNumber: '1133335555'
					// },
					// {
					// 	id: 8,
					// 	phoneNumber: '1133335555'
					// },
					// {
					// 	id: 9,
					// 	phoneNumber: '1133335555'
					// },
					// {
					// 	id: 10,
					// 	phoneNumber: '1133335555'
					// },
					// {
					// 	id: 11,
					// 	phoneNumber: '1133335555'
					// },
					// {
					// 	id: 12,
					// 	phoneNumber: '1133335555'
					// },
					// {
					// 	id: 13,
					// 	phoneNumber: '1133335555'
					// },
					// {
					// 	id: 14,
					// 	phoneNumber: '1133335555'
					// },
					// {
					// 	id: 15,
					// 	phoneNumber: '1133335555'
					// },
					// {
					// 	id: 16,
					// 	phoneNumber: '1133335555'
					// },
					// {
					// 	id: 17,
					// 	phoneNumber: '1133335555'
					// },
					// {
					// 	id: 18,
					// 	phoneNumber: '1133335555'
					// },
					// {
					// 	id: 19,
					// 	phoneNumber: '1133335555'
					// }
				],
				contactMultiInput: [
					{
						id: '123',
						cod: '112233',
						name: 'Client A'

					},
					{
						id: '456',
						cod: '776655',
						name: 'Client B'

					}
				],
				documentsMultiInput: [
					{
						id: 1,
						type: 'CPF',
						cpfNumber: '50260466069'
					},
					{
						id: 2,
						type: 'CNPJ',
						cnpjNumber: '65042630000174'
					}
				],
				documentsMultiInputUniqueType: [
					{
						id: 1,
						type: 'CPF',
						cpfNumber: '50260466069'
					}
				],
			};

			$scope.filterModel = {
				amounts: {}
			};

			$scope.formlyFields = [

				// {
				// 	type: 'input',
				// 	key: 'text-row',
				// 	elementAttributes: {
				// 		'layout': 'row'
				// 	},
				// 	templateOptions: {
				// 		label: 'Input row',
				// 		required: true
				// 	}
				// },

				// {
				// 	type: 'anaproCheckbox',
				// 	key: 'chk',
				// 	defaultValue: true,
				// 	templateOptions: {
				// 		label: 'Input row',
				// 		required: true
				// 	}
				// },

				// {
				// 	type: 'nya-select',
				// 	key: 'select-async',
				// 	data: {
				// 		async: {
				// 			resource: 'utilsOccupations'
				// 		}
				// 	},
				// 	templateOptions: {
				// 		label: 'Async select',
				// 		required: true,
				// 		options: [],
				// 		icon: 'users2'
				// 	}
				// },

				// {
				// 	type: 'nya-select',
				// 	key: 'multiselect-async1',
				// 	defaultValue: [
				// 		'13D99AA9-AD76-45DF-8726-E4E2A7532E94',
				// 		'7AA0E863-30DB-4286-914C-35F12BA96342',
				// 		'ED7E961A-674F-4A18-A53C-870A06BD45E9',
				// 		'3094976B-2C66-4358-B192-46CE3860E2C6',
				// 		'B4693D9D-64EE-4415-9117-A8F1E629963A',
				// 		'3C61D471-26D7-4E22-93B2-A01F84C85A47',
				// 		'6B4829C3-ED25-4C4B-93C8-92F0F58FBE62',
				// 		'F2617FC7-232F-4E98-906C-D386FFE23E64',
				// 		'D9243CC9-B27B-4A3C-AB3F-3024DD2A27E6',
				// 		'5F09DEF2-CFD5-4093-907D-28E3B221F7F0',
				// 		'65E597DD-DFF8-42EC-91F9-15073FEADDC5',
				// 		'781EEE68-9318-45A0-BF72-A299B5676EB9'
				// 	],
				// 	data: {
				// 		async: {
				// 			resource: 'utilsOccupations'
				// 		},
				// 		multiple: true
				// 	},
				// 	templateOptions: {
				// 		label: 'Async multi select',
				// 		required: true,
				// 		options: []
				// 	}
				// },

				// {
				// 	type: 'nya-select',
				// 	key: 'multiselect-async2',
				// 	defaultValue: [
				// 		'13D99AA9-AD76-45DF-8726-E4E2A7532E94',
				// 		'7AA0E863-30DB-4286-914C-35F12BA96342',
				// 		'ED7E961A-674F-4A18-A53C-870A06BD45E9',
				// 		'3094976B-2C66-4358-B192-46CE3860E2C6',
				// 		'B4693D9D-64EE-4415-9117-A8F1E629963A',
				// 		'3C61D471-26D7-4E22-93B2-A01F84C85A47',
				// 		'6B4829C3-ED25-4C4B-93C8-92F0F58FBE62',
				// 		'F2617FC7-232F-4E98-906C-D386FFE23E64',
				// 		'D9243CC9-B27B-4A3C-AB3F-3024DD2A27E6',
				// 		'5F09DEF2-CFD5-4093-907D-28E3B221F7F0',
				// 		'65E597DD-DFF8-42EC-91F9-15073FEADDC5',
				// 		'781EEE68-9318-45A0-BF72-A299B5676EB9'
				// 	],
				// 	elementAttributes: {
				// 		'layout': 'row'
				// 	},
				// 	data: {
				// 		async: {
				// 			resource: 'utilsOccupations'
				// 		},
				// 		multiple: true
				// 	},
				// 	templateOptions: {
				// 		label: 'Async multi select',
				// 		icon: 'users2',
				// 		required: true,
				// 		options: [],
				// 		hint: 'Selecione alguns itens.'
				// 	}
				// },

				// {
				// 	type: 'select-async',
				// 	key: 'states-async',
				// 	elementAttributes: {
				// 		'flex': '25'
				// 	},
				// 	data: {
				// 		async: {
				// 			resource: 'utilsStates'
				// 		}
				// 	},
				// 	templateOptions: {
				// 		label: 'Async select',
				// 		required: true,
				// 		options: []
				// 	}
				// },

				// {
				// 	key: 'masked',
				// 	type: 'maskedInput',
				// 	defaultValue: item.masked,
				// 	templateOptions: {
				// 		label: 'CEP Mask',
				// 		mask: '99999-999',
				// 	}
				// },

				// {
				// 	key: 'date',
				// 	type: 'anaproDate',
				// 	defaultValue: item.date,
				// 	elementAttributes: {
				// 		'flex': '25'
				// 	},
				// 	templateOptions: {
				// 		label: 'Data',
				// 		min: $filter('date')(new Date(), 'yyyy-MM-dd'),

				// 		// validators and dateFormat must be same mask/format
				// 		max: $filter('date')(
				// 			new Date(new Date().setDate(new Date().getDate() + 15)),
				// 			'yyyy-MM-ddT00:00:00'
				// 		),
				// 		dateFormat: 'yyyy-MM-ddT00:00:00'

				// 	},
				// 	// validation: {
				// 	// 	messages: {
				// 	// 		min: function(){
				// 	// 			return 'A data precisa ser igual ou maior que hoje.';
				// 	// 		}
				// 	// 	}
				// 	// }
				// },

				// {
				// 	key: 'time',
				// 	type: 'anaproTime',
				// 	defaultValue: item.time,
				// 	elementAttributes: {
				// 		'flex': '25'
				// 	},
				// 	templateOptions: {
				// 		label: 'Hora',
				// 		min: '10:00',
				// 		max: '16:00'
				// 	}
				// },

				// {
				// 	key: 'datetime',
				// 	type: 'anaproDateTime',
				// 	defaultValue: $filter('date')(
				// 		new Date(new Date().setHours(new Date().getHours() + 2)),
				// 		'yyyy-MM-ddTHH:00:00'
				// 	),
				// 	elementAttributes: {
				// 		'flex': '75'
				// 	},
				// 	templateOptions: {
				// 		label: 'Data e Hora',
				// 		required: true,
				// 		min: $filter('date')(new Date(),'yyyy-MM-ddTHH:mm:00'),
				// 		max: $filter('date')(
				// 			new Date(new Date().setDate(new Date().getDate() + 15)),
				// 			'yyyy-MM-ddT00:00:00'
				// 		)
				// 	}
				// },

				// {
				// 	key: 'address',
				// 	type: 'address',
				// 	defaultValue: item.address,
				// 	elementAttributes: {
				// 		'flex': '75'
				// 	},
				// 	templateOptions: {
				// 		label: 'Endereço'
				// 	},
				// 	data: {
				// 		properties: {
				// 			zipcode: 'TESTEprospectEnderecoCEP',
				// 			street: 'TESTEprospectEnderecoLogradouro',
				// 			number: 'TESTEprospectEnderecoNumero',
				// 			neighborhoodId: 'TESTEprospectEnderecoBairroId',
				// 			neighborhood: 'TESTEprospectEnderecoBairroNome',
				// 			state: 'TESTEprospectEnderecoUF',
				// 			cityId: 'TESTEprospectEnderecoCidadeId',
				// 			city: 'TESTEprospectEnderecoCidadeNome',
				// 			street2: 'TESTEprospectEnderecoComplemento',
				// 			info: 'TESTEprospectEnderecoObs'
				// 		}
				// 	}
				// },

				{
					type: 'multiinput',
					key: 'addressMultiInput',
					defaultValue: item.addressMultiInput,
					elementAttributes: {
						'flex': '50'
					},
					data: {
						keepOnRemoveWhenContainsKey: 'id',
						addLabel: '+',
						fields: [
							{
								// key: 'addressObj',
								type: 'address',
								templateOptions: {
									required: true
								},
								ngModelElAttrs: {
									'ng-readonly': 'to.readonly'
								},
								expressionProperties: {
									'templateOptions.readonly': function(currentValue, newValue, scope){
										return !!scope.model.id;
									}
								},
								data: {
									properties: {
										zipcode: 'prospectEnderecoCEP',
										street: 'prospectEnderecoLogradouro',
										number: 'prospectEnderecoNumero',
										neighborhoodId: 'prospectEnderecoBairroId',
										neighborhood: 'prospectEnderecoBairroNome',
										state: 'prospectEnderecoUF',
										cityId: 'prospectEnderecoCidadeId',
										city: 'prospectEnderecoCidadeNome',
										street2: 'prospectEnderecoComplemento',
										info: 'prospectEnderecoObs'
									}
								}
							}
						]
					},
					templateOptions: {
						label: 'Endereços:'
					}
				},

				{
					type: 'multiinput',
					key: 'documentsMultiInput',
					defaultValue: item.documentsMultiInput,
					data: {
						addLabel: '+',
						keepOnRemoveWhenContainsKey: 'id',
						fieldTypeKey: 'type',
						fieldsByType: {
							CPF: [
								{
									key: 'cpfNumber',
									type: 'maskedInput',
									templateOptions: {
										// label: 'CPF',
										required: true,
										cpf: true
									}
								}
							],
							CNPJ: [
								{
									key: 'cnpjNumber',
									type: 'maskedInput',
									templateOptions: {
										// label: 'CPNJ',
										required: true,
										cnpj: true
									}
								}
							]
						}
					},
					templateOptions: {
						label: 'Documentos:'
					}
				},

				{
					type: 'multiinput',
					key: 'documentsMultiInputUniqueType',
					defaultValue: item.documentsMultiInputUniqueType,
					data: {
						addLabel: '+',
						keepOnRemoveWhenContainsKey: 'id',
						fieldTypeKey: 'type',
						fieldTypeKeyUnique: true,
						fieldsByType: {
							CPF: [
								{
									key: 'cpfNumber',
									type: 'maskedInput',
									templateOptions: {
										required: true,
										cpf: true
									}
								}
							],
							CNPJ: [
								{
									key: 'cnpjNumber',
									type: 'maskedInput',
									templateOptions: {
										// label: 'CPNJ',
										required: true,
										cnpj: true
									}
								}
							],
							OUTROS: [
								{
									key: 'outrosNumber',
									type: 'input',
									templateOptions: {
										optionLabel: 'OutrosX',
										required: true
									}
								}
							]
						}
					},
					templateOptions: {
						label: 'Documentos Unique:'
					}
				},
				{
					type: 'multiinput',
					key: 'usuarioTelefones',
					className: 'user-progile-phones-field',
					defaultValue: item.phonesMultiInput,
					data: {
						addLabel: '+',
						// isArrayOfValues: true,
						// keepOnRemoveWhenContainsKey: 'id',
						fields: [
							{
								key: 'phoneNumber',
								type: 'maskedInput',
								elementAttributes: {
									'flex': ''
								},
								ngModelElAttrs: {
									'ng-readonly': 'to.readonly'
								},
								templateOptions: {
									// readonly: true,
									required: true,
									type: 'tel',
									mask: '(99) 9?9999-9999'
								}
							}
						]
					},
					templateOptions: {
						label: 'Telefones:'
					}
				},

				// {
				// 	type: 'multiinput',
				// 	key: 'contactMultiInput',
				// 	// defaultValue: item.contactMultiInput,
				// 	elementAttributes: {
				// 		'flex': '50'
				// 	},
				// 	data: {
				// 		keepOnRemoveWhenContainsKey: 'id',
				// 		addLabel: '+',
				// 		fields: [
				// 			{
				// 				type: 'maskedInput',
				// 				key: 'cod',
				// 				templateOptions: {
				// 					label: 'Código',
				// 					mask: '99-99-99',
				// 					required: true
				// 				}
				// 			},
				// 			{
				// 				type: 'input',
				// 				key: 'name',
				// 				className: 'multiinput-align-fields-row-padding',
				// 				templateOptions: {
				// 					label: 'Nome',
				// 				}
				// 			}
				// 		]
				// 	},
				// 	templateOptions: {
				// 		label: 'Contato:'
				// 	}
				// },

				// {
				// 	type: 'multiinput',
				// 	key: 'contactMultiInput2',
				// 	// defaultValue: item.contactMultiInput,
				// 	elementAttributes: {
				// 		'flex': '50'
				// 	},
				// 	data: {
				// 		// keepOnRemoveWhenContainsKey: 'id',
				// 		addLabel: '+',
				// 		fields: [
				// 			{
				// 				type: 'maskedInput',
				// 				key: 'cod',
				// 				templateOptions: {
				// 					label: 'Código',
				// 					mask: '99-99-99',
				// 					required: true
				// 				}
				// 			},
				// 			{
				// 				type: 'input',
				// 				key: 'name',
				// 				className: 'multiinput-align-fields-row-padding',
				// 				templateOptions: {
				// 					label: 'Nome',
				// 				}
				// 			}
				// 		]
				// 	},
				// 	templateOptions: {
				// 		label: 'Contato:'
				// 	}
				// },

				// {
				// 	key: 'date',
				// 	type: 'input',
				// 	model: {},
				// 	templateOptions: {
				// 		type: 'hidden'
				// 	},
				// 	extras: {
				// 		validateOnModelChange: true
				// 	},
				// 	validators: {
				// 		max: {
				// 			expression: function(newValue, oldValue, scope){
				// 				newValue, oldValue, scope;
				// 				return false;
				// 			}
				// 		},
				// 		message: function(){
				// 			return 'invalid date';
				// 		}
				// 	}
				// },

				// {
				// 	key: 'timeShort',
				// 	type: 'anaproTime',
				// 	defaultValue: '09:00',
				// 	templateOptions: {
				// 		label: 'Hora',
				// 		min: '10:00',
				// 		max: '13:00',
				// 		dateFormat: 'HH:mm'
				// 	}
				// }

				// {
				// 	type: 'numberInput',
				// 	key: 'atendimentoNegocioValor',
				// 	defaultValue: 10,
				// 	// model: $scope.amounts,
				// 	className: 'input-nogrow',
				// 	templateOptions: {
				// 		type: 'tel',
				// 		label: 'Valor:',
				// 		icon: 'currency',
				// 		required: true,
				// 		money: 2,
				// 		minValue: 1,
				// 		maxValue: 2000,
				// 		hint: 'Valor médio da unidade neste atendimento que será utilizado para compor a base de calculo da comissão.'
				// 	},
				// 	ngModelAttrs: {
				// 		off: {
				// 			value: 'autocomplete'
				// 		}
				// 	},
				// 	elementAttributes: {
				// 		layout: 'row'
				// 	}
				// },

				// {
				// 	type: 'numberInput',
				// 	key: 'atendimentoNegocioValor2',
				// 	defaultValue: 10,
				// 	// model: $scope.amounts,
				// 	className: 'input-nogrow',
				// 	templateOptions: {
				// 		type: 'tel',
				// 		label: 'Valor:',
				// 		icon: 'currency',
				// 		required: true,
				// 		decimals: 2,
				// 		minValue: 1,
				// 		maxValue: 2000,
				// 		hint: 'Valor médio da unidade neste atendimento que será utilizado para compor a base de calculo da comissão.'
				// 	},
				// 	ngModelAttrs: {
				// 		off: {
				// 			value: 'autocomplete'
				// 		}
				// 	},
				// 	elementAttributes: {
				// 		layout: 'row'
				// 	}
				// },

				// {
				// 	type: 'numberInput',
				// 	key: 'atendimentoNegocioComissao',
				// 	defaultValue: 20,
				// 	model: $scope.amounts,
				// 	className: 'input-nogrow atendimentoNegocioComissao align-right',
				// 	templateOptions: {
				// 		type: 'tel',
				// 		icon: 'percentage',
				// 		label: 'Comissão:',
				// 		required: true,
				// 		decimals: 2,
				// 		minValue: 0.01,
				// 		maxValue: 99.99,
				// 		hint: 'Percentual médio que servirá para calcular a estimativa de comissão total desse atendimento.'
				// 	},
				// 	ngModelAttrs: {
				// 		off: {
				// 			value: 'autocomplete'
				// 		}
				// 	},
				// 	elementAttributes: {
				// 		layout: 'row'
				// 	}
				// }

			];

			item;

			var originalModel = {
				name: 'teste nome',
				phone: '11933334444',
				arrayOfFields: [
					{
						id: 1,
						name: 'abc',
						cod: '4455',
					},
					{
						id: 2,
						name: 'zxc',
						cod: '6677',
					}
				],
				addresses: [
					{
						id: 1,
						prospectEnderecoLogradouro: 'Rua Piratininga',
						prospectEnderecoNumero: '222',
						prospectEnderecoBairroId: 24032,
						prospectEnderecoBairroNome: 'Brás',
						prospectEnderecoUF: 'SP',
						prospectEnderecoCidadeId: 8860,
						prospectEnderecoCidadeNome: 'São Paulo',
						prospectEnderecoCEP: '03042001',
						prospectEnderecoComplemento: 'A',
						prospectEnderecoObs: 'B'
					},
					{
						id: 2,
						prospectEnderecoLogradouro: 'Rua Piratininga',
						prospectEnderecoNumero: '333',
						prospectEnderecoBairroId: 24032,
						prospectEnderecoBairroNome: 'Brás',
						prospectEnderecoUF: 'SP',
						prospectEnderecoCidadeId: 8860,
						prospectEnderecoCidadeNome: 'São Paulo',
						prospectEnderecoCEP: '03042001',
						prospectEnderecoComplemento: 'A',
						prospectEnderecoObs: 'B'
					}
				]
			};

			$scope.xfilterModel = angular.copy(originalModel);

			$scope.xformlyFields = [

				{
					type: 'input',
					key: 'name',
					defaultValue: originalModel.name,
					elementAttributes: {
						'flex': '50'
					},
					templateOptions: {
						type: 'text'
					}
				},

				{
					type: 'maskedInput',
					key: 'phone',
					defaultValue: originalModel.phone,
					elementAttributes: {
						'flex': '50'
					},
					templateOptions: {
						type: 'tel',
						mask: '(99) 9?9999-9999'
					}
				},

				{
					type: 'multiinput',
					key: 'arrayOfFields',
					defaultValue: originalModel.arrayOfFields,
					elementAttributes: {
						'flex': '50'
					},
					templateOptions: {
						label: 'Dados'
					},
					data: {
						keepOnRemoveWhenContainsKey: 'id',
						addLabel: '+',
						layout: 'row',
						fields: [
							{
								key: 'name',
								type: 'input',
								templateOptions: {
									placeholder: 'Nome'
								}
							},
							{
								key: 'email',
								type: 'anaproEmail',
								templateOptions: {
									required: true,
									placeholder: 'Email'
								}
							},
							{
								key: 'cod',
								type: 'maskedInput',
								templateOptions: {
									placeholder: 'Cod',
									mask: '9.99-9'
								}
							}
						]
					}
				},

				{
					type: 'multiinput',
					key: 'addresses',
					defaultValue: angular.copy(originalModel.addresses),
					elementAttributes: {
						'flex': '50'
					},
					data: {
						keepOnRemoveWhenContainsKey: 'id',
						addLabel: '+',
						fields: [
							{
								//key: 'abc',
								type: 'address',
								templateOptions: {
									required: true
								}
							}
						]
					},
					templateOptions: {
						label: 'Endereços:'
					}
				},

				{
					type: 'input',
					key: 'input1',
					elementAttributes: {
						'flex': '25'
					},
					templateOptions: {
						type: 'text',
						label: 'teste',
						required: true
					}
				}
			];

			var API_FIELDS = [
				{
					type: 'boolean',
					field: 'inputCheckbox'
				},
				{
					type: 'text',
					field: 'inputText'
				},
				{
					type: 'text',
					field: 'inputTextMinMaxLength',
					templateOptions: {
						minLength: 3,
						maxLength: 10
					}
				},
				{
					type: 'text',
					field: 'inputTextMasked',
					templateOptions: {
						mask: '(99) 9?9999-9999',
					}
				},
				{
					type: 'integer',
					field: 'inputCPF',
					templateOptions: {
						cpf: true
					}
				},
				{
					type: 'text',
					field: 'inputCNPJ',
					templateOptions: {
						cnpj: true
					}
				},
				{
					type: 'text',
					field: 'inputCPFouCNPJ',
					templateOptions: {
						cpfCnpj: true
					}
				},
				{
					type: 'integer',
					field: 'inputInteger',
					templateOptions: {
						minValue: 5,
						maxValue: 25
					}
				},
				{
					type: 'decimals',
					field: 'inputDecimal',
					templateOptions: {
						decimals: 3,
						minValue: 1,
						maxValue: 2
					}
				},
				{
					type: 'decimals',
					field: 'inputMoney',
					templateOptions: {
						money: 2,
						minValue: 0.10,
						maxValue: 10
					}
				},
				{
					type: 'multiSelect',
					field: 'multiSelect',
					options:[
						{
							name: 'valor A',
							value: 1
						},
						{
							name: 'valor B',
							value: 2
						},
						{
							name: 'valor C',
							value: 3
						}
					]
				},
				{
					type: 'select',
					field: 'selectRadio',
					options:[
						{
							name: 'Opção Z',
							value: 'Z'
						},
						{
							name: 'Opção X',
							value: 'X'
						},
						{
							name: 'Opção Y',
							value: 'Y'
						}
					]
				},
				{
					type: 'select',
					field: 'select',
					options:[
						{
							name: 'Name A',
							value: 'A'
						},
						{
							name: 'Name B',
							value: 'B'
						},
						{
							name: 'Name C',
							value: 'C'
						}
					]
				},
				{
					type: 'email',
					field: 'inputEmail'
				},
				{
					type: 'date',
					field: 'inputDate'
				},
				{
					type: 'time',
					field: 'inputTime'
				},
				{
					type: 'datetime',
					field: 'inputDateTime'
				}
			];

			API_FIELDS;
			anaproFormlyFactory.createFormlyFieldsFromAPI(
				API_FIELDS,
				$scope.xformlyFields,
				{
					merge: {
						inputCheckbox: {
							className: 'col-xs-3',
							templateOptions: {
								label: 'checkbox?'
							}
						},
						inputText: {
							className: 'col-xs-3',
							templateOptions: {
								required: true,
								label: 'Anapro input'
							}
						},
						inputTextMinMaxLength: {
							className: 'col-xs-3',
							templateOptions: {
								label: 'Anapro input min max length'
							}
						},
						inputTextMasked: {
							className: 'col-xs-3',
							templateOptions: {
								label: 'Anapro masked input',
								placeholder: 'Telefone com DDD'
							},
							validation: {
								messages: {
									mask: function(newValue, oldValue, scope){
										newValue, oldValue, scope;

										return 'Número de telefone inválido!';
									}
								}
							}
						},
						inputCPF: {
							className: 'col-xs-3',
							templateOptions: {
								label: 'Cpf input'
							}
						},
						inputCNPJ: {
							className: 'col-xs-3',
							templateOptions: {
								label: 'Cnpj input'
							}
						},
						inputCPFouCNPJ: {
							className: 'col-xs-3',
							templateOptions: {
								label: 'Cpf ou cnpj input'
							}
						},
						inputInteger: {
							className: 'col-xs-3',
							templateOptions: {
								label: 'Integer input'
							}
						},
						inputDecimal: {
							className: 'col-xs-3',
							templateOptions: {
								label: 'Decimals input'
							}
						},
						inputMoney: {
							className: 'col-xs-3',
							templateOptions: {
								label: 'Money input'
							}
						},
						multiSelect: {
							className: 'col-xs-3',
							templateOptions: {
								label: 'Multiselect'
							}
						},
						selectRadio: {
							type: 'radio',
							className: 'col-xs-3',
							templateOptions: {
								label: 'Anapro radio'
							}
						},
						select: {
							className: 'col-xs-3',
							templateOptions: {
								label: 'Anapro select'
							}
						},
						inputEmail: {
							className: 'col-xs-3',
							templateOptions: {
								label: 'Anapro email input',
								required: true
							}
						},
						inputDate: {
							className: 'col-xs-3',
							templateOptions: {
								label: 'Date input',
								required: true
							}
						},
						inputTime: {
							className: 'col-xs-3',
							templateOptions: {
								label: 'Time input',
								required: true
							}
						},
						inputDateTime: {
							className: 'col-xs-3',
							templateOptions: {
								label: 'Datetime input',
								required: true
							}
						}
					}
				}
			);

		}
	)

	.directive('formlyExamples', function(){
		return {
			restrict: 'E',
			scope: {},
			templateUrl: 'formly-examples/fields.html',
			controller: 'FormlyExamplesController'
		};
	});

})();

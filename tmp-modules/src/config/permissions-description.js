'use strict';

(function(){

	angular.module('anaproApp')

		// Permissions description
		.value('permissionsDescription', {
			'usu_logar_sistema' : 'Permite usuário logar no sistema.',
			'atd_integracao_historico' : 'Permite acesso ao histórico de integração (somente para programador).',
			'con_canais' : 'Editar Canais.',
			'con_interacaotipo' : 'Editar Tipo de Interações.',
			'con_grupo_usuario' : 'Editar Grupos do Usuário.',
			'con_midias' : 'Editar Mídias.',
			'con_perfil_prosp' : 'Editar Perfis dos Prospects.',
			'con_motivacao' : 'Editar motivação (motivo de encerramento).',
			'con_perfil_usuario' : 'Editar Perfis dos Usuários.',
			'con_produtos' : 'Editar Produtos.',
			'con_ficha_pesq' : 'Editar Fichas de Pesquisa.',
			'con_tags' : 'Editar Tags de Atalhos.',
			'con_sms' : 'Editar SMS.',
			'usu_listar' : 'Listar usuários cadastrados.',
			'usu_cadastrar' : 'Cadastrar ou vincular usuário.',
			'usu_cadastrar_importar' : 'Cadastrar ou vincular usuário (importação).',
			'usu_vincular_desvincular' : 'Ativar e inativar usuário.',
			'con_campanha' : 'Editar ou listar algo da campanha.',
			'con_campanha_listar' : 'Listar campanhas cadastrada.',
			'con_campanha_cad' : 'Cadastrar/Editar dados da campanha.',
			'con_campanha_grupo' : 'Manipular grupos vinculados a campanha.',
			'con_campanha_fila' : 'Configuração da fila.',
			'con_campanha_plantao' : 'Configuração de plantão.',
			'con_campanha_plantao_canal' : 'Configuração de plantão / canais.',
			'con_campanha_fichaPesquisa' : 'Configuração de ficha de pesquisa na campanha.',
			'con_campanha_email' : 'Manipulação de emails inteligentes da campanha e links de integração com CHAT e Faleconosco.',
			'con_campanha_geral' : 'Configuraões gerais da campanha.',
			'con_campanha_gatilho_manipular' : 'Manipular os gatilhos de eventos da campanha.',
			'atd_modulo_atendimento' : 'Módulo de atendimento.',
			'atd_manual' : 'Efetuar Atendimento Manualmente.',
			'atd_manual_redirecionado' : 'Efetuar Atendimento Manualmente redirecionando para outros atendentes.',
			'atd_manual_tipo_interacao' : 'Selecionar tipo de interação no "Iniciar novo atendimento".',
			'atd_midia_cadastrar' : 'Permite adicionar mídia no momento da criação do atendimento.',
			'atd_peca_cadastrar' : 'Permite adicionar peça no momento da criação do atendimento.',
			'atd_canais_campanha_todos' : 'Permite utilizar todos os canais da campanha (ativo) na criação do atendimento.',
			'atd_canais_sistema_todos' : 'Permite utilizar todos os canais cadastrados no sistema (ativo) na criação do atendimento.',
			'resfim_mostrar' : 'Mostrar resumo financeiro.',
			'resfim_mostrar_atd_valor' : 'Mostrar valor negociado do atendimento.',
			'resfim_mostrar_atd_comissao' : 'Mostrar comissão do valor negociado do atendimento.',
			'resfim_editar_atd_valor' : 'Editar valor negociado do atendimento.',
			'resfim_editar_atd_comissao' : 'Editar comissão do valor negociado do atendimento.',
			'atd_listar_atendimento' : 'Listar atendimentos.',
			'atd_listar_atendimento_exportar' : 'Listar atendimentos (exportar)',
			'atd_historico_atendimento' : 'Histórico de atendimento.',
			'atd_expectativa' : 'Alterar Atendimento Expectativa.',
			'atd_transf' : 'Transferir Prospect.',
			'atd_transf_roleta' : 'Transferir Prospect para a roleta.',
			'atd_encerrar' : 'Encerrar Atendimento.',
			'atd_prospect' : 'Editar Dados Prospect.',
			'atd_preencher_ficha' : 'Preencher Ficha Pesquisa.',
			'atd_reabrir' : 'Reabrir Atendimento.',
			'atd_exib_outrasequipes' : 'Exibir histórico de atendimento de outras equipes',
			'atd_visualizar_prospect_email' : 'Visualizar e-mail(s) do prospect no atendimento.',
			'atd_visualizar_prospect_telefone' : 'Visualizar telefone(s) do prospect no atendimento',
			'atd_enviar_sms' : 'Enviar SMS.',
			'atd_excluir' : 'Excluir atendimento da base. Atenção, após excluído não será possível recuperar.',
			'atd_interacao_editar' : 'Editar dados da interação.',
			'atd_midia_mostrar' : 'Mostrar a mídia na listagem do atendimento',
			'atd_interacao_marketing_view' : 'Permite visualizar as Requisições do Prospect para atendimento (Integração).',
			'atd_interacao_marketing_view_integracao' : 'Permite visualizar o log da integração através das Requisições do Prospect para atendimento (Integração).',
			'atd_interacoes_menos_importantes' : 'Permite visualizar todas as interações do atendimento, mesmo as menos importantes.',
			'atd_editar_produto' : 'Editar produto do atendimento',
			'atd_editar_midia_peca' : 'Editar a mídia ou a peça',
			'atd_editar_dtAtendimento' : 'Editar data do atendimento',
			'atd_oportunidade_registrar' : 'Registrar oportunidade de negócio para o atendimento (registrar venda).',
			'atd_oportunidade_editar' : 'Cancelar uma oportunidade de negócio previamente registrada (editar ou cancelar venda).',
			'atd_oportunidade_editar_atendimento' : 'Habilita a possibilidade de alterar o atendimento da oportunidade de negócio.',
			'pro_acessar_cadastro_de_prospect' : 'Acessar o cadastro do prospect (alterar)',
			'pro_acessar_cadastro_de_prospect_incluir' : 'Acessar o cadastro do prospect (incluir)',
			'pro_acessar_dados_n_fidelizados' : 'Acessar dados de Prospect não fidelizado ao próprio usuário.',
			'pro_excluir_email' : 'Excluir ou alterar e-mail na edição dos dados do Prospect.',
			'pro_excluir_telefone' : 'Excluir ou alterar telefone na edição dos dados do Prospect.',
			'pro_excluir_endereco' : 'Excluir ou alterar endereço na edição dos dados do Prospect.',
			'pro_excluir_documento' : 'Excluir ou alterar documento na edição dos dados do Prospect.',
			'pro_visualizar_email' : 'Visualizar e-mail na edição dos dados do Prospect.',
			'pro_visualizar_telefone' : 'Visualizar telefone na edição dos dados do Prospect.',
			'pro_visualizar_endereco' : 'Visualizar endereço(s) na edição dos dados do Prospect.',
			'pro_visualizar_documento' : 'Visualizar documento(s) na edição dos dados do Prospect.',
			'pro_importacao_prospect' : 'Importação de Prospect.',
			'pro_prospeccao' : 'Prospecção de Prospect.',
			'pro_hashtag_editar' : 'Editar ou vincular HashTag de um Prospect.',
			'chat_atender' : 'Efetuar Atendimento Via Chat.',
			'chat_ver_todas_filas' : 'Visualizar todas as filas de todas as campanhas mesmo que não seja administrador ou participe da mesma.',
			'chat_mudar_ordem_fila' : 'Mudar ordem de atendimento do CHAT.',
			'relat_bi_externo' : 'BI externo.',
			'relat_atendimento_analitico' : 'Amostragem dos atendimentos analíticos dos relatórios. Navegação nos atendimentos dos relatórios analíticos.',
			'R05_ficha_de_pesquisa' : 'R05 - Ficha de pesquisa.',
			'R06_ficha_de_pesquisa_agrupado' : 'R06 - Ficha de pesquisa agrupado por peso.',
			'R09_conversao_de_atendimento_comparativo' : 'R09 - Conversão de atendimentos.',
			'usuariosOnline_Chat' : 'Usuários online e previsão de ordem de atendimento.',
			'relat_resumo_interacao' : 'Resumo de interações.',
			'relat_cadastrar_bacth_email' : 'Cadastro de recebimento automático de relatório por email.',
			// 'R12_fila_atendimento' : 'Fila de atendimento (Versão BETA).', <-- key duplicada
			'R12_fila_atendimento' : 'Acesso ao relatório',
			'R12_fila_atendimento_interar' : 'Permitir manipulação da fila através do atender.',
			'R12_fila_atendimento_zerar_comentario' : 'Permitir resetar os comentários da fila.',
			'R12_fila_atendimento_embaralhar_fila' : 'Permitir embaralhar fila de forma aleatória.',
			'R12_fila_atendimento_ordem_fila' : 'Permitir alterar ordem de usuários na fila de atendimento.',
			'R12_fila_atendimento_manipularUsuario' : 'Manipular usuários na fila. Adicionar ou remover usuários da fila.',
			'top_manipular' : 'Manipular os tópicos',
			'tag_manipular' : 'Manipular TAG e incluir.',
			'tag_excluir' : 'Excluir TAG.',
			'tel_us_conf_geral' : 'Permite ao usuário configurar e editar os parâmetros da telefonia.',
			'tel_us_conf_ativo' : 'Permite ao usuário configurar parâmetros da telefonia (ATIVO).',
			'tel_us_conf_passivo' : 'Permite ao usuário configurar parâmetros da telefonia (PASSIVO).',
			'tel_us_telefonia_ativo' : 'Permite ao usuário realizar ligação através do módulo de telefonia.',
			'tel_us_ligacao_escuta' : 'Permite ao usuário escutar a ligação no atendimento.',
			'atd_ligar_para_prospect' : 'Permite que o usuário ligue para um prospect através do próprio sistema.'
		})

	;

})();

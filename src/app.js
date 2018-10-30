'use strict';

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.array.sort");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.object.assign");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.function.bind");

require("core-js/modules/es6.string.link");

require("core-js/modules/es6.string.trim");

require("core-js/modules/es6.regexp.split");

require("core-js/modules/es6.array.filter");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.array.index-of");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.array.find");

require("core-js/modules/es6.regexp.constructor");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.regexp.match");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function () {
  angular.module('anaproApp', [// analytics
  'config.analytics', // libs
  'ngRoute', 'ngAnimate', 'ngMessages', 'ngCookies', 'ngPostMessage', 'ui.utils.masks', 'ngMask', 'angular-cache', 'nya.bootstrap.select', 'toastr', 'angular.filter', // providers
  'provider.apiToken', 'provider.path', 'provider.urls', 'provider.main-controller', 'provider.permission', 'provider.base64', //angular-strap
  'mgcrea.ngStrap.popover', 'mgcrea.ngStrap.datepicker', 'mgcrea.ngStrap.timepicker', 'mgcrea.ngStrap.modal', // formly
  'anapro.formly', // services
  'services.auth', 'services.clients', 'services.firebase', 'services.longpolling', 'services.queues', 'services.pending-processing', 'services.permissions', 'services.pipelines', 'services.products', 'services.transactions', 'services.users', 'services.users.status', 'services.utils', 'services.calendar', 'services.schedules', // factories
  'factories.audio', 'factories.auth-cookie', 'factories.beamer', 'factories.desktop-notifications', 'factories.destroy', 'factories.error-message', 'factories.http-interceptor', 'factories.moment', 'factories.navigationBar', 'factories.notification-center', 'factories.toastr', 'factories.user-status', // directives
  'directives.add-client', 'directives.automate-new-lead', 'directives.avatar', 'directives.breadcrumbs', 'directives.card-actions', 'directives.card-client-profile', 'directives.card-followup', 'directives.chat', 'directives.client-avatar', 'directives.client-contact', 'directives.enriched-person-data', 'directives.footer', 'directives.icon-medal', 'directives.icon-svg', 'directives.img-src-error-remove', 'directives.list', 'directives.list-filter', 'directives.loading-spinner', 'directives.mainController', 'directives.modal', 'directives.modal-iframe-anapro-v1', 'directives.navigationBar', 'directives.notifications-container', 'directives.perfil', 'directives.perfil-transactions-summary', 'directives.permissions', 'directives.radial-progress', 'directives.transaction-finish', 'directives.transaction-transfer', 'directives.submit-on-enter', 'directives.user-position-in-queues', 'directives.user-status-bullet', 'directives.user-status-switchers', 'directives.view-title', // views
  'views.auth', 'views.home', 'views.clients', 'views.transactions', 'views.transaction', 'views.user-profile', 'views.calendar', 'views.queues-handler-position', // init
  'config.init.token', 'config.logout']);
})();

'use strict';

(function () {
  angular.module('config.analytics', ['angulartics', 'angulartics.google.tagmanager']).config(function ($analyticsProvider) {
    $analyticsProvider.virtualPageviews(false); // [todo] cordova google analytics plugin
    // if(window.cordova){
    // 	googleAnalyticsCordovaProvider.trackingId = GATrackingIdsProvider.id;
    // 	googleAnalyticsCordovaProvider.period = 10;
    // 	googleAnalyticsCordovaProvider.debug = false;
    // }
  }).factory('analyticsService', function ($location, $analytics, usersService) {
    var setUsername = function setUsername() {
      usersService.getUserProfile({
        success: function success(response) {
          $analytics.setUsername(response.data.fields.usuario.usuarioIdGuid);
        }
      });
    };

    var pageTrack = function pageTrack(next) {
      next = angular.merge(next || {}, {
        $$route: {
          configPath: {}
        }
      });

      if (next.$$route.configPath.getPageTrack) {
        $analytics.pageTrack(next.$$route.configPath.getPageTrack(next));
      } else {
        $analytics.pageTrack($location.path());
      }
    };

    return {
      pageTrack: pageTrack,
      setUsername: setUsername
    };
  });
})();

'use strict';

(function () {
  var hostApiFakes = {
    remote: 'https://sheltered-eyrie-99519.herokuapp.com',
    local: 'http://' + location.hostname + ':3000'
  };

  var getHostApiFake = function getHostApiFake() {
    return hostApiFakes[window.APIFAKE] || hostApiFakes['remote'];
  };

  angular.module('anaproApp') // default prod api URLs
  .value('URLs', {
    apiHost: '',
    apiPaths: {
      // auth
      auth: '/auth/v1/auth',
      // logout
      logout: '/login/v1/logout',
      // utils
      utilsCEP: '/localidades/v1/ceps',
      utilsLocation: {
        base: '/localidades/v1',
        states: '/ufs',
        cities: '/cidades',
        neighborhoods: '/bairros'
      },
      utilsOccupations: '/utils/v1/profissoes',
      // clients: Carteira de clientes
      clients: '/clients/v1/clients',
      // transactions: Negócios
      transactions: '/transactions/v1/transactions',
      transactionsActions: {
        amounts: '/actions/amounts',
        pipelineStage: '/actions/pipelinestage',
        automateLead: '/actions/automate-lead',
        transfer: '/actions/transfer',
        attend: '/actions/attend',
        request: '/actions/request',
        won: '/actions/won',
        lost: '/actions/lost',
        followers: '/actions/followers'
      },
      // transactions/activeoffer: Oferta Ativa
      transactionsActiveOffer: '/transactions/v1/activeoffer',
      // transactions-summary: Resumo de Negócios
      transactionsSummary: '/transactions-summary/v1/transactions-summary',
      // transactions-report: Compromissos e pendências de Negócios
      transactionsReport: '/transactions-report/v1/transactions-report',
      // followups: Tarefas
      followups: '/followups/v1/followups',
      followupsSubTypes: '/followups/v1/interacoestiposub',
      followupsGroupByStatus: '/followups/v1/followups-groupbystatus',
      followupsActions: {
        taskDone: '/actions/task-done',
        reschedule: '/actions/task-reschedule'
      },
      // queues: Fila de atendimento
      queues: '/queues/v1/queues',
      queuesActions: {
        position: '/actions/position'
      },
      //calendar: Agenda
      calendar: '/followups/v1/schedules',
      //schedules: Links de integração para agendas
      schedules: '/schedules/v1/integrationSchedules',
      // users
      users: '/users/v1/users',
      usersServiceChannel: '/servicechannel',
      myUser: '/users/v1/myuser',
      // user profile
      userProfile: '/userprofiles/v1/userprofiles',
      // permissions
      permissions: '/permissions/v1/permissions',
      // pipelines
      pipelines: '/pipelines/v1/pipelines',
      // products
      products: '/products/v1/products',
      // services
      servicesPendingprocessing: '/services/v1/pendingprocessing',
      firebaseToken: '/services/v1/firebase/token',
      // longlopping
      legacyLongPollingPresence: '/legacy/v1/longpolling/presence'
    }
  }).value('URLsProduction', {
    maxvendas: '//anapro.crm.anapro.com.br',
    app: location.protocol + '//' + location.hostname.match(/^(.+)\.anapro/)[1] + '.anapro.com.br',
    apiHost: '//api.anapro.com.br/webcrm/webapi/crm/v1' // apiHost: '//anapro.azure-api.net/app',
    // ocpApimSubscriptionKey: '8080e97ede474b29ba653fe9520a0053'

  }).value('URLsDevelopment', {
    maxvendas: '//testedev.crm.anapro.com.br',
    app: location.protocol + '//appdev.anapro.com.br' + (location.port ? ':' + location.port : ''),
    apiHost: '//apidev.anapro.com.br/webcrm/webapi/crm/v1'
  }).value('URLsDevelopmentLocal', {
    maxvendas: '//testedev.crm.anapro.com.br',
    app: location.protocol + '//appdevlocal.anapro.com.br' + (location.port ? ':' + location.port : ''),
    apiHost: '//apidev.anapro.com.br/webcrm/webapi/crm/v1'
  }) // local api URLs
  .value('URLsFake', {
    apiHost: getHostApiFake(),
    apiPaths: {
      // auth
      auth: '/auth',
      // utils
      utilsCEP: '/utils/cep',
      // clients: Carteira de clientes
      clients: '/clients',
      // transactions: Negócios
      transactions: '/transactions/v1/transactions',
      transactionsActions: {
        automateLead: '/actions/automate-lead'
      },
      // transactions-summary: Resumo de Negócios
      transactionsSummary: '/transactions-summary',
      // transactions-report: Compromissos e pendências de Negócios
      transactionsReport: '/transactions-report',
      // followups: Tarefas
      followups: '/followups',
      followupsGroupByStatus: '/followups-groupbystatus',
      // users
      userProfile: '/userprofiles',
      // permissions
      permissions: '/permissions',
      // services
      servicesPendingprocessing: '/services/v1/pendingprocessing',
      firebaseToken: '/services/firebase/token'
    }
  });
})();

'use strict';

(function () {
  angular.module('anaproApp').config(function ($httpProvider, $routeProvider, $locationProvider, $compileProvider, $tooltipProvider, $modalProvider, pathProvider) {
    $compileProvider.debugInfoEnabled(window.DEVELOPMENT);
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('httpInterceptor');
    $routeProvider.otherwise({
      redirectTo: pathProvider.get('transactions').path
    });
    angular.extend($tooltipProvider.defaults, {
      html: true
    });
    angular.extend($modalProvider.defaults, {
      keyboard: false
    });
  });
})();

'use strict';

(function () {
  angular.module('config.init.token', []).run(function (authCookieFactory, authService) {
    authService.clearStorageWheLastTokenHasBeenChanged();
    authService.getToken();
    authCookieFactory.checkCookie();

    if (!authService.token) {
      authCookieFactory.goToAnaproLogin();
    }
  });
})();

'use strict';

(function () {
  angular.module('config.logout', []).run(function ($rootScope, $location, $timeout, authCookieFactory, authService, firebaseProvider, longpollingService, path, toastr, toastrFactory, usersService) {
    var dispatchToastrMessages = function dispatchToastrMessages(response) {
      toastr.clear();

      if (!response.config.goToAnaproLogin) {
        var toastrObj = {
          target: 'body',
          allowHtml: true,
          closeButton: false,
          onTap: function onTap() {
            authCookieFactory.goToAnaproLogin();
          }
        };
        response.config = response.config || {};
        angular.merge(response.config, {
          toastrMessages: {}
        });
        angular.merge(toastrObj, {
          title: 'Login encerrado!',
          message: 'Clique aqui para efetuar login novamente.'
        }, response.config.toastrMessages.payloadError || {});
        toastrFactory.error(toastrObj);
      }
    };

    var stopServices = function stopServices() {
      longpollingService.stop();
      firebaseProvider.signout();
    };

    var logoutSuccess = function logoutSuccess(response) {
      if (response.config.goToAnaproLogin) {
        authCookieFactory.goToAnaproLogin();
      } else {
        $location.path(path.getPath('auth')).replace();
      }
    }; // request user authentication


    $rootScope.$on('requestUserAuthentication', function (event, response) {
      console.log('$rootScope.$on.requestUserAuthentication -> triggered', response);

      if (usersService.isProfileLoaded()) {
        dispatchToastrMessages(response);
      }

      stopServices();
      authService.logoutSuccess();
      logoutSuccess(response);
      usersService.clearCache();
    });

    var logout = function logout(event, response) {
      console.log('$rootScope.$on.logout -> triggered', response);
      dispatchToastrMessages(response);
      stopServices();
      authService.logout({
        success: function success() {
          logoutSuccess(response);
        }
      });
    };

    $rootScope.$on('logout', logout);
  });
})();

'use strict';

(function () {
  angular.module('anaproApp') // Permissions description
  .value('permissionsDescription', {
    'usu_logar_sistema': 'Permite usuário logar no sistema.',
    'atd_integracao_historico': 'Permite acesso ao histórico de integração (somente para programador).',
    'con_canais': 'Editar Canais.',
    'con_interacaotipo': 'Editar Tipo de Interações.',
    'con_grupo_usuario': 'Editar Grupos do Usuário.',
    'con_midias': 'Editar Mídias.',
    'con_perfil_prosp': 'Editar Perfis dos Prospects.',
    'con_motivacao': 'Editar motivação (motivo de encerramento).',
    'con_perfil_usuario': 'Editar Perfis dos Usuários.',
    'con_produtos': 'Editar Produtos.',
    'con_ficha_pesq': 'Editar Fichas de Pesquisa.',
    'con_tags': 'Editar Tags de Atalhos.',
    'con_sms': 'Editar SMS.',
    'usu_listar': 'Listar usuários cadastrados.',
    'usu_cadastrar': 'Cadastrar ou vincular usuário.',
    'usu_cadastrar_importar': 'Cadastrar ou vincular usuário (importação).',
    'usu_vincular_desvincular': 'Ativar e inativar usuário.',
    'con_campanha': 'Editar ou listar algo da campanha.',
    'con_campanha_listar': 'Listar campanhas cadastrada.',
    'con_campanha_cad': 'Cadastrar/Editar dados da campanha.',
    'con_campanha_grupo': 'Manipular grupos vinculados a campanha.',
    'con_campanha_fila': 'Configuração da fila.',
    'con_campanha_plantao': 'Configuração de plantão.',
    'con_campanha_plantao_canal': 'Configuração de plantão / canais.',
    'con_campanha_fichaPesquisa': 'Configuração de ficha de pesquisa na campanha.',
    'con_campanha_email': 'Manipulação de emails inteligentes da campanha e links de integração com CHAT e Faleconosco.',
    'con_campanha_geral': 'Configuraões gerais da campanha.',
    'con_campanha_gatilho_manipular': 'Manipular os gatilhos de eventos da campanha.',
    'atd_modulo_atendimento': 'Módulo de atendimento.',
    'atd_manual': 'Efetuar Atendimento Manualmente.',
    'atd_manual_redirecionado': 'Efetuar Atendimento Manualmente redirecionando para outros atendentes.',
    'atd_manual_tipo_interacao': 'Selecionar tipo de interação no "Iniciar novo atendimento".',
    'atd_midia_cadastrar': 'Permite adicionar mídia no momento da criação do atendimento.',
    'atd_peca_cadastrar': 'Permite adicionar peça no momento da criação do atendimento.',
    'atd_canais_campanha_todos': 'Permite utilizar todos os canais da campanha (ativo) na criação do atendimento.',
    'atd_canais_sistema_todos': 'Permite utilizar todos os canais cadastrados no sistema (ativo) na criação do atendimento.',
    'resfim_mostrar': 'Mostrar resumo financeiro.',
    'resfim_mostrar_atd_valor': 'Mostrar valor negociado do atendimento.',
    'resfim_mostrar_atd_comissao': 'Mostrar comissão do valor negociado do atendimento.',
    'resfim_editar_atd_valor': 'Editar valor negociado do atendimento.',
    'resfim_editar_atd_comissao': 'Editar comissão do valor negociado do atendimento.',
    'atd_listar_atendimento': 'Listar atendimentos.',
    'atd_listar_atendimento_exportar': 'Listar atendimentos (exportar)',
    'atd_historico_atendimento': 'Histórico de atendimento.',
    'atd_expectativa': 'Alterar Atendimento Expectativa.',
    'atd_transf': 'Transferir Prospect.',
    'atd_transf_roleta': 'Transferir Prospect para a roleta.',
    'atd_encerrar': 'Encerrar Atendimento.',
    'atd_prospect': 'Editar Dados Prospect.',
    'atd_preencher_ficha': 'Preencher Ficha Pesquisa.',
    'atd_reabrir': 'Reabrir Atendimento.',
    'atd_exib_outrasequipes': 'Exibir histórico de atendimento de outras equipes',
    'atd_visualizar_prospect_email': 'Visualizar e-mail(s) do prospect no atendimento.',
    'atd_visualizar_prospect_telefone': 'Visualizar telefone(s) do prospect no atendimento',
    'atd_enviar_sms': 'Enviar SMS.',
    'atd_excluir': 'Excluir atendimento da base. Atenção, após excluído não será possível recuperar.',
    'atd_interacao_editar': 'Editar dados da interação.',
    'atd_midia_mostrar': 'Mostrar a mídia na listagem do atendimento',
    'atd_interacao_marketing_view': 'Permite visualizar as Requisições do Prospect para atendimento (Integração).',
    'atd_interacao_marketing_view_integracao': 'Permite visualizar o log da integração através das Requisições do Prospect para atendimento (Integração).',
    'atd_interacoes_menos_importantes': 'Permite visualizar todas as interações do atendimento, mesmo as menos importantes.',
    'atd_editar_produto': 'Editar produto do atendimento',
    'atd_editar_midia_peca': 'Editar a mídia ou a peça',
    'atd_editar_dtAtendimento': 'Editar data do atendimento',
    'atd_oportunidade_registrar': 'Registrar oportunidade de negócio para o atendimento (registrar venda).',
    'atd_oportunidade_editar': 'Cancelar uma oportunidade de negócio previamente registrada (editar ou cancelar venda).',
    'atd_oportunidade_editar_atendimento': 'Habilita a possibilidade de alterar o atendimento da oportunidade de negócio.',
    'pro_acessar_cadastro_de_prospect': 'Acessar o cadastro do prospect (alterar)',
    'pro_acessar_cadastro_de_prospect_incluir': 'Acessar o cadastro do prospect (incluir)',
    'pro_acessar_dados_n_fidelizados': 'Acessar dados de Prospect não fidelizado ao próprio usuário.',
    'pro_excluir_email': 'Excluir ou alterar e-mail na edição dos dados do Prospect.',
    'pro_excluir_telefone': 'Excluir ou alterar telefone na edição dos dados do Prospect.',
    'pro_excluir_endereco': 'Excluir ou alterar endereço na edição dos dados do Prospect.',
    'pro_excluir_documento': 'Excluir ou alterar documento na edição dos dados do Prospect.',
    'pro_visualizar_email': 'Visualizar e-mail na edição dos dados do Prospect.',
    'pro_visualizar_telefone': 'Visualizar telefone na edição dos dados do Prospect.',
    'pro_visualizar_endereco': 'Visualizar endereço(s) na edição dos dados do Prospect.',
    'pro_visualizar_documento': 'Visualizar documento(s) na edição dos dados do Prospect.',
    'pro_importacao_prospect': 'Importação de Prospect.',
    'pro_prospeccao': 'Prospecção de Prospect.',
    'pro_hashtag_editar': 'Editar ou vincular HashTag de um Prospect.',
    'chat_atender': 'Efetuar Atendimento Via Chat.',
    'chat_ver_todas_filas': 'Visualizar todas as filas de todas as campanhas mesmo que não seja administrador ou participe da mesma.',
    'chat_mudar_ordem_fila': 'Mudar ordem de atendimento do CHAT.',
    'relat_bi_externo': 'BI externo.',
    'relat_atendimento_analitico': 'Amostragem dos atendimentos analíticos dos relatórios. Navegação nos atendimentos dos relatórios analíticos.',
    'R05_ficha_de_pesquisa': 'R05 - Ficha de pesquisa.',
    'R06_ficha_de_pesquisa_agrupado': 'R06 - Ficha de pesquisa agrupado por peso.',
    'R09_conversao_de_atendimento_comparativo': 'R09 - Conversão de atendimentos.',
    'usuariosOnline_Chat': 'Usuários online e previsão de ordem de atendimento.',
    'relat_resumo_interacao': 'Resumo de interações.',
    'relat_cadastrar_bacth_email': 'Cadastro de recebimento automático de relatório por email.',
    // 'R12_fila_atendimento' : 'Fila de atendimento (Versão BETA).', <-- key duplicada
    'R12_fila_atendimento': 'Acesso ao relatório',
    'R12_fila_atendimento_interar': 'Permitir manipulação da fila através do atender.',
    'R12_fila_atendimento_zerar_comentario': 'Permitir resetar os comentários da fila.',
    'R12_fila_atendimento_embaralhar_fila': 'Permitir embaralhar fila de forma aleatória.',
    'R12_fila_atendimento_ordem_fila': 'Permitir alterar ordem de usuários na fila de atendimento.',
    'R12_fila_atendimento_manipularUsuario': 'Manipular usuários na fila. Adicionar ou remover usuários da fila.',
    'top_manipular': 'Manipular os tópicos',
    'tag_manipular': 'Manipular TAG e incluir.',
    'tag_excluir': 'Excluir TAG.',
    'tel_us_conf_geral': 'Permite ao usuário configurar e editar os parâmetros da telefonia.',
    'tel_us_conf_ativo': 'Permite ao usuário configurar parâmetros da telefonia (ATIVO).',
    'tel_us_conf_passivo': 'Permite ao usuário configurar parâmetros da telefonia (PASSIVO).',
    'tel_us_telefonia_ativo': 'Permite ao usuário realizar ligação através do módulo de telefonia.',
    'tel_us_ligacao_escuta': 'Permite ao usuário escutar a ligação no atendimento.',
    'atd_ligar_para_prospect': 'Permite que o usuário ligue para um prospect através do próprio sistema.'
  });
})();

'use strict';

(function () {
  angular.module('anaproApp') // Permissions disabled and overwritten
  .value('permissionsConfig', // all removed or disabled permissions must be listed below
  // you also are able to create new permission
  // key: {removed:true|false, disabled:true|false}
  {
    // custom permissions
    'usr_reports': {
      removed: false,
      disabled: true
    },
    'email_marketing': {
      removed: false,
      disabled: true
    },
    'view.clients': {
      removed: false,
      disabled: true
    },
    'view.calendar': {
      removed: false,
      disabled: false
    },
    'view.realties': {
      removed: false,
      disabled: false
    },
    'view.help': {
      removed: false,
      disabled: true
    },
    'view.settings': {
      removed: false,
      disabled: true
    },
    'view.transactoins.filter.with-tasks': {
      removed: false,
      disabled: false
    },
    'navigation-bar.notifications': {
      removed: false,
      disabled: true
    },
    'card-actions.tour': {
      removed: false,
      disabled: true
    },
    'card-actions.note': {
      removed: false,
      disabled: false
    },
    'card-actions.activity': {
      removed: false,
      disabled: false
    },
    'atd_enviar_sms': {
      removed: false,
      disabled: true
    },
    'atd_voltar_fase': {
      removed: false,
      disabled: false
    } //existing permissions

  });
})();

'use strict';

(function () {
  angular.module('anaproApp').run(function ($rootScope, $location, $route, $timeout, path, authService, usersService, permission, toastrFactory, analyticsService) {
    $rootScope['pathProvider'] = path;

    var setUserIsLogged = function setUserIsLogged() {
      $rootScope.isLogged = !!authService.token;
    };

    var viewRequireLogin = function viewRequireLogin(event, next, viewConfig) {
      if (viewConfig) {
        if (!$rootScope.isLogged && viewConfig.requireLogin) {
          console.error('Access denied:', $location.$$path);
          event.preventDefault();
          $location.path(path.getPath('auth')).replace();
          console.groupEnd();
          return true;
        } else {
          console.info('Route do not request user to be logged in', next);

          if ($rootScope.isLogged && viewConfig.redirToDefaultWhenLoggedIn) {
            console.info('Ow! you are already authenticated, redirecting you to home: ');
            event.preventDefault();
            $location.path(path.getPath('home')).replace();
            console.groupEnd();
            return true;
          }

          return false;
        }
      }

      console.groupEnd();
      return false;
    };

    var checkProfileLoaded = function checkProfileLoaded(event, next) {
      if ($rootScope.isLogged && !usersService.isProfileLoaded()) {
        console.warn('$routeChangeStart on hold due to user profile is not loaded', next); // event.preventDefault();

        console.groupEnd();
        return true;
      }

      return false;
    };

    var checkPermissions = function checkPermissions(event, next, viewConfig) {
      if ($rootScope.isLogged) {
        var hasUserViewPermission = true;
        var permissionDescription = '';

        if (viewConfig && viewConfig.configPath.permissions) {
          hasUserViewPermission = permission.permissionStatus(viewConfig.configPath.permissions);
          permissionDescription = permission.getDescription(viewConfig.configPath.permissions) || viewConfig.configPath.permissionDescription;
          console.log('request permission: ' + viewConfig.configPath.permissions);
        } else {
          console.log('view do not requets any permission');
        }

        console.log('permission status: ' + hasUserViewPermission);

        if (hasUserViewPermission !== true) {
          event.preventDefault();
          $location.path(path.getPath('home')).replace();
          console.groupEnd();

          if (hasUserViewPermission === false) {
            toastrFactory.warn({
              title: 'Desculpe, você não tem permissão para ' + permissionDescription
            });
          } else {
            toastrFactory.error({
              title: 'Desculpe, a funcionalidade ' + permissionDescription + ' está momentaneamente desligada'
            });
          }

          return false;
        }
      }

      console.groupEnd();
      return true;
    };

    var isPathLogout = function isPathLogout(event) {
      if (new RegExp('^(' + path.getPath('logout') + ')').test($location.$$path + '/')) {
        event.preventDefault();
        $rootScope.$broadcast('logout', {
          config: {
            goToAnaproLogin: true
          }
        });
        return true;
      }

      return false;
    };

    var analyticsPageTrack = function analyticsPageTrack(next) {
      console.log(next);

      if (next.$$route && next.$$route.originalPath) {
        analyticsService.pageTrack(next);
      }
    }; //watch for route changes


    $rootScope.$on('$routeChangeStart', function (event, next) {
      var viewConfig = next.$$route;
      console.group('Route Change Listener');
      analyticsPageTrack(next);

      if (next.$$route) {
        console.log(next.$$route.originalPath);
      }

      if (isPathLogout(event)) {
        return;
      }

      setUserIsLogged();

      if (viewRequireLogin(event, next, viewConfig)) {
        return;
      }

      if (checkProfileLoaded(event, next)) {
        return;
      }

      if (!checkPermissions(event, next, viewConfig)) {
        return;
      }

      console.groupEnd();
    });
  });
})();
/* eslint-disable */


(function () {
  ////////////////////////////////////////////////////////////////////////////////////////
  // Anapro Functions
  window.AF = window.AF || {}; ////////////////////////////////////////////////////////////////////////////////////////

  $(document).on('show', '.accordion', function (e) {
    //$('.accordion-heading i').toggleClass(' ');
    $(e.target).prev('.accordion-heading').addClass('accordion-opened');
  });
  $(document).on('hide', '.accordion', function (e) {
    $(this).find('.accordion-heading').not($(e.target)).removeClass('accordion-opened'); //$('.accordion-heading i').toggleClass('fa-chevron-right fa-chevron-down');
  });
  $(function () {
    $('.carousel').carousel({
      interval: 0
    });
    $('.carousel').on('slid.bs.carousel', function () {
      var carouselAltText = $(this).find('[data-carousel-selected-alt]');

      if (carouselAltText.length > 0) {
        carouselAltText.html($(this).find('.item.active img').attr('alt'));
      }
    });
    $('[data-carousel-selected-alt]').each(function () {
      $(this).parents('.carousel').trigger('slid.bs.carousel');
    });

    if ($("#txtEditor").Editor) {
      $("#txtEditor").Editor();
    } //popover


    $('[rel=popover]').popover({
      html: true,
      trigger: 'hover',
      placement: 'top',
      content: function content() {
        return '<img src="' + $(this).data('img') + '" />' + ' ' + $(this).data('txt');
      }
    });
    $('[rel=popover]').on('mouseover', function () {
      $('.popover').removeClass('green').removeClass('red').addClass($(this).data('color'));
    }); ////////////////////////////////////////////////////////////////////////////////////////
    // Bootstrap TAB Behavior //
    ////////////////////////////////////////////////////////////////////////////////////////

    $(document).delegate('[data-toggle="tab"]', 'click', function (e) {
      e.preventDefault();
      $(this).tab('show');
      $(this).closest('.nav-tabs').find('[data-toggle="tab"]').removeClass('active');
      $(this).addClass('active');
    }); ////////////////////////////////////////////////////////////////////////////////////////
    // Bootstrap Weird TAB Behavior //
    // by MCorrea //
    ////////////////////////////////////////////////////////////////////////////////////////

    $(document).delegate('[data-keepopen-collapse]', 'click', function (e) {
      if ($(this).data('dismiss') == undefined) {
        e.stopPropagation();
      }

      var button = $(this);

      if (button.parent().hasClass('active')) {
        return;
      }

      var parentId = button.data('parent');

      if (parentId != undefined) {
        button.closest(parentId).find('[data-parent="' + parentId + '"]').each(function () {
          var panelId = $(this).data('target');
          $(this).parent().removeClass('active');
          $(panelId).removeClass('in');
        });
        button.parent().addClass('active');
        $(button.data('target')).addClass('in');
      }
    }); ////////////////////////////////////////////////////////////////////////////////////////

    $('[data-collapsed-text]').on('click', function () {
      var btn = $(this);
      window.setTimeout(function () {
        if (btn.data('expanded-text') == undefined) {
          btn.data('expanded-text', btn.text());
        }

        var expandedText = btn.data('expanded-text');
        var collapsedText = btn.data('collapsed-text');

        if (btn.hasClass('collapsed')) {
          btn.text(expandedText);
        } else {
          btn.text(collapsedText);
        }
      }, 200);
    });
    var sliders = $('[data-input-slider]');

    if (sliders.slider) {
      sliders.slider();
      sliders.on('slide', function (ev) {
        var id = $(this).data('input-slider');
        var sufix = $(this).data('slider-value-sufix');
        $('[data-input-slider-min="' + id + '"]').val(ev.value[0]);
        $('[data-input-slider-max="' + id + '"]').val(ev.value[1]);
        var valueText = ev.value[0] + sufix + ' - ' + ev.value[1] + sufix;
        $('[data-input-slider-html="' + id + '"]').html(': ' + valueText);
      });
    }
  });
  $(function () {
    var filtroTriggers = $('[data-filtro-container-trigger]');
    filtroTriggers.on('click', function () {
      var id = $(this).data('filtro-container-trigger');
      var parentId = $(this).closest('[data-filtro]').data('filtro');
      $('[data-filtro="' + parentId + '"]').find('[data-filtro-container-trigger]').removeClass('active');
      $('[data-filtro="' + parentId + '"]').find('[data-filtro-container-trigger="' + id + '"]').addClass('active');
      $('[data-filtro="' + parentId + '"]').find('[data-filtro-container]').removeClass('in');
      $('[data-filtro="' + parentId + '"]').find('[data-filtro-container="' + id + '"]').addClass('in');
    });
    $('[data-filtro]').each(function () {
      $(this).find('[data-filtro-container-trigger]:first').trigger('click');
    }); //////////////
    // Applied globally on all textareas with the "autoExpand" class

    (function () {
      var textAreaAutoExpand = function textAreaAutoExpand(event) {
        var minRows = this.getAttribute('data-min-rows') | 0,
            rows;
        this.rows = minRows;
        rows = Math.floor(this.scrollHeight / 20.5);
        $(this).css({
          height: this.scrollHeight + 'px'
        });
      };

      $(document).on('input.autoExpand focus', 'textarea.autoExpand', textAreaAutoExpand);
    })(); // !!!! DO NOT USE DataTable JQuery Plugin over Angular !!!!
    // if($('.dataTable').DataTable){
    // 	$('.dataTable').DataTable();
    // }


    $('[data-agenda-task]').on('click', function () {
      var agenda = $(this).closest('[data-agenda]');
      var col = $(this).closest('.col');
      var task = $(this).data('agenda-task');
      $(agenda).find('[data-agenda-task]').closest('.col').removeClass('selected');
      $(agenda).find('[data-agenda-task]').closest('.col').css('margin-bottom', "");
      col.addClass('selected');
      agenda.find('[data-agenda-taskview]').removeClass('in');
      agenda.find('[data-agenda-taskview="' + task + '"]').addClass('in');
      var taskViewHeight = col.find('.task-view').height();
      col.css('margin-bottom', taskViewHeight - 20);
    });
    $('[data-agenda] [data-agenda-task-close]').on('click', function () {
      $(this).closest('.col').removeClass('selected');
      $(this).closest('.col').css('margin-bottom', "");
    }); ////////////////////////////////////////////////////////////////////////////////////////
    // Bootstrap Dropdown //
    ////////////////////////////////////////////////////////////////////////////////////////
    // previne o menu de fechar ao clicar dentro
    // $('.dropdown-menu.dropdown-menu-keepopen').on("click.bs.dropdown", function(e){ e.stopPropagation(); });
    // replaced by delegate

    $(document).delegate('.dropdown-menu.dropdown-menu-keepopen', 'click', function (e) {
      e.stopPropagation();
    });

    $.fn.hideParentDropdown = function (target) {
      var elemet = $(target).closest('.btn-group.open').removeClass('open').find('dropdown-menu');
      return elemet;
    }; ////////////////////////////////////////////////////////////////////////////////////////
    //habilitando navegação no carossel por swipe, apenas para mobile


    $('.carousel.only-mobile .item').on('swipe', function (e) {
      var item = $(this);
      var x1 = e.swipestart.coords[0];
      var x2 = e.swipestop.coords[0];

      if (x1 >= x2) {
        item.closest('.carousel').find('[data-slide="next"]').trigger('click');
      } else {
        item.closest('.carousel').find('[data-slide="prev"]').trigger('click');
      }
    });

    if ($('.datepicker').datepicker) {
      $('.datepicker').datepicker({
        language: "pt-BR",
        autoclose: true,
        format: "dd/mm/yyyy"
      });
    }

    Chat.Config();
    OverContent.Config();
    EditField.Config();
  });

  var Chat = function () {
    return {
      Id: '',
      Config: function Config() {
        $('[data-chat-contatos-open]').on('click', function () {
          var aberto = $(this).data('chat-contatos-open');
          if (aberto == undefined) aberto = false;

          if (aberto == true) {
            Chat.Contato.Fechar();
          } else {
            Chat.Contato.Abrir();
          }
        });
        $('[data-chat-open]').on('click', function () {
          var aberto = $(this).data('chat-open');
          if (aberto == undefined) aberto = false;

          if (aberto) {
            Chat.Mensagens.Fechar();
          } else {
            Chat.Mensagens.Abrir();
          }
        });
        $('[data-chat-finish]').on('click', function () {
          Chat.Finish();
        });
        $('[data-chat-start]').on('click', function () {
          var id = $(this).data('chat-start');
          Chat.Start(id);
        });
      },
      Start: function Start(id) {
        Chat.Finish();
        Chat.Id = id;
        Chat.Contato.Fechar(0);
        Chat.Mensagens.Fechar(0);
        $('[data-chat="' + id + '"]').show();
      },
      Finish: function Finish() {
        $('[data-chat]').hide();
      },
      Mensagens: {
        Abrir: function Abrir(time) {
          if (time == undefined) time = 100;
          $('[data-chat="' + Chat.Id + '"] [data-chat-messages]').show(time, function () {
            $('[data-chat="' + Chat.Id + '"] [data-chat-open]').data('chat-open', true);
            $('[data-chat="' + Chat.Id + '"] [data-chat-open]').addClass('open');
            $('[data-chat="' + Chat.Id + '"] [data-chat-contatos-list]').show(0);
          });
        },
        Fechar: function Fechar(time) {
          if (time == undefined) time = 100;
          $('[data-chat="' + Chat.Id + '"] [data-chat-contatos-list]').hide(0, function () {
            $('[data-chat="' + Chat.Id + '"] [data-chat-messages]').hide(time, function () {
              $('[data-chat="' + Chat.Id + '"] [data-chat-open]').data('chat-open', false);
              $('[data-chat="' + Chat.Id + '"] [data-chat-open]').removeClass('open');
            });
          }, 0);
        }
      },
      Contato: {
        Abrir: function Abrir(time) {
          if (time == undefined) time = 100;
          $('[data-chat="' + Chat.Id + '"] [data-chat-contatos-list]').animate({
            width: '100%'
          }, time, function () {
            $('[data-chat="' + Chat.Id + '"] [data-chat-contatos-open]').data('chat-contatos-open', true);
            $('[data-chat="' + Chat.Id + '"] [data-chat-contatos-open]').addClass('open');
          });
        },
        Fechar: function Fechar(time) {
          if (time == undefined) time = 100;
          $('[data-chat="' + Chat.Id + '"] [data-chat-contatos-list]').animate({
            width: 0
          }, time, function () {
            $('[data-chat="' + Chat.Id + '"] [data-chat-contatos-open]').data('chat-contatos-open', false);
            $('[data-chat="' + Chat.Id + '"] [data-chat-contatos-open]').removeClass('open');
          });
        }
      }
    };
  }(); // [todo] remove this kind of modal behavior which cause too much cpu usage


  var OverContent = function () {
    return {
      Config: function Config() {
        $('[data-overcontent-button]').on('click', function () {
          $('[data-overcontent]').hide();
          var overcontent = $('[data-overcontent="' + $(this).data('overcontent-button') + '"]');
          overcontent.find('.overcontent-container').css('height', '0px');
          overcontent.show(function () {
            var overcontentContainer = overcontent.find('.overcontent-container');
            overcontentContainer.animate({
              height: '100%'
            }, 300, function () {
              $('body').css('overflow', 'hidden');
            });
          });
        });
        $('[data-overcontent-close]').on('click', function () {
          var overcontent = $(this).closest('[data-overcontent]');
          overcontent.find('.overcontent-container').animate({
            height: '0px'
          }, 300, function () {
            overcontent.hide();
            $('body').css('overflow', 'auto');
          });
        });
      }
    };
  }();

  var EditField = function () {
    return {
      Config: function Config() {
        $('[data-edit-form]').hide();
        $('[data-edit-button]').on('click', function () {
          var editContainer = $(this).closest('[data-edit]');
          editContainer.find('[data-edit-view]').hide();
          editContainer.find('[data-edit-form]').show();
        });
        $('[data-edit-confirm]').on('click', function () {
          var editContainer = $(this).closest('[data-edit]');
          editContainer.find('[data-edit-view]').show();
          editContainer.find('[data-edit-form]').hide(); //TODO implementar persistencia do dado
        });
      }
    };
  }();

  window['Chat'] = Chat;
})();
/* eslint-enable */


'use strict';

(function () {
  angular.module('factories.audio', []).factory('audioFactory', function ($rootScope, $timeout, mainController, base64, toastrFactory, desktopNotificationsFactory) {
    var audioIsReady = false;
    var audioMutedToastNotification;
    var resumeAfterInteractionList = [];

    var playPromiseSuccess = function playPromiseSuccess() {
      console.log('Audio is enabled', audioMutedToastNotification);
      document.title = document.title.replace(/🔇/g, '');
      audioIsReady = true;

      if (audioMutedToastNotification) {
        audioMutedToastNotification.scope.close();
        audioMutedToastNotification = null;
        $rootScope.$digest();
      }

      desktopNotificationsFactory.closeById('audioDisabled');
      runResumeAfterInteraction();
    };

    var runResumeAfterInteraction = function runResumeAfterInteraction() {
      resumeAfterInteractionList.map(function (func) {
        func();
      });
      resumeAfterInteractionList = [];
    };

    var playPromiseError = function playPromiseError(error, resumeAfterInteraction) {
      console.error('audio is disabled', error);

      if (document.title.indexOf('🔇') < 0) {
        document.title += '🔇';
      }

      if (typeof resumeAfterInteraction == 'function') {
        resumeAfterInteractionList.push(resumeAfterInteraction);
      }

      $timeout(function () {
        if (!audioMutedToastNotification) {
          audioMutedToastNotification = toastrFactory.info({
            title: 'O áudio esta desligado.',
            message: 'Clique aqui para ligar.',
            autoDismiss: false,
            closeButton: false,
            iconClass: 'toast-volume-mute',
            tapToDismiss: false,
            onTap: function onTap() {
              play('system');
            }
          });
        }

        if (!document.hasFocus()) {
          desktopNotificationsFactory.send({
            tag: 'audioDisabled',
            title: 'Anapro áudio desligado.',
            body: 'Clique aqui para ligar.',
            icon: '/assets/imgs/icons/volume-muted-desktop-notification.png',
            requireInteraction: true,
            callback: function callback() {
              play('system');
            },
            onshow: function onshow() {
              if (audioIsReady) {
                this.close();
              }
            }
          });
        }
      });
    };

    var play = function play(name, resumeAfterInteraction) {
      var sound = base64.getFilesType('sounds')[name];

      if (!sound) {
        console.warn('Sorry, the audio ' + name + ' do not exists within base64 source');
        return;
      }

      var audio = new Audio(sound);
      var audioPromise = audio.play();

      if (audioPromise && mainController.getDevice() == 'desktop') {
        audioPromise.then(playPromiseSuccess).catch(function (error) {
          playPromiseError(error, resumeAfterInteraction);
        });
      }

      return audio;
    };

    $timeout(function () {
      if (base64.getFilesType('sounds')['system']) {
        var soundSystem = play('system');
        soundSystem.muted = true;
      }
    }, 5000);
    var factory = {
      play: play
    };
    return factory;
  });
})();

'use strict';

(function () {
  angular.module('factories.auth-cookie', []).factory('authCookieFactory', function ($rootScope, $cookies, apiToken, urls) {
    var cookieObj = {
      name: 'mvl3',
      user: function () {
        var name = 'keyIns';
        var regexp = new RegExp(name + '=((.*?)(&|$))');
        return {
          name: name,
          match: regexp
        };
      }(),
      properties: {
        domain: '.anapro.com.br',
        path: '/'
      }
    };
    var loginUrl = '//login.anapro.com.br/web/pages/login/anapro.aspx';
    var goUrl = (/^https/.test(urls.app) ? 'https' : 'http') + '%3a%2f%2fcrm.anapro.com.br%2fwebcrm%2fpages%2flogin%2fdefault.aspx';
    var urlAnaproLogin = [loginUrl, '?sys=SUPERCRM', '&returnUrlAnapro=' + urls.app, '&goUrl=' + goUrl, '&img=http%3a%2f%2fcrm.anapro.com.br%2fwebcrm%2fcontasistema%2fPadrao%2fimagens%2flogo01.jpg&exit=1', '&msg=Por+favor%2c+para+acessar+o+sistema+digite+seu+email+e+senha+cadastrado.+Caso+ainda+não+seja+cadastrado+entre+em+contato+com+o+seu+gerente.', '&g=6a6b7614-805f-43d6-811f-23a71efb2fe2'].join('');

    var get = function get() {
      return $cookies.get(cookieObj.name);
    };

    var goToAnaproLogin = function goToAnaproLogin() {
      window.location.replace(urlAnaproLogin);
    };

    var isSameUser = function isSameUser(token) {
      if (cookieObj.user.match.test(token) && cookieObj.user.match.test($cookies.get(cookieObj.name))) {
        var currentUser = token.match(cookieObj.user.match)[2];
        var newUser = $cookies.get(cookieObj.name).match(cookieObj.user.match)[2];
        return currentUser == newUser;
      } else {
        return false;
      }
    };

    var clear = function clear() {
      $cookies.remove(cookieObj.name, cookieObj.properties); // goToAnaproLogin();
    };

    var checkCookie = function checkCookie() {
      var hasCookieChangedToOtherUser = false;
      var cacheToken = apiToken.getCache();
      var token = cacheToken.get('token') || {};
      token = token.token || null;

      if (!$cookies.get(cookieObj.name)) {// goToAnaproLogin();
      } else if (token != $cookies.get(cookieObj.name)) {
        if (isSameUser(token)) {
          console.log(['Token Cookie has been changed however the user is the same, so ', 'just update the token!'].join(''));
          $rootScope.$broadcast('tokenCookieHasBeenChangedButUserIsTheSame');
        } else {
          console.error(['Token Cookie has been changed and was detected it is an other', ' user, so app is redirecting to home'].join(''), {
            currentLocalStorageToken: token,
            newTokenCookie: $cookies.get(cookieObj.name)
          });
          $rootScope.$broadcast('tokenCookieHasBeenChanged');
          hasCookieChangedToOtherUser = true;
        }
      }

      return hasCookieChangedToOtherUser;
    };

    var factory;

    var noop = function noop() {
      console.log('factories.auth-cookie.noop()');
    };

    if (window.APIFAKE) {
      factory = {
        get: noop,
        checkCookie: noop,
        clear: noop,
        goToAnaproLogin: noop
      };
    } else {
      factory = {
        get: get,
        checkCookie: checkCookie,
        clear: clear,
        goToAnaproLogin: goToAnaproLogin
      };
    }

    return factory;
  });
})();

'use strict';

(function () {
  angular.module('factories.beamer', []).factory('beamerFactory', function (usersService) {
    var filters = [];

    var getFilters = function getFilters() {
      return filters.join(';');
    };

    var setFilters = function setFilters(data) {
      if (usersService.isAdm()) {
        filters.push('adm');
      }

      filters.push(data.extraInfo.contaSistemaVendasUrl);
    };

    var setConfig = function setConfig(attrs) {
      if (!window.beamer_config) {
        usersService.getUserProfile({
          success: function success(response) {
            setFilters(response.data);
            window['beamer_config'] = {
              product_id: 'PgCiLFgn5949',
              selector: '#beamer-button',
              lazy: true,
              language: 'PT_BR',
              filters: getFilters(),
              user_id: response.data.id,
              user_firstname: response.data.fields.usuario.usuarioNome,
              user_lastname: response.data.fields.usuario.usuarioApelido,
              user_email: response.data.fields.usuario.usuarioEmail,
              callback: function callback() {
                // remove beamer selector when add on footer
                $('#beamerSelector').remove();
              }
            };
            console.log('factories.beamer.setConfig()');
            console.table(window.beamer_config);
            attrs.success();
          }
        });
      } else {
        attrs.success();
        window['beamer_config']['selector'] = '#beamer-button';
      }
    };

    var beamerInit = function beamerInit() {
      if ($('#beamer-button').is(':visible')) {
        Beamer.init();
      }
    };

    var init = function init() {
      setConfig({
        success: beamerInit
      });
    };

    var factory = {
      init: init
    };
    return factory;
  });
})();

'use strict';

(function () {
  angular.module('factories.desktop-notifications', []).constant('notificationSupported', !!window.Notification).factory('desktopNotificationsFactory', function ($rootScope, $timeout, notificationSupported, toastrFactory) {
    var toast;
    var notificationsById = {};
    var initialPermission;

    if (notificationSupported) {
      initialPermission = Notification.permission;
    }

    var helpURL;
    var helpURLs = {
      Chrome: {
        test: /Google/.test(navigator.vendor),
        url: 'https://support.google.com/chrome/answer/114662?hl=pt-BR'
      },
      Firefox: {
        test: /Firefox/.test(navigator.userAgent),
        url: 'https://support.mozilla.org/pt-BR/kb/notificacoes-web-push-firefox'
      },
      Safari: {
        test: /Apple/.test(navigator.vendor),
        url: 'https://support.apple.com/pt-br/guide/safari/sfri40734/mac'
      },
      Edge: {
        test: /Microsoft/.test(navigator.vendor),
        url: 'https://microsoftedgetips.microsoft.com/pt-br/3/45?source=f1'
      }
    };
    Object.keys(helpURLs).map(function (key) {
      if (helpURLs[key].test) {
        helpURL = helpURLs[key].url;
      }
    });

    var showToast = function showToast() {
      if (document.title.indexOf('🔕') < 0) {
        document.title += '🔕';
      }

      var message;

      if (Notification.permission == 'default') {
        message = 'Clique aqui para ativar.<br /><br />Depois clique em permitir na mensagem que apareceu no seu navegador.';
      } else {
        message = 'Você bloqueou as notificações.<br/><br/>Clique aqui para saber como permitir o Anapro App disparar notificações.';
      }

      if (toast) {
        toast.scope.close();
        toast = null;
      }

      toast = toastrFactory.info({
        title: 'As suas notificações estão desligadas!',
        message: message,
        autoDismiss: false,
        tapToDismiss: false,
        closeButton: false,
        allowHtml: true,
        iconClass: 'notifications-disabled',
        onTap: function onTap() {
          if (Notification.permission == 'default') {
            hasPermission();
          } else {
            window.open(helpURL);
          }
        }
      });
    };

    var checkPermission = function checkPermission(permission) {
      var permissionValue = permission || Notification.permission;

      if (permissionValue !== 'granted' && !toast) {
        showToast();
      }
    };

    var hasPermission = function hasPermission(callback) {
      if (!notificationSupported) {
        console.log('Browser does not support Web API Notifications');
        return null;
      }

      checkPermission();

      if (Notification.permission === 'granted') {
        if (callback) {
          return callback();
        }
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function () {
          var permission = Notification.permission;
          checkPermission(permission);

          if (permission === 'granted') {
            if (toast) {
              document.title = document.title.replace(/🔕/g, '');
              toast.scope.close();
              $rootScope.$digest();
              toast = null;
            }

            if (callback) {
              return callback();
            }
          } else if (initialPermission == 'default' && permission == 'denied') {
            showToast();
          }
        });
      }
    };

    var newNotification = function newNotification(attrs) {
      var notification = new Notification(attrs.title, attrs);

      if (attrs.onshow) {
        notification.onshow = attrs.onshow;
      }

      if (attrs.tag) {
        notificationsById[attrs.tag] = notification;
      }

      notification.onclick = function () {
        window.focus();

        if (attrs.callback) {
          attrs.callback();
        }

        this.close();
      };

      return notification;
    };

    var send = function send(attrs) {
      return hasPermission(function () {
        return newNotification(attrs);
      });
    };

    var noop = function noop() {
      console.log('desktop-notifications.noop()');
    };

    var getById = function getById(id) {
      return notificationsById[id];
    };

    var closeById = function closeById(id) {
      if (notificationsById[id] && notificationsById[id].close) {
        notificationsById[id].close();
        notificationsById[id] = null;
      }
    };

    var factory = {
      getById: getById,
      closeById: closeById,
      send: notificationSupported ? send : noop,
      hasPermission: hasPermission
    };
    return factory;
  });
})();

'use strict';

(function () {
  angular.module('factories.destroy', []).factory('destroyFactory', function () {
    var cleanUp = function cleanUp(obj) {
      Object.keys(obj).map(function (key) {
        if (obj[key]) {
          if (obj[key].constructor.name == 'Object') {
            cleanUp(obj[key]);
          } else {
            obj[key] = null;
            delete obj[key];
          }
        }
      });
    };

    var destroyListener = function destroyListener(attrs) {
      attrs.scope.$on('$destroy', function () {
        attrs.objects.map(cleanUp);
        cleanUp(attrs);
      });
    };

    return destroyListener;
  });
})();

'use strict';

(function () {
  angular.module('factories.error-message', ['factories.error-message.config']).factory('errorMessage', function () {
    var getErrorType = function getErrorType(status) {
      var type;

      if (!navigator.onLine) {
        return 'offline';
      }

      switch (status) {
        case -1:
          type = 'offline';
          break;

        case 401:
          type = 'requestUserAuthentication';
          break;

        case 403:
          type = 'forbidden';
          break;

        case 400:
        case 404:
        case 422:
          type = 'payloadError';
          break;

        case 500:
        default:
          type = 'serverError';
          break;
      }

      return type;
    };

    return {
      getErrorType: getErrorType
    };
  });
})();

'use strict';

(function () {
  angular.module('factories.favico', []).factory('favicoFactory', function () {
    var bgColors = {
      clients: '#ff5a5f',
      chat: '#348e6d'
    };
    var favicons = [];
    var links = document.querySelectorAll('head link[rel=icon]');

    for (var i = 0; i < links.length; i++) {
      var image = new Image();
      image.src = angular.element(links[i]).attr('href');
      favicons.push({
        element: links[0],
        image: image
      });
    }

    var getFavico = function getFavico(favicon, totalClients) {
      var bgColor = totalClients.chat ? bgColors.chat : bgColors.clients;

      if (favicon.favico) {
        favicon.favico.reset();
      }

      var favicoObj = new Favico({
        animation: 'none',
        bgColor: bgColor,
        element: favicon.element,
        image: favicon.image
      });

      if (totalClients.chat) {
        favicoObj.badge(totalClients.chat);
      } else if (totalClients.clients) {
        favicoObj.badge(totalClients.clients);
      }

      return favicoObj;
    };

    var set = function set(totalClients) {
      favicons.map(function (favicon) {
        favicon.favico = getFavico(favicon, totalClients);
      });
    };

    return {
      set: set
    };
  });
})();

'use strict';

(function () {
  angular.module('factories.http-interceptor', []).factory('httpInterceptor', function ($q, $rootScope, $location, authCookieFactory, urls, errorMessage, defaultErrorMessages) {
    var matchApiHost = new RegExp(urls.apiHost);

    var mergeFriendlyMessage = function mergeFriendlyMessage(response, type) {
      if (matchApiHost.test(response.config.url)) {
        var friendlyMessageObj = {};
        response.data = response.data || {};
        friendlyMessageObj[type] = response.data.friendlyMessage || {}; // normalize

        angular.merge(response.config, {
          toastrMessages: {}
        });

        if (response.config.toastrMessages[type] !== null) {
          angular.merge(response.config, response.data.friendlyMessage ? {
            toastrMessages: friendlyMessageObj
          } : {});
        }

        delete response.data.friendlyMessage;
        dispatchToastrBroadcast(response, type);
        setResponseConfigErrorMessage(response, type);
      }
    };

    var dispatchToastrBroadcast = function dispatchToastrBroadcast(response, type) {
      if (type != 'success' && response.config.toastrMessages[type] !== null && !(response.config.toastrMessages[type] || {}).onlyErrorMessage || type == 'success' && response.config.toastrMessages.success) {
        $rootScope.$broadcast('factories.toastr.' + type, response);
      }
    };

    var setResponseConfigErrorMessage = function setResponseConfigErrorMessage(response, type) {
      if (type != 'success') {
        var errorMessage = angular.merge(defaultErrorMessages[type] || {}, response.config.toastrMessages[type] || {});
        response.config.errorMessage = errorMessage;
      }
    };

    return {
      request: function request(config) {
        if (matchApiHost.test(config.url)) {
          var hasCookieChangedToOtherUser = authCookieFactory.checkCookie();

          if (hasCookieChangedToOtherUser) {
            return $q.reject(config);
          }
        }

        return config;
      },
      response: function response(_response) {
        mergeFriendlyMessage(_response, 'success');
        return _response;
      },
      responseError: function responseError(response) {
        console.log('http-interceptor.responseError');
        console.log(response);
        var errorType = errorMessage.getErrorType(response.status);

        if (response.status == 401) {
          $rootScope.$broadcast('requestUserAuthentication', response);
        } else {
          mergeFriendlyMessage(response, errorType);
        }

        return $q.reject(response);
      }
    };
  });
})();

'use strict';

(function () {
  angular.module('factories.moment', []).factory('momentFactory', function () {
    // duration time threshold
    moment.relativeTimeThreshold('s', 60);
    moment.relativeTimeThreshold('m', 60);
    moment.relativeTimeThreshold('h', 24);
    moment.relativeTimeThreshold('d', 30);
    moment.relativeTimeThreshold('M', 12);
    var humanizeUnitsSequence = ['years', 'months', 'days', 'hours', 'minutes'];

    var getMomentHumanize = function getMomentHumanize(momentObj, sequence, size) {
      if (humanizeUnitsSequence[sequence] && size > 0) {
        if (momentObj._data[humanizeUnitsSequence[sequence]] > 0) {
          var humanize = moment.duration(momentObj._data[humanizeUnitsSequence[sequence]], humanizeUnitsSequence[sequence]).locale('pt-br').humanize();
          var nextSequence = getMomentHumanize(momentObj, sequence + 1, --size);
          return humanize + (nextSequence ? ' e ' + nextSequence : '');
        } else {
          return getMomentHumanize(momentObj, sequence + 1, size);
        }
      } else {
        return '';
      }
    };

    var getDuration = function getDuration(length, unit) {
      var duration = moment.duration(length, unit);
      duration.humanize = getMomentHumanize(duration, 0, 2);
      return duration;
    };

    var factory = {
      getDuration: getDuration
    };
    return factory;
  });
})();

'use strict';

(function () {
  angular.module('factories.toastr', []).factory('toastrFactory', function ($rootScope, toastr, defaultErrorMessages) {
    var success = function success(attrs) {
      return toastr.success(attrs.message, attrs.title, angular.merge({
        autoDismiss: true
      }, attrs, typeof attrs.autoDismiss != 'undefined' && !attrs.autoDismiss ? {
        timeOut: 0,
        closeButton: true
      } : {}));
    };

    var error = function error(attrs) {
      return toastr.error(attrs.message, attrs.title, angular.merge({
        timeOut: 0,
        autoDismiss: false,
        closeButton: true
      }, attrs));
    };

    var warn = function warn(attrs) {
      return toastr.warning(attrs.message, attrs.title, angular.merge({
        timeOut: 0,
        autoDismiss: false,
        closeButton: true
      }, attrs, attrs.autoDismiss ? {
        timeOut: 5000,
        closeButton: false
      } : {}));
    };

    var info = function info(attrs) {
      return toastr.info(attrs.message, attrs.title, angular.merge({
        autoDismiss: true,
        closeButton: true
      }, attrs, typeof attrs.autoDismiss != 'undefined' && !attrs.autoDismiss ? {
        timeOut: 0
      } : {}));
    };

    var setOptionsBeforeShow = function setOptionsBeforeShow(response, type) {
      var configToastrMessage = response.config.toastrMessages[type];

      if (configToastrMessage && configToastrMessage.setOptions) {
        angular.merge(configToastrMessage, configToastrMessage.setOptions(response.data));
      }
    }; // factories.toastr.success


    $rootScope.$on('factories.toastr.success', function (event, response) {
      response.config.toastrMessages = response.config.toastrMessages || {};
      setOptionsBeforeShow(response, 'success');
      success(angular.merge({}, defaultErrorMessages.success, response.config.toastrMessages.success || {}));
    }); // factories.toastr.forbidden

    $rootScope.$on('factories.toastr.forbidden', function (event, response) {
      response.config.toastrMessages = response.config.toastrMessages || {};
      setOptionsBeforeShow(response, 'forbidden');
      error(angular.merge({}, defaultErrorMessages.forbidden, response.config.toastrMessages.forbidden || {}));
    }); // factories.toastr.payloadError

    $rootScope.$on('factories.toastr.payloadError', function (event, response) {
      response.config.toastrMessages = response.config.toastrMessages || {};
      setOptionsBeforeShow(response, 'payloadError');
      warn(angular.merge({}, defaultErrorMessages.payloadError, response.config.toastrMessages.payloadError || {}));
    }); // factories.toastr.serverError

    $rootScope.$on('factories.toastr.serverError', function (event, response) {
      response.config.toastrMessages = response.config.toastrMessages || {};
      setOptionsBeforeShow(response, 'serverError');
      error(angular.merge({}, defaultErrorMessages.serverError, response.config.toastrMessages.serverError || {}));
    }); // factories.toastr.offLine

    $rootScope.$on('factories.toastr.offline', function (event, response) {
      response.config.toastrMessages = response.config.toastrMessages || {};
      setOptionsBeforeShow(response, 'offline');
      error(angular.merge({}, defaultErrorMessages.offline));
    });
    var factory = {
      success: success,
      error: error,
      warn: warn,
      info: info
    };
    return factory;
  });
})();

'use strict';

(function () {
  angular.module('factories.user-status', []).constant('pendingProcessingUserStatus', 'pendingProcessingServiceChannel').constant('userStatusBroadcastName', 'factories.user-status.broadcast').constant('userStatusLabels', {
    chat: 'Chat',
    others: 'Outros',
    phone: 'Telefonia'
  }).constant('userStatusValuesProperties', {
    enabled: {
      status: 'isAllowed',
      label: 'Permitido'
    },
    disabled: {
      status: 'notAllowed',
      label: 'inativo'
    },
    offline: {
      status: 'offline',
      label: 'Offline'
    },
    online: {
      status: 'online',
      label: 'Online'
    },
    paused: {
      status: 'pause',
      label: 'Pausado'
    }
  }).constant('userQueueStatusProperties', {
    Online: {
      label: 'Online',
      icon: 'thumb-up'
    },
    Pausa: {
      label: 'Pausa',
      icon: 'pause-button-circle-filled'
    },
    NaoResponde: {
      label: 'Sem conexão',
      icon: 'cloud-error-filled'
    }
  }).run(function (notificationCenterFactory, userStatusFactory, pendingProcessingUserStatus, firebaseCollections) {
    notificationCenterFactory.registerToGetNotifications({
      collection: [firebaseCollections.pendingProcessing],
      service: userStatusFactory,
      types: [pendingProcessingUserStatus]
    });
  }).factory('userStatusFactory', function ($rootScope, $timeout, $filter, mainController, permission, pendingProcessingUserStatus, userStatusBroadcastName, usersStatusService, userStatusValuesProperties) {
    var valuePropertieByStatus = {};
    Object.keys(userStatusValuesProperties).map(function (key) {
      valuePropertieByStatus[userStatusValuesProperties[key].status] = userStatusValuesProperties[key].label;
    });
    var availableChannels = [];

    if (mainController.getDevice() == 'desktop') {
      availableChannels = availableChannels.concat([{
        key: 'channelChat',
        channel: 'chat',
        permission: 'chat_atender',
        permissionPositionInQueue: 'chat_visualizar_ordem_fila',
        permissionHandlerPositionInQueue: 'chat_mudar_ordem_fila',
        hasPausedStatus: true,
        canUserChange: true
      }]);
    }

    availableChannels = availableChannels.concat([{
      key: 'channelOthers',
      channel: 'others',
      permission: null,
      canUserChange: true
    }, {
      key: 'channelActiveOffer',
      channel: 'activeOffer',
      permission: null,
      canUserChange: false
    }, {
      key: 'channelPhone',
      channel: 'phone',
      permission: null,
      canUserChange: true,
      additionalOption: 'telefoneNumeroFull',
      customValueLabel: function customValueLabel() {
        var channelServiceData = getChannelServiceData(this.channel);

        if (channelServiceData[this.additionalOption]) {
          return $filter('mask')(channelServiceData[this.additionalOption], 'tel');
        } else {
          return getValuePropertieByStatus(channels[this.channel]);
        }
      }
    }]);
    var channelsServiceData = {};
    var channels = {};
    var channelsByName = {};
    var channelsByKey = {};
    var channelsNextPosition = {};
    var statuses = {
      noChannelsAvailable: true,
      channels: channels,
      overall: false
    };

    var isEnabled = function isEnabled(name) {
      var key = channelsByName[name].key;
      return channelsServiceData[key][userStatusValuesProperties.enabled.status];
    };

    var isDisabled = function isDisabled(name) {
      return channels[name] == userStatusValuesProperties.disabled.status;
    };

    var isOnline = function isOnline(name) {
      return channels[name] == userStatusValuesProperties.online.status;
    };

    var isOffline = function isOffline(name) {
      return channels[name] == userStatusValuesProperties.offline.status;
    };

    var isPaused = function isPaused(name) {
      return channels[name] == userStatusValuesProperties.paused.status;
    };

    var canUserChange = function canUserChange(name) {
      return channelsByName[name].canUserChange;
    };

    var canBePaused = function canBePaused(name) {
      return channelsByName[name].hasPausedStatus;
    };

    var getUserStatusFromService = function getUserStatusFromService() {
      usersStatusService.getCurrentUser({
        success: function success(response) {
          createChannels();
          setChannels(response.data.fields.channel);
        }
      });
    };

    var getValuePropertieByStatus = function getValuePropertieByStatus(status) {
      return valuePropertieByStatus[status];
    };

    var getChannelValueLabel = function getChannelValueLabel(channel) {
      var label;
      var channelProperties = getChannelProperties(channel);

      if (channelProperties.customValueLabel) {
        label = channelProperties.customValueLabel();
      } else {
        label = getValuePropertieByStatus(channels[channel]);
      }

      return label;
    };

    var createChannelByPermission = function createChannelByPermission(channel, permissionKey) {
      if (!permissionKey || permission.checkPermissions(permissionKey)) {
        // channels[channel] = cache.get(channel) || false;
        channels[channel] = userStatusValuesProperties.offline.status;
        statuses.noChannelsAvailable = false;
      }
    };

    var createChannels = function createChannels() {
      availableChannels.map(function (channel) {
        createChannelByPermission(channel.channel, channel.permission);

        if (_typeof(channels[channel.channel]) != undefined) {
          channelsByKey[channel.key] = channel.channel;
          channelsByName[channel.channel] = channel;
        }
      });
    };

    var getOverall = function getOverall() {
      var status = false;

      for (var key in channels) {
        if (isOnline(key) && canUserChange(key)) {
          status = true;
          break;
        }
      }

      return status;
    };

    var broadcastStatus = function broadcastStatus() {
      $rootScope.$broadcast(userStatusBroadcastName, get());
    };

    var getChannelServiceData = function getChannelServiceData(channel) {
      return channelsServiceData[channelsByName[channel].key];
    };

    var getChannelProperties = function getChannelProperties(channel) {
      return channelsByName[channel];
    };

    var getChannelsByKey = function getChannelsByKey(key) {
      return channelsByKey[key];
    };

    var get = function get() {
      statuses.overall = getOverall();
      return statuses;
    };

    var channelServicePatch = function channelServicePatch(channel, status, additionalOption) {
      var channelParam = {};
      channelParam[channelsByName[channel].key] = {
        status: status
      };

      if (additionalOption) {
        angular.merge(channelParam[channelsByName[channel].key], additionalOption);
      }

      var revertChannelServiceData = angular.copy(channelsServiceData[channelsByName[channel].key]);
      usersStatusService.patchCurrentUser({
        data: {
          channel: channelParam
        },
        success: function success(response) {
          setChannels(response.data.fields.channel);
        },
        error: function error() {
          channels[channel] = userStatusValuesProperties.offline.status;
          channelsServiceData[channelsByName[channel].key] = revertChannelServiceData;
        }
      });
    };

    var set = function set(channel, status, additionalOption) {
      if (typeof channels[channel] !== 'undefined' && canUserChange(channel)) {
        // cache.put(channel, status);
        channelServicePatch(channel, status, additionalOption);
        channels[channel] = status;

        if (additionalOption) {
          angular.merge(getChannelServiceData(channel), additionalOption);
        }
      }
    };

    var setChannels = function setChannels(dataChannels) {
      Object.keys(dataChannels).map(function (key) {
        channelsServiceData[key] = dataChannels[key];

        if (typeof channels[channelsByKey[key]] != 'undefined') {
          channels[channelsByKey[key]] = dataChannels[key][userStatusValuesProperties.enabled.status] ? dataChannels[key].status : userStatusValuesProperties.disabled.status;
        }
      });
      console.log('factories.user-status.setChannels()', channels, channelsServiceData);
    };

    var normalizeCollection = function normalizeCollection(collection) {
      collection[pendingProcessingUserStatus] = collection[pendingProcessingUserStatus] || {};
      angular.merge(collection[pendingProcessingUserStatus], {
        fields: {
          channel: {}
        }
      });
    };

    var getNextPositionInQueues = function getNextPositionInQueues(channel) {
      if (isOnline(channel) || isPaused(channel)) {
        return channelsNextPosition[channel];
      }

      return null;
    };

    var setNextPositionInQueues = function setNextPositionInQueues(channel, nextPosition) {
      channelsNextPosition[channel] = nextPosition;
    };

    var dispatch = function dispatch(collection) {
      console.log(['factories.user-status.dispatch()', collection]);
      collection = collection || {};
      normalizeCollection(collection);
      var dataChannels = collection[pendingProcessingUserStatus].fields.channel;
      setChannels(dataChannels);
      broadcastStatus();
    };

    getUserStatusFromService();
    var factory = {
      get: get,
      set: set,
      getChannelsByKey: getChannelsByKey,
      getChannelValueLabel: getChannelValueLabel,
      getChannelServiceData: getChannelServiceData,
      getChannelProperties: getChannelProperties,
      isEnabled: isEnabled,
      isDisabled: isDisabled,
      isOnline: isOnline,
      isOffline: isOffline,
      isPaused: isPaused,
      canBePaused: canBePaused,
      canUserChange: canUserChange,
      getNextPositionInQueues: getNextPositionInQueues,
      setNextPositionInQueues: setNextPositionInQueues,
      dispatch: dispatch
    };
    return factory;
  });
})();

'use strict';

(function () {
  angular.module('ngMask').filter('mask', ['MaskService', function (MaskService) {
    return function (value, pMask) {
      var regex;

      switch (pMask) {
        case 'cpf':
          regex = '999.999.999-99';
          break;

        case 'cnpj':
          regex = '99.999.999/9999-99';
          break;

        case 'cep':
          regex = '99.999-999';
          break;

        case 'tel':
          if (value.length == 8 || value.length == 9) {
            regex = '9?9999-9999'; //Sem DDD
          } else {
            regex = '(99) 9?9999-9999'; //Com DDD
          }

          break;

        case 'date':
          regex = '39/19/2999';
          break;

        default:
          regex = pMask;
          break;
      }

      var maskService = MaskService.create();
      maskService.generateRegex({
        mask: regex
      }); //var options = maskService.getOptions();

      var viewValue = maskService.getViewValue(value); //Valor com os divisores da mascara

      var viewValueWithDivisors = viewValue.withDivisors(true); //Valor sem os divisores da mascara
      //var viewValueWithoutDivisors = viewValue.withoutDivisors(true);

      return viewValueWithDivisors;
    };
  }]);
})();

'use strict';

(function () {
  // custom and VERY complex address field
  // do not touch it before talk to roberto@anapro.com
  var formatter = function formatter(newValue) {
    if (newValue[0]) {
      delete newValue[0];
    }

    return newValue;
  };

  angular.module('anapro.formly.address-input', []).config(function (formlyConfigProvider) {
    var controller = function controller($rootScope, $scope, $http, $q, $timeout, $tooltip, urls) {
      $rootScope, $scope, $http, $q, urls;
      $scope.loading = false; // tooltip

      $timeout(function () {
        if ($scope.options.ngModelElAttrs && $scope.options.ngModelElAttrs['bs-tooltip']) {
          $tooltip($scope.addressForm.$$parentForm.$$element, $scope.options.data.tooltip);
        }
      }, 0);
      var properties = {
        street: 'enderecoLogradouro',
        number: 'enderecoNumero',
        neighborhoodId: 'enderecoBairroId',
        neighborhood: 'enderecoBairroNome',
        state: 'enderecoUF',
        cityId: 'enderecoCidadeId',
        city: 'enderecoCidadeNome',
        zipcode: 'enderecoCEP',
        street2: 'enderecoComplemento',
        info: 'enderecoObs'
      };

      if ($scope.options.data.properties) {
        angular.extend(properties, $scope.options.data.properties);
      }

      var defaultValue = angular.copy($scope.options.defaultValue || {});
      $scope.addressModel;
      $scope.addressForm;
      $scope.addressFormOptions;
      $scope.options.formatters = [formatter];
      var model;

      if ($scope.options.key) {
        $scope.addressModel = $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || {};
      } else {
        $scope.addressModel = $scope.model = $scope.model || {};
      }

      model = $scope.addressModel;

      if (defaultValue[properties.street] && !model[properties.street]) {
        angular.extend(model, defaultValue);
      }

      $scope.getPropertie = function (propertie) {
        return $scope.addressModel[properties[propertie]];
      };

      formatter(model);

      if ($scope.to.required && $scope.to.label) {
        $scope.to.label = $scope.to.label + '*';
      }

      $scope.options.resetModel = function () {
        $scope.addressFormOptions.resetModel();
      };

      var setFullAddress = function setFullAddress(data) {
        var fields = data.fields || {};
        model[properties.street] = fields.localidadeLogradouro;
        model[properties.neighborhoodId] = fields.localidadeBairroId;
        model[properties.neighborhood] = fields.localidadeBairroNome;
        model[properties.state] = fields.localidadeUF;
        model[properties.cityId] = fields.localidadeCidadeId;
        model[properties.city] = fields.localidadeCidadeNome;
        $scope.loading = false;
      };

      $scope.formAddressOptions = {};

      var getCEP = function getCEP($modelValue) {
        if ($modelValue) {
          $scope.loading = true;
          return $http({
            url: urls.apiHost + urls.apiPaths.utilsCEP + '/' + $modelValue,
            method: 'get',
            toastrMessages: {
              payloadError: null
            }
          }).then(function (response) {
            setFullAddress(response.data);
            return true;
          }, function () {
            setFullAddress({});
            return $q.reject();
          });
        } else {
          return $q.reject();
        }
      };

      var setModelEmptyWhenZipcodeIsBlankAndNotRequired = function setModelEmptyWhenZipcodeIsBlankAndNotRequired() {
        Object.keys($scope.addressModel).map(function (key) {
          delete $scope.addressModel[key];
        });
        $timeout(function () {
          delete $scope.addressModel[properties.zipcode];
        }, 0);
      };

      $scope.fields = [{
        type: 'zipcode',
        key: properties.zipcode,
        // defaultValue: defaultValue[properties.zipcode],
        ngModelAttrs: {
          autocomplete: {
            attribute: 'autocomplete'
          }
        },
        elementAttributes: {
          'flex-xs': '40',
          'flex-gt-xs': '20'
        },
        templateOptions: {
          noErrorSpace: true,
          autocomplete: false,
          type: 'tel',
          required: $scope.to.required || false,
          placeholder: 'CEP',
          mask: '99999-999'
        },
        modelOptions: {
          debounce: 200
        },
        asyncValidators: {
          cep: {
            expression: function expression($viewValue, $modelValue, scope) {
              $viewValue, $modelValue, scope;

              if (!$modelValue && !scope.options.templateOptions.required) {
                setModelEmptyWhenZipcodeIsBlankAndNotRequired();
                return $q.resolve();
              } else if (scope.fc && scope.fc.$error.mask) {
                setFullAddress({});
                return $q.reject();
              } else {
                if (!model[properties.street] || model[properties.zipcode] != $modelValue) {
                  return getCEP($modelValue);
                } else {
                  return $q.resolve();
                }
              }
            }
          }
        }
      }, {
        type: 'input',
        key: properties.number,
        elementAttributes: {
          'flex-xs': '25',
          'flex-gt-xs': '15'
        },
        templateOptions: {
          noErrorSpace: true,
          maxlength: 15,
          placeholder: $rootScope.mainController.device == 'desktop' ? 'Número' : 'N°'
        }
      }, {
        type: 'input',
        key: properties.street2,
        elementAttributes: {
          'flex-xs': '30',
          'flex-gt-xs': '25'
        },
        templateOptions: {
          noErrorSpace: true,
          placeholder: 'Complemento'
        }
      }, {
        type: 'input',
        key: properties.info,
        elementAttributes: {
          'flex-xs': '100',
          'flex-gt-xs': '35'
        },
        templateOptions: {
          noErrorSpace: true,
          placeholder: 'Observação'
        }
      }];
      $scope.zipcode = $scope.fields[0];
    };

    formlyConfigProvider.setType([{
      name: 'zipcode',
      extends: 'input',
      defaultOptions: {
        ngModelAttrs: {
          mask: {
            attribute: 'mask'
          },
          restrict: {
            attribute: 'restrict'
          },
          clean: {
            attribute: 'clean'
          }
        },
        templateOptions: {
          restrict: 'reject',
          clean: true
        }
      }
    }, {
      name: 'address',
      templateUrl: 'formly-templates/address.html',
      controller: controller,
      defaultOptions: {
        validation: {
          messages: {
            required: '"Endereço é obrigatório"',
            mask: '"CEP Inválido"',
            cep: '"CEP não existe"'
          }
        }
      }
    }]);
  });
})();

'use strict';

(function () {
  angular.module('anapro.formly.date-input', []).run(function (formlyConfig, mainController, $filter, anaproFormlyFactory) {
    var device = mainController.getDevice(),
        parseDate = anaproFormlyFactory.parseDate,
        formatterDate = anaproFormlyFactory.formatterDate;

    var controller = function controller($scope, $timeout) {
      $scope.options.ngModelElAttrs = $scope.options.ngModelElAttrs || {};

      if (device == 'desktop' && $scope.options.templateOptions.type == 'month') {
        $scope.options.templateOptions.type = 'text';
        $scope.options.ngModelElAttrs['data-min-view'] = '1';
        $scope.options.ngModelElAttrs['data-date-format'] = 'MM/yyyy';
      }

      $scope.options.resetModel = function () {
        if (/date|month/.test($scope.options.templateOptions.type)) {
          $scope.options.parsers = [parseDate];
          $scope.options.formatters = [formatterDate];
          $scope.model[$scope.options.key] = null;
        }

        $timeout(function () {
          if ($scope.options.defaultValue) {
            $scope.model[$scope.options.key] = $filter('date')($scope.options.defaultValue, $scope.options.templateOptions.dateFormat);
          }
        }, 0);
      };

      parseDate, formatterDate;
      $scope.options.resetModel();

      $scope.iconClick = function ($event) {
        $($event.target).closest('.form-input-extras').find('input').focus();
      };
    };

    formlyConfig.setType({
      name: 'anaproDate',
      extends: 'input',
      controller: controller,
      defaultOptions: {
        ngModelAttrs: {
          off: {
            value: 'autocomplete'
          },
          datePicker: {
            attribute: 'bs-datepicker'
          },
          autoclose: {
            attribute: 'autoclose'
          },
          dateFormat: {
            attribute: 'data-model-Date-Format'
          },
          dateType: {
            attribute: 'data-date-type'
          },
          min: {
            attribute: 'data-min-date'
          },
          max: {
            attribute: 'data-max-date'
          },
          datePickerOnHide: {
            attribute: 'bs-on-hide'
          },
          datePickerOnBeforeHide: {
            attribute: 'bs-on-before-hide'
          },
          datePickerOnBeforeShow: {
            attribute: 'bs-on-before-show'
          }
        },
        templateOptions: function () {
          var to = {
            type: 'date'
          };

          if (device == 'desktop') {
            to = {
              type: 'text',
              dateType: 'string',
              datePicker: true,
              autoclose: true
            };
          }

          angular.extend(to, {
            dateFormat: 'yyyy-MM-ddTHH:mm:ss'
          });
          return to;
        }(),
        validators: {
          max: {
            expression: function expression(viewValue, modelValue, scope) {
              viewValue, modelValue, scope;

              if (!scope.options.templateOptions.max || !modelValue) {
                return true;
              }

              var max = new Date(scope.options.templateOptions.max);
              var value = new Date(modelValue);
              return value.getTime() <= max.getTime();
            }
          },
          min: {
            expression: function expression(viewValue, modelValue, scope) {
              viewValue, modelValue, scope;

              if (!scope.options.templateOptions.min || !modelValue) {
                return true;
              }

              var min = new Date(scope.options.templateOptions.min);
              var value = new Date(modelValue);
              return value.getTime() >= min.getTime();
            }
          }
        },
        validation: {
          messages: {
            max: function max(newValue, oldValue, scope) {
              var maxDate = anaproFormlyFactory.getDateFromString(scope.to.max);
              return scope.to.label + ' precisa ser menor ou igual que ' + maxDate.getDate() + '/' + (maxDate.getMonth() + 1) + '/' + maxDate.getFullYear();
            },
            min: function min(newValue, oldValue, scope) {
              var minDate = anaproFormlyFactory.getDateFromString(scope.to.min);
              return scope.to.label + ' precisa ser maior ou igual que ' + minDate.getDate() + '/' + (minDate.getMonth() + 1) + '/' + minDate.getFullYear();
            }
          }
        }
      }
    });
  });
})();

'use strict';

(function () {
  angular.module('anapro.formly.datetime-input', []).run(function (formlyConfig, mainController, $filter, anaproFormlyFactory) {
    var device = mainController.getDevice(),
        parseDate = anaproFormlyFactory.parseDate,
        formatterDate = anaproFormlyFactory.formatterDate;

    var controller = function controller($scope, $timeout) {
      if (device == 'desktop') {
        $scope.dateTimeForm = null;
        $scope.dateTimeFields = [{
          key: $scope.options.key,
          type: 'anaproDate',
          defaultValue: anaproFormlyFactory.getDateFromString($scope.options.defaultValue),
          templateOptions: {
            icon: 'calendar',
            dateFormat: $scope.options.templateOptions.dateFormat,
            noErrorSpace: true
          }
        }, {
          elementAttributes: {
            'flex': '5'
          },
          template: '<div></div>'
        }, {
          key: $scope.options.key,
          type: 'anaproTime',
          defaultValue: anaproFormlyFactory.getDateFromString($scope.options.defaultValue),
          templateOptions: {
            icon: 'clock',
            dateFormat: $scope.options.templateOptions.dateFormat,
            noErrorSpace: true
          }
        }];
      }

      $scope.options.resetModel = function () {
        if ($scope.options.templateOptions.type == 'datetime-local') {
          $scope.options.parsers = [parseDate];
          $scope.options.formatters = [formatterDate];
          $scope.model[$scope.options.key] = null;
        }

        $timeout(function () {
          $scope.model[$scope.options.key] = $filter('date')(anaproFormlyFactory.getDateFromString($scope.options.defaultValue), $scope.options.templateOptions.dateFormat);
        }, 0);
      };

      $scope.options.resetModel();
    };

    var field = {
      name: 'anaproDateTime',
      extends: 'input',
      controller: controller,
      defaultOptions: {
        templateOptions: {
          dateFormat: 'yyyy-MM-ddTHH:mm:ss'
        },
        validators: {
          max: {
            expression: function expression(viewValue, modelValue, scope) {
              if (!scope.options.templateOptions.max || !modelValue) {
                return true;
              }

              var max = anaproFormlyFactory.getDateFromString(scope.options.templateOptions.max);
              var value = anaproFormlyFactory.getDateFromString(modelValue);
              return value.getTime() <= max.getTime();
            }
          },
          min: {
            expression: function expression(viewValue, modelValue, scope) {
              if (!scope.options.templateOptions.min || !modelValue) {
                return true;
              }

              var min = anaproFormlyFactory.getDateFromString(scope.options.templateOptions.min);
              var value = anaproFormlyFactory.getDateFromString(modelValue);
              return value.getTime() >= min.getTime();
            }
          }
        },
        validation: {
          messages: {
            max: function max(newValue, oldValue, scope) {
              var maxDate = anaproFormlyFactory.getDateFromString(scope.to.max);
              return scope.to.label + ' precisa ser menor ou igual que ' + $filter('date')(maxDate, 'dd/MM/yy HH:mm');
            },
            min: function min(newValue, oldValue, scope) {
              var minDate = anaproFormlyFactory.getDateFromString(scope.to.min);
              return scope.to.label + ' precisa ser maior ou igual que ' + $filter('date')(minDate, 'dd/MM/yy HH:mm');
            }
          }
        }
      }
    };

    if (device == 'desktop') {
      field.templateUrl = 'formly-templates/datetime-input.html';
    } else {
      field.defaultOptions.templateOptions.type = 'datetime-local';
    }

    formlyConfig.setType(field);
  });
})();

'use strict';

(function () {
  angular.module('anapro.formly.multi-input', []).config(function (formlyConfigProvider) {
    var controller = function controller($scope, $timeout) {
      var isReady = false;
      $timeout(function () {
        isReady = true;
      });
      var isArrayOfValues = $scope.options.data.isArrayOfValues;
      var keepKey = $scope.options.data.keepOnRemoveWhenContainsKey;
      var defaultValue = angular.copy($scope.options.defaultValue || []);
      var originalDefaultValue = angular.copy(defaultValue);
      var multiTypesFields = $scope.options.data.fieldsByType || null;

      if (defaultValue) {
        $scope.model[$scope.options.key] = angular.copy(defaultValue);
      }

      var getDefaultValue = function getDefaultValue() {
        if (isReady) {
          return defaultValue;
        } else {
          return originalDefaultValue;
        }
      };

      $scope.form.multiInputForms = {};
      $scope.options.multiInputFields = []; // sync child multiInputForms $submitted propertie same of its parent form
      // please, be very carefully when change this code

      var setMultiInputForms = function setMultiInputForms(form) {
        var multiInputForms = form.multiInputForms[$scope.options.key];
        var forms = Object.keys(multiInputForms || {});
        forms.map(function (index) {
          multiInputForms[index].$submitted = true;

          if (multiInputForms[index].multiInputForms) {
            setMultiInputForms(multiInputForms[index]);
          }
        });
      };

      var submitListenerMultiinputs = function submitListenerMultiinputs() {
        $timeout(function () {
          setMultiInputForms($scope.form);
        }, 0);
      };

      if (!isArrayOfValues) {
        angular.element($scope.form.$$element).on('submit', submitListenerMultiinputs);
      } // end sync submitted


      var model = $scope.model[$scope.options.key];
      $scope.modelMultiinput = model; // please, if you need change anything here talk to roberto@anapro before
      // This reset will delete the model and multi input forms
      // Then, it will create model based on a copy of defaultValue

      $scope.options.resetModel = function () {
        delete $scope.form.multiInputForms[$scope.options.key];
        $scope.options.fields.splice(0, $scope.options.fields.length);
        setAndCleanUPModel(originalDefaultValue);
      };

      var setAndCleanUPModel = function setAndCleanUPModel(value) {
        defaultValue = angular.copy(value); // $scope.options.fields.splice(0, $scope.options.fields.length);

        model.splice(0, model.length);
        delete $scope.form.multiInputForms[$scope.options.key];
        $timeout(function () {
          defaultValue.map(function (item) {
            model.push(item);
          });
        });
      }; // old resetModel reseting by fields
      // $scope.options.resetModel = function(){
      // 	if(model.constructor == Array
      // 		&& model.length
      // 		&& $scope.options.fields.length > defaultValue.length
      // 	){
      // 		model.splice(defaultValue.length, model.length);
      // 		$scope.options.fields.splice(defaultValue.length, model.length);
      // 	}
      // 	$scope.options.fields.map(function(fields, index){
      // 		if(model[index]){
      // 			anaproFormlyFactory.resetModel(
      // 				fields,
      // 				model[index]
      // 			);
      // 		}
      // 	});
      // };


      $scope.options.fields = [];

      var setFieldsDefaultValue = function setFieldsDefaultValue(fields, defaultValueModel) {
        fields.map(function (field) {
          if (field) {
            if (!field.key || !isNaN(field.key)) {
              field.defaultValue = defaultValueModel;
            } else {
              field.defaultValue = defaultValueModel[field.key];
            }
          }
        });
      };

      var multiTypesSelectOptions = [];

      if (multiTypesFields) {
        Object.keys(multiTypesFields).map(function (key) {
          multiTypesSelectOptions.push({
            name: multiTypesFields[key][0].templateOptions.optionLabel || key,
            value: key
          });
        });
      }

      var getMultiTypesSelectUniqueValidator = {
        expression: function expression(viewValue, modelValue) {
          if (!$scope.options.data.fieldTypeKeyUnique) {
            return true;
          }

          var value = $scope.model[$scope.options.key];
          var fieldType = $scope.options.data.fieldTypeKey;
          var typesCount = 0;
          value.map(function (item) {
            if (item[fieldType] == modelValue) {
              typesCount++;
            }
          });
          return typesCount < 2;
        },
        message: function message(viewValue) {
          var desc = viewValue;

          if (multiTypesFields[viewValue][0] && multiTypesFields[viewValue][0].templateOptions) {
            desc = multiTypesFields[viewValue][0].templateOptions.optionLabel || desc;
          }

          return 'É permitido apenas um ' + desc + '.';
        }
      };

      var getMultiTypesSelect = function getMultiTypesSelect(key, index, fieldsBasedOnModel) {
        return {
          key: key,
          type: 'select',
          className: 'multi-type-select',
          ngModelElAttrs: fieldsBasedOnModel[0].ngModelElAttrs,
          templateOptions: {
            required: true,
            notNull: true,
            options: multiTypesSelectOptions,
            onChange: function onChange() {
              $scope.options.multiInputFields[index].splice(0, $scope.options.multiInputFields[index].length);
              var fields = getMultiTypeFieldsBasedOnModel(index);
              angular.extend($scope.options.multiInputFields[index], fields);
            }
          },
          expressionProperties: fieldsBasedOnModel[0].expressionProperties,
          validators: {
            getMultiTypesSelectUniqueValidator: getMultiTypesSelectUniqueValidator
          }
        };
      };

      var getMultiTypesFieldBasedOnModelValue = function getMultiTypesFieldBasedOnModelValue(fieldType, value) {
        var field = angular.copy(multiTypesFields[value[fieldType]]);

        if (!field) {
          return null;
        }

        return field;
      };

      var getMultiTypeFieldsBasedOnModel = function getMultiTypeFieldsBasedOnModel(index) {
        var value = $scope.model[$scope.options.key][index];
        var fieldType = $scope.options.data.fieldTypeKey;
        var fieldsBasedOnModel = getMultiTypesFieldBasedOnModelValue(fieldType, value);
        var fields = [getMultiTypesSelect(fieldType, index, fieldsBasedOnModel)];

        if (fieldsBasedOnModel) {
          fields = fields.concat(fieldsBasedOnModel);
        } else {
          fields = [];
        }

        $timeout(function () {
          fields[0].formControl.$touched = true;
          fields[0].formControl.$untouched = false;
        });
        return fields;
      };

      $scope.hasMatchFields = function (index) {
        // is not a multi types fields
        if (!multiTypesFields) {
          return true;
        }

        var value = $scope.model[$scope.options.key][index];
        var fieldType = $scope.options.data.fieldTypeKey;
        return !!multiTypesFields[value[fieldType]];
      };

      $scope.getFields = function (index) {
        if (!isArrayOfValues) {
          $timeout(function () {
            $scope.options.data.multiInputForms = $scope.form.multiInputForms[$scope.options.key];
          });
        }

        var value = getDefaultValue();
        var fields = $scope.options.fields[index];

        if (!fields) {
          if (multiTypesFields) {
            fields = getMultiTypeFieldsBasedOnModel(index);
          } else {
            fields = angular.copy($scope.options.data.fields);
          }

          $scope.options.fields.push(fields);
        }

        if (value && value.length) {
          var defaultValueModel = value[$scope.options.fields.length - 1];

          if (defaultValueModel) {
            setFieldsDefaultValue(fields, defaultValueModel, $scope.options.fields.length - 1);
          }
        }

        return fields;
      };

      $scope.add = function (event) {
        var target = event.target;
        var model = $scope.model[$scope.options.key];

        if (!model || model.constructor != Array) {
          model = $scope.model[$scope.options.key] = [];
        }

        var newModel = isArrayOfValues ? '' : {};

        if (multiTypesFields) {
          newModel[$scope.options.data.fieldTypeKey] = multiTypesSelectOptions[0].value;
        }

        model.push(newModel);
        $timeout(function () {
          var input = $(target).closest('.formly-field-multiinput').find('ng-form, formly-field').last().find('input:not([type=hidden])')[0];

          if (input) {
            input.focus();
          }
        }, 0);
      };

      $scope.remove = function (index, item) {
        if (isArrayOfValues) {
          model.splice(index, 1);
          setAndCleanUPModel(model);
        } else {
          if (item[keepKey]) {
            Object.keys(item).map(function (key) {
              if (key != keepKey) {
                delete item[key];
              }
            });
          } else {
            delete $scope.form.multiInputForms[$scope.options.key][index];
            $scope.options.fields.splice(index, 1);
            model.splice(index, 1);
            setAndCleanUPModel(model);
          }
        }
      };

      $scope.isRemoved = function (item) {
        return typeof item != 'undefined' && item.constructor.name == 'Object' && Object.keys(item).length === 1 && Object.keys(item)[0] == keepKey;
      };
    };

    formlyConfigProvider.setType({
      name: 'multiinput',
      templateUrl: 'formly-templates/multi-input.html',
      //extends: 'input',
      // defaultOptions: {
      // 	noFormControl: false,
      // },
      controller: controller
    });
  });
})();

'use strict';

(function () {
  angular.module('anapro.formly.select-buttons', []).run(function (formlyConfig) {
    var controller = function controller($scope) {
      var setModel = function setModel(option) {
        if ($scope.model[$scope.options.key] == option.value && !$scope.to.required) {
          delete $scope.model[$scope.options.key];
        } else {
          $scope.model[$scope.options.key] = option.value;
        }
      };

      $scope.select = function (option) {
        setModel(option);

        if ($scope.options.data && $scope.options.data.onChange) {
          $scope.options.data.onChange($scope.options, option.value);
        }
      };
    };

    formlyConfig.setType({
      name: 'anaproSelectButtons',
      templateUrl: 'formly-templates/select-buttons.html',
      extends: 'input',
      controller: controller
    });
  });
})();

'use strict';

(function () {
  angular.module('anapro.formly.switch', []).run(function (formlyConfig) {
    var controller = function controller($scope) {
      $scope.onclick = function (event) {
        if ($scope.options.data && typeof $scope.options.data.onclick == 'function') {
          $scope.options.data.onclick(event, $scope.options);
        }
      };
    };

    formlyConfig.setType({
      name: 'anaproSwitch',
      templateUrl: 'formly-templates/switch.html',
      defaultOptions: {
        ngModelAttrs: {
          customTrueValue: {
            attribute: 'ng-true-value'
          },
          customFalseValue: {
            attribute: 'ng-false-value'
          }
        }
      },
      controller: controller
    });
  });
})();

'use strict';

(function () {
  angular.module('anapro.formly.time-input', []).run(function (formlyConfig, mainController, $filter, anaproFormlyFactory) {
    var device = mainController.getDevice(),
        parseDate = anaproFormlyFactory.parseDate,
        formatterDate = anaproFormlyFactory.formatterDate,
        timeISOFromString = anaproFormlyFactory.timeISOFromString;

    var controller = function controller($scope, $timeout) {
      $scope.options.resetModel = function () {
        if ($scope.options.templateOptions.type == 'time') {
          $scope.options.parsers = [parseDate];
          $scope.options.formatters = [formatterDate];
        }

        $scope.model[$scope.options.key] = null;
        var defaultValue = timeISOFromString($scope.options.defaultValue);

        if (defaultValue) {
          $timeout(function () {
            $scope.model[$scope.options.key] = $filter('date')(timeISOFromString($scope.options.defaultValue), $scope.options.templateOptions.dateFormat);
          }, 0);
        }
      };

      $scope.options.resetModel();

      $scope.iconClick = function ($event) {
        $($event.target).closest('.form-input-extras').find('input').focus();
      };
    };

    formlyConfig.setType({
      name: 'anaproTime',
      extends: 'input',
      controller: controller,
      defaultOptions: {
        ngModelAttrs: {
          off: {
            value: 'autocomplete'
          },
          datePicker: {
            attribute: 'bs-timepicker'
          },
          autoclose: {
            attribute: 'autoclose'
          },
          dateFormat: {
            attribute: 'data-model-Time-Format'
          },
          dateType: {
            attribute: 'data-time-type'
          },
          min: {
            attribute: device == 'mobile' ? 'min' : 'data-min-time'
          },
          max: {
            attribute: device == 'mobile' ? 'max' : 'data-max-time'
          }
        },
        templateOptions: function () {
          var to = {
            type: 'time'
          };

          if (device == 'desktop') {
            to = {
              type: 'text',
              dateType: 'string',
              datePicker: true,
              autoclose: true
            };
          }

          angular.extend(to, {
            dateFormat: 'yyyy-MM-ddTHH:mm:ss'
          });
          return to;
        }(),
        validators: function () {
          var timeValidator = {}; // if(device == 'mobile'){

          timeValidator = {
            max: {
              expression: function expression(viewValue, modelValue, scope) {
                viewValue, modelValue, scope;

                if (!scope.options.templateOptions.max) {
                  return true;
                }

                if (!modelValue) {
                  return false;
                }

                var value = timeISOFromString(modelValue);
                var max = timeISOFromString(scope.options.templateOptions.max, value);
                return value.getTime() <= max.getTime();
              }
            },
            min: {
              expression: function expression(viewValue, modelValue, scope) {
                viewValue, modelValue, scope;

                if (!scope.options.templateOptions.min) {
                  return true;
                }

                if (!modelValue) {
                  return false;
                }

                var value = timeISOFromString(modelValue);
                var min = timeISOFromString(scope.options.templateOptions.min, value);
                return value.getTime() >= min.getTime();
              }
            }
          }; // }

          return timeValidator;
        }(),
        validation: {
          messages: {
            max: function max(viewValue, modelValue, scope) {
              return scope.to.label + ' precisa ser menor que ' + scope.to.max;
            },
            min: function min(viewValue, modelValue, scope) {
              return scope.to.label + ' precisa ser maior que ' + scope.to.min;
            },
            date: function date() {
              return 'Horário inválido';
            },
            time: function time() {
              return 'Horário inválido';
            }
          }
        }
      }
    });
  });
})();

'use strict';

(function () {
  angular.module('anapro.formly.factory-async-options', []).factory('anaproFormlyFactoryAsyncOptions', function (utilsService, utilsStatesService, followupService) {
    var asyncResources = {
      utilsOccupations: {
        get: utilsService.getOccupations,
        success: function success(field, data) {
          data.data.map(function (item) {
            field.templateOptions.options.push({
              value: item.fields.profissaoIdGuid,
              name: item.fields.profissaoNome
            });
          });
        }
      },
      utilsStates: {
        get: utilsService.getStates,
        success: function success(field, data) {
          data.data.map(function (item) {
            field.templateOptions.options.push({
              value: item.fields.localidadeUF,
              name: utilsStatesService[item.fields.localidadeUF]
            });
          });
        }
      },
      followupsSubTypes: {
        get: followupService.getSubTypes,
        success: function success(field, data) {
          data.data.map(function (item) {
            field.templateOptions.options.push({
              value: item.fields.interacaoTipoSubIdGuid,
              name: item.fields.interacaoTipoSubValor
            });
          });
        }
      }
    };

    var preSuccess = function preSuccess() {
      this.scope.loading = true;
    };

    var postSuccess = function postSuccess() {
      if (this.attrs.success) {
        this.attrs.success();
      }

      this.scope.loading = false;
    };

    var getAsyncOptions = function getAsyncOptions() {
      var instance = this;
      var async = this.scope.options.data.async;

      var resource = async.resource,
          _success = async.success || asyncResources[resource].success;

      if (asyncResources[resource]) {
        preSuccess.apply(instance);
        asyncResources[resource].get({
          success: function success(response) {
            _success(instance.scope.options, response.data);

            postSuccess.apply(instance);
          }
        });
      }
    };

    var getInstance = function getInstance(scope) {
      return function (scope) {
        var init = function init(attrs) {
          instance.attrs = attrs || {};
          scope.loading = false;
          scope.options.templateOptions.options = scope.options.templateOptions.options || [];

          if (scope.options.data.async) {
            getAsyncOptions.apply(instance);
          }
        };

        var instance = {
          init: init,
          scope: scope
        };
        return instance;
      }(scope);
    };

    var service = {
      getInstance: getInstance
    };
    return service;
  });
})();

'use strict';

(function () {
  angular.module('anapro.formly.factory', []).factory('anaproFormlyFactory', function ($filter) {
    // default field type converter
    var fieldTypes = {
      'email': 'anaproEmail',
      'date': 'anaproDate',
      'time': 'anaproTime',
      'datetime': 'anaproDateTime',
      'boolean': 'anaproCheckbox',
      'multiselect': 'anaproMultiCheckbox'
    };
    var fieldTypeMaker = {
      text: function text(field) {
        return angular.extend(field, {
          type: 'input',
          templateOptions: angular.extend(field.templateOptions, {
            type: 'text',
            minlength: field.templateOptions.minLength || null,
            maxlength: field.templateOptions.maxLength || null
          })
        });
      },
      numberInput: function numberInput(field) {
        field = angular.extend(field, {
          type: 'numberInput'
        });

        if (field.templateOptions.money) {
          field.validation = {
            messages: {
              max: function max(newValue, oldValue, scope) {
                newValue, oldValue;
                return 'Valor máximo permitido é ' + $filter('currency')(scope.to.maxValue, 'R$ ');
              },
              min: function min(newValue, oldValue, scope) {
                newValue, oldValue;
                return 'Valor mínimo permitido é ' + $filter('currency')(scope.to.minValue, 'R$ ');
              }
            }
          };
        } else if (field.templateOptions.decimals) {
          field.validation = {
            messages: {
              max: function max(newValue, oldValue, scope) {
                newValue, oldValue;
                return 'Valor máximo permitido é ' + $filter('number')(scope.to.maxValue, scope.to.decimals);
              },
              min: function min(newValue, oldValue, scope) {
                newValue, oldValue;
                return 'Valor mínimo permitido é ' + $filter('number')(scope.to.minValue, scope.to.decimals);
              }
            }
          };
        } else {
          field.templateOptions.decimals = 0;
        }

        return field;
      },
      maskedInput: function maskedInput(field) {
        return angular.extend(field, {
          type: 'maskedInput',
          templateOptions: angular.extend(field.templateOptions, {
            type: 'text'
          })
        });
      },
      select: function select(field) {
        if (field.templateOptions.options.length > 20) {
          field.type = 'nya-select';
        }

        return field;
      }
    };

    var replacePropertyFieldByKey = function replacePropertyFieldByKey(field) {
      field.key = field.field;
      delete field.field;
    };

    var moveOptionsToTemplateOptions = function moveOptionsToTemplateOptions(field) {
      field.templateOptions = field.templateOptions || {};

      if (field.options) {
        field.templateOptions.options = field.options;
        delete field.options;
      }
    };

    var mergeFieldsByKey = function mergeFieldsByKey(field, options) {
      field.templateOptions = field.templateOptions || {};

      if (options.merge && options.merge[field.key]) {
        field = angular.merge(field, options.merge[field.key]);
      }
    };

    var createFormlyFieldType = function createFormlyFieldType(field) {
      if (field.templateOptions && /mask|cnpj|cpf/.test(Object.keys(field.templateOptions).join(',').toLowerCase())) {
        return fieldTypeMaker['maskedInput'](field);
      } else if (/integer|decimals/.test(field.type)) {
        return fieldTypeMaker['numberInput'](field);
      } else if (fieldTypeMaker[field.type]) {
        return fieldTypeMaker[field.type](field);
      } else {
        return field;
      }
    };

    var createFormlyFieldsFromAPI = function createFormlyFieldsFromAPI(apiFields, formlyFields, options) {
      options = options || {};
      apiFields.map(function (field) {
        replacePropertyFieldByKey(field);
        moveOptionsToTemplateOptions(field);
        mergeFieldsByKey(field, options);
        field.type = fieldTypes[field.type.toLowerCase()] || field.type;
        field = createFormlyFieldType(field) || field;
        formlyFields.push(field);
      });
    };

    var resetModel = function resetModel(fields, model) {
      for (var i = 0; i < fields.length; i++) {
        var fieldModel = fields[i].model || model;
        var defaultValue = fields[i].defaultValue;

        if (typeof fields[i].key != 'undefined' && defaultValue || fieldModel[fields[i].key]) {
          if (fields[i].type == 'anaproCheckbox') {
            delete fieldModel[fields[i].key];
          } else if (fields[i].type == 'anaproMultiCheckbox') {
            fieldModel[fields[i]['key']] = [];
          } else if (fields[i].fieldGroup) {
            resetModel(fields[i], fieldModel[fields[i]['key']]);
            delete fieldModel[fields[i]['key']];
          } else if (defaultValue || /multiinput|address/.test(fields[i].type) || /anaproDate|anaproTime|anaproDateTime/.test(fields[i].type)) {
            fields[i].resetModel();
          } else {
            delete fieldModel[fields[i].key];
          }
        }
      }
    }; // var getFormattedModel = function(fields, model){
    // 	var formattedModel = angular.copy(model);
    // 	for(var i=0; i<fields.length; i++){
    // 		var field = fields[i];
    // 		var fieldModel = fields[i].model || formattedModel;
    // 		if(fieldModel[fields[i].key]){
    // 			if(fields[i].data && fields[i].data.getFormattedValue){
    // 				formattedModel[field.key] = fields[i].data.getFormattedValue();
    // 			}else if(fields[i].fieldGroup){
    // 				formattedModel[fields[i].key] = getFormattedModel(
    // 					fields[i].fieldGroup,
    // 					formattedModel[fields[i].key]
    // 				);
    // 				if(fields[i].data && fields[i].data.merge){
    // 					angular.merge(
    // 						formattedModel,
    // 						formattedModel[fields[i].key]
    // 					);
    // 					delete formattedModel[fields[i].key];
    // 				}
    // 			}
    // 		}
    // 	}
    // 	return formattedModel;
    // };


    var groupOptionsByExpression = function groupOptionsByExpression(fields, key, expression) {
      var options;
      fields.map(function (item) {
        if (item.field == key) {
          options = item.options;
        }
      });

      if (options) {
        options.map(function (item) {
          if (expression.test(item.name)) {
            item.group = item.name.match(expression)[1];
            item.name = item.name.replace(expression, '');
          }
        });
      }

      return options;
    };

    var parseDate = function parseDate(newValue, oldValue, scope) {
      return $filter('date')(newValue, scope.options.templateOptions.dateFormat);
    };

    var formatterDate = function formatterDate(newValue) {
      if (!newValue) {
        return newValue;
      }

      return new Date(newValue + (!/T(\d\d:?){3}/.test(newValue) ? 'T00:00:00' : ''));
    };

    var getDateFromString = function getDateFromString(dateString) {
      if (!dateString) {
        return null;
      } else if (dateString.constructor.name == 'Date') {
        return dateString;
      } else {
        var d = dateString.split(/\D/);
        return new Date(d[0], d[1] - 1, d[2], d[3] || 0, d[4] || 0, d[5] || 0);
      }
    };

    var timeISOFromString = function timeISOFromString(val, baseDate) {
      if (!val) {
        return null;
      }

      var valDate = new Date(val);
      var match;

      if (!isNaN(valDate.getTime())) {
        return valDate;
      } else {
        match = val.match(/(..):(..)(:(..))?/);

        if (baseDate && baseDate.constructor.name == 'Date' && !isNaN(baseDate.getTime())) {
          return new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), match[1], match[2], match[4] || '00', '000');
        } else {
          return new Date(1970, 1, 1, match[1], match[2], match[4] || '00', '000');
        }
      }
    };

    var setFieldsOrder = function setFieldsOrder(fields, order) {
      var orderedFields = [];

      for (var index = 0; index < fields.length; index++) {
        var newFieldIndex = order.indexOf(fields[index].key);

        if (newFieldIndex >= 0) {
          orderedFields[newFieldIndex] = fields.splice(index, 1)[0];
          index--;
        }
      }

      for (var i = orderedFields.length; i--; i >= 0) {
        if (orderedFields[i]) {
          fields.splice(0, 0, orderedFields[i]);
        }
      }
    };

    var service = {
      createFormlyFieldsFromAPI: createFormlyFieldsFromAPI,
      resetModel: resetModel,
      // getFormattedModel: getFormattedModel,
      groupOptionsByExpression: groupOptionsByExpression,
      parseDate: parseDate,
      formatterDate: formatterDate,
      timeISOFromString: timeISOFromString,
      getDateFromString: getDateFromString,
      setFieldsOrder: setFieldsOrder
    };
    return service;
  });
})();

'use strict';

(function () {
  angular.module('anapro.formly', ['formly', 'formlyBootstrap', 'anapro.formly.examples', 'anapro.formly.factory', 'anapro.formly.factory-async-options', 'anapro.formly.multi-input', 'anapro.formly.address-input', 'anapro.formly.date-input', 'anapro.formly.time-input', 'anapro.formly.datetime-input', 'anapro.formly.select-buttons', 'anapro.formly.nya-select', 'anapro.formly.select-async', 'anapro.formly.switch']);
})();

'use strict';

(function () {
  angular.module('anapro.formly.nya-select', []).run(function ($interpolate, $sce, formlyConfig, nyaBsConfig) {
    angular.merge(nyaBsConfig, {
      defaultNoneSelection: 'Nada selecionado',
      noSearchResult: 'Nenhum resultado foi encontrado',
      numberItemSelected: '%d selecionado(s)',
      selectAll: 'Todos',
      deselectAll: 'Descelecionar todos'
    });

    var controller = function controller($scope, $timeout, anaproFormlyFactoryAsyncOptions) {
      $scope.options.data = $scope.options.data || {};
      $scope.optionsLimit = 20;
      $scope.showSearchBoxHint = false; // WORKAROUND delete array model when it is not multiple type
      // if(
      // 	!$scope.options.data.multiple
      // 	&&
      // 	$scope.model[$scope.options.key]
      // 	&&
      // 	$scope.model[$scope.options.key].constructor.name == 'Array'
      // ){
      // 	delete $scope.model[$scope.options.key];
      // }

      var isAllOptionsSelected = false;

      var init = function init() {
        $timeout(function () {
          $($scope.fc.$$element).find('.dropdown-toggle').on('blur', function () {
            $scope.$digest();
          });
          $($scope.fc.$$element).find('.bs-searchbox input').on('keyup', function () {
            $scope.$digest();
          });

          if ($scope.options.data.multiple) {
            var element = $($scope.options.formControl.$$element[0]).find('.bs-select-all');
            var buttonOK = $('<button type="button" class="bs-select-ok btn btn-default">Ok</button>');
            buttonOK.on('click', function () {
              $($($scope.fc.$$element)).removeClass('open');
            });
            $($scope.options.formControl.$$element[0]).find('.bs-actionsbox .btn-group').append(buttonOK);
            $(element).unbind('click');
            $(element).click(function (event) {
              event.stopPropagation();
              event.preventDefault();
              toggleSelectAll();
            });
          }
        });
      };

      var toggleSelectAll = function toggleSelectAll() {
        var model = $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];

        if (!isAllOptionsSelected) {
          $scope.options.templateOptions.options.map(function (item) {
            if (model.indexOf(item.value) < 0) {
              model.push(item.value);
            }
          });
        } else {
          model.splice(0, model.length);
        }

        isAllOptionsSelected = !isAllOptionsSelected;
      };

      $scope.isAllOptionsSelected = function () {
        return isAllOptionsSelected;
      };

      var asyncOptionsSuccess = function asyncOptionsSuccess() {
        $timeout(function () {
          angular.element($scope.options.formControl.$$element[0].querySelector('input')).attr('autocomplete', 'false');
        }, 0);
      };

      var interpolateCustomDesc = function interpolateCustomDesc(obj) {
        return $interpolate($scope.options.data.customDesc)(obj);
      };

      var setCustomDescTemplate = function setCustomDescTemplate(obj) {
        var template = interpolateCustomDesc(obj);
        obj.customDescOnlyText = template.replace(/<.*?>/g, ' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        obj.customDescTemplate = $sce.trustAsHtml(template + '<span class="hidden-normalized-name">' + obj.customDescOnlyText + '</span>');
      };

      $scope.optionIsSelected = function (option) {
        var model = $scope.model[$scope.options.key];

        if (model && model.constructor.name == 'Array') {
          return model.indexOf(option.value) > -1;
        }

        return false;
      };

      $scope.removeSelectedOption = function (option) {
        var model = angular.copy($scope.model[$scope.options.key]);
        model.splice(model.indexOf(option.value), 1);
        $scope.options.value(model);

        if (!model.length) {
          delete $scope.model[$scope.options.key];
        }

        $scope.fc.$touched = true;
        $scope.fc.$untouched = false;
      };

      $scope.getOptions = function () {
        var searchBoxVal = $($scope.fc.$$element).find('.bs-searchbox input').val().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        $($scope.fc.$$element).find('.bs-searchbox input').attr('placeholder', 'Digite para filtrar ' + $scope.to.label);
        var searchBoxValRegExp = new RegExp(searchBoxVal.replace(/([*()\u005B\u005D{}.?^$])/g, '\\$1'), 'i');
        var optionsLimit = 0;
        var model = $scope.model[$scope.options.key];
        var filteredOptions = $scope.options.templateOptions.options.filter(function (item) {
          item.displayName = item.displayName || angular.copy(item.name);
          item.name = item.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

          if (searchBoxValRegExp.test(item.customDescOnlyText || item.name) && optionsLimit < $scope.optionsLimit || model && model.constructor.name == 'Array' && model.indexOf(item.value) >= 0) {
            optionsLimit++;
            return true;
          }

          return false;
        });
        $scope.showSearchBoxHint = optionsLimit >= $scope.optionsLimit;

        if (filteredOptions.length) {
          $($scope.fc.$$element).find('.no-search-result').removeClass('show');
        }

        return filteredOptions;
      };

      $scope.cleanup = function ($event) {
        $event.stopPropagation();

        if ($scope.model[$scope.options.key]) {
          delete $scope.model[$scope.options.key];
        }
      };

      anaproFormlyFactoryAsyncOptions.getInstance($scope).init({
        success: asyncOptionsSuccess
      });

      if ($scope.options.data.customDesc) {
        $scope.options.templateOptions.options.map(function (item) {
          setCustomDescTemplate(item);
        });
      }

      init();
    };

    formlyConfig.setType({
      name: 'nya-select',
      extends: 'input',
      templateUrl: 'formly-templates/nya-select.html',
      controller: controller,
      defaultOptions: {
        templateManipulators: {
          preWrapper: [function (template, options, scope) {
            if (scope.options.data.multiple) {
              var x = angular.element('<div></div>').html(template);
              angular.element(x[0].querySelector('.nya-bs-select')).attr('multiple', '').attr('actions-box', 'true');
              return angular.element(x).html();
            }

            return template;
          }]
        }
      }
    });
  });
})();

'use strict';

(function () {
  angular.module('anapro.formly').run(function (formlyValidationMessages) {
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
    formlyValidationMessages.addTemplateOptionValueMessage('min', 'minValue', 'O valor mínimo permitido é ', '', '');
    formlyValidationMessages.addTemplateOptionValueMessage('max', 'maxValue', 'O valor máximo permitido é ', '', '');
  });
})();

'use strict';

(function () {
  angular.module('anapro.formly.select-async', []).run(function (formlyConfig) {
    var controller = function controller($scope, anaproFormlyFactoryAsyncOptions) {
      $scope.options.data = $scope.options.data || {};
      anaproFormlyFactoryAsyncOptions.getInstance($scope).init();
    };

    formlyConfig.setType({
      name: 'select-async',
      extends: 'select',
      controller: controller
    });
  });
})();

'use strict';

(function () {
  angular.module('provider.apiToken', []).run(function (CacheFactory) {
    CacheFactory('token', {
      storagePrefix: 'AnaproAPP-Caches.',
      storageMode: 'localStorage'
    });
  }).provider('apiToken', function () {
    this.$get = function (CacheFactory) {
      this.getCache = function () {
        return CacheFactory.get('token');
      };

      return this;
    };
  });
})();

'use strict';

(function () {
  angular.module('provider.base64', []).run(function ($http, $timeout, base64) {
    $http({
      url: '/base64/sounds.json',
      mehtod: 'GET'
    }).then(function (response) {
      base64.putFiles('sounds', response.data);
    }, function (response) {
      console.log(response);
    });
  }).provider('base64', function () {
    var self = this,
        files = {};

    self.putFiles = function (type, data) {
      files[type] = data;
    };

    self.getFilesType = function (type) {
      return files[type];
    };

    self.$get = function () {
      return self;
    };
  });
})();

'use strict';

(function () {
  angular.module('provider.main-controller', ['provider.main-controller.rote-device-changed']).provider('mainController', function () {
    var self = this,
        device;

    self.setDevice = function () {
      device = document.querySelector('body').offsetWidth < 960 ? 'mobile' : 'desktop';
    };

    self.setDevice();

    self.getDevice = function () {
      return device;
    };

    self.$get = function (mainControllerRotateDeviceChanged) {
      mainControllerRotateDeviceChanged.init(self);
      return self;
    };
  });
})();

'use strict';

(function () {
  angular.module('provider.main-controller.rote-device-changed', []).provider('mainControllerRotateDeviceChanged', function () {
    var self = this;

    self.$get = function ($window) {
      var mainController,
          lastDevice,
          windowOnResizeListenerAdded = false;

      var windowOnResizeListener = function windowOnResizeListener() {
        lastDevice = mainController.getDevice();
        mainController.setDevice();

        if (lastDevice != mainController.getDevice()) {
          angular.element($window).off('resize', windowOnResizeListener);
          windowOnResizeListenerAdded = false;
          $window.location.reload();
        }
      };

      self.init = function (mainControllerProvider) {
        mainController = mainControllerProvider;
        angular.element($window).on('orientationchange', function () {
          if (!windowOnResizeListenerAdded) {
            windowOnResizeListenerAdded = true;
            angular.element($window).on('resize', windowOnResizeListener);
          }
        });
      };

      return self;
    };
  });
})();

'use strict';

(function () {
  angular.module('provider.path', []).provider('path', function () {
    var rootScope;
    var paths = {
      // keys must be same name of views
      logout: {
        path: '/sair/',
        label: 'Sair',
        icon: 'logout'
      },
      calendar: {
        path: '/agenda/',
        label: 'Agenda',
        icon: 'calendar2'
      }
    };
    var self = this;
    self.currentKey = 'home';

    self.get = function (view) {
      return paths[view];
    };

    self.addPath = function (view, object) {
      paths[view] = object;
      return paths[view];
    };

    self.getPath = function (view) {
      return paths[view].path;
    };

    self.getIcon = function (view) {
      return paths[view].icon;
    };

    self.getLabel = function (view) {
      return paths[view].label;
    };

    self.getCurrent = function () {
      return paths[self.currentKey];
    };

    self.getCurrentViewName = function () {
      return self.currentKey;
    };

    self.setCurrent = function (view) {
      self.currentKey = view || 'home';

      if (rootScope.mainController.setViewAttribute) {
        rootScope.mainController.setViewAttribute();
      }
    };

    self.$get = function ($rootScope) {
      rootScope = $rootScope;
      return self;
    };
  });
})();

'use strict';

(function () {
  angular.module('provider.permission', []).provider('permission', function () {
    var self = this;
    var adm = false;
    var permissions = [];
    var config = {};
    var descriptions = {};

    self.setAdm = function () {
      adm = true;
    };

    self.set = function (userPermissions) {
      permissions = userPermissions;
    };

    var hasPermission = function hasPermission(permission) {
      // permission do not exists any where
      if (!descriptions[permission] && !config[permission]) {
        console.warn('Permission key "' + permission + '" do not exists, it was ignored.');
        return true; // override that removes permission for everone
      } else if (isRemoved(permission)) {
        return false; // return permission in user profile
      } else {
        return adm || permissions.indexOf(permission) >= 0 || !!config[permission];
      }
    };

    self.permissionStatus = function (userPermission) {
      if (isDisabled(userPermission)) {
        return 'disabled';
      } else {
        return hasPermission(userPermission);
      }
    };

    var isRemoved = function isRemoved(userPermission) {
      return config[userPermission] && config[userPermission].removed || false;
    };

    var isDisabled = function isDisabled(userPermission) {
      return config[userPermission] && config[userPermission].disabled || false;
    };

    self.getDescription = function (userPermissions) {
      return (descriptions[userPermissions] || '').replace(/\.$/, '');
    };

    self.checkPermissions = function (list) {
      var permissionsResult = false;
      var listOR = list.split('||');

      for (var i = 0; i < listOR.length; i++) {
        var listAND = listOR[i].split('&&');

        if (listAND.length > 1) {
          for (var z = 0; z < listAND.length; z++) {
            permissionsResult = self.permissionStatus(listAND[z].trim());

            if (!permissionsResult || permissionsResult == 'disabled') {
              break;
            }
          }

          if (permissionsResult === true) {
            break;
          }
        } else {
          permissionsResult = self.permissionStatus(listOR[i].trim());

          if (permissionsResult === true) {
            break;
          }
        }
      }

      return permissionsResult;
    };

    this.$get = function ($rootScope, permissionsDescription, permissionsConfig) {
      $rootScope.permission = self;
      descriptions = permissionsDescription;
      config = permissionsConfig;
      return self;
    };
  });
})();

'use strict';

(function () {
  angular.module('provider.urls', []).provider('urls', function ($httpProvider) {
    var self = this;

    var getCleanPath = function getCleanPath(path) {
      return path.replace(/^.+(\/.+)$/, '$1');
    };

    self.config = {
      getCleanPath: getCleanPath
    };

    var addOcpApimSubscriptionKey = function addOcpApimSubscriptionKey(configs) {
      if (configs.ocpApimSubscriptionKey) {
        $httpProvider.defaults.headers.common['Ocp-Apim-Subscription-Key'] = configs.ocpApimSubscriptionKey;
      }
    };

    if (window.APIFAKE) self.environment = 'fake';else if (window.DEVELOPMENT === true) self.environment = 'development';else if (window.DEVELOPMENT === 1) self.environment = 'development-local';else self.environment = 'production';
    self.$get = ['URLs', 'URLsFake', 'URLsDevelopment', 'URLsDevelopmentLocal', 'URLsProduction', function (URLs, URLsFake, URLsDevelopment, URLsDevelopmentLocal, URLsProduction) {
      var configs;
      console.info('%cApp Version: ' + window.VERSION + '.' + (window.DEVELOPMENT ? 'dev' : 'prod'), 'background: blue; color: white; padding: 0 30px;');

      if (window.APIFAKE) {
        console.info('%cDefined fake API Environment: ' + window.APIFAKE, 'background: red; color: white; padding: 0 30px;');
      } else {
        console.info('%cDefined Anapro API Environment: ' + self.environment, 'background: green; color: white; padding: 0 30px;');
      }

      switch (self.environment.toLowerCase()) {
        case 'fake':
          configs = URLsFake;
          break;

        case 'production':
          configs = URLsProduction;
          break;

        case 'development':
          configs = URLsDevelopment;
          break;

        case 'development-local':
          configs = URLsDevelopmentLocal;
          break;

        default:
          throw new Error('Environment ' + self.getEnvironment() + ' not available!');
      }

      if (configs.apiPaths) {
        configs.apiPaths = angular.extend(URLs.apiPaths, configs.apiPaths);
      }

      configs = angular.extend(URLs, configs);
      configs.environment = self.environment;
      self.config = angular.extend(self.config, configs);
      addOcpApimSubscriptionKey(configs);
      return self.config;
    }];
  });
})();

'use strict';

(function () {
  angular.module('services.auth', []).run(function ($rootScope, $location, authService) {
    // Token Cookie Has Been Changed
    $rootScope.$on('tokenCookieHasBeenChanged', function () {
      console.log('tokenCookieHasBeenChanged triggered');
      authService.cookieHasBeenChanged();
      $location.path('/').replace();
    }); // Token Cookie Has Been Changed But User is the same

    $rootScope.$on('tokenCookieHasBeenChangedButUserIsTheSame', function () {
      console.log('tokenCookieHasBeenChangedButUserIsTheSame triggered');
      authService.cookieHasBeenChangedButUserIsTheSame();
    });
  }).factory('authService', function ($window, $http, $rootScope, CacheFactory, authCookieFactory, apiToken, usersService, urls, analyticsService) {
    var cacheToken = apiToken.getCache();

    var loadUserProfile = function loadUserProfile() {
      if (service.token) {
        usersService.getUserProfile({
          goToAnaproLogin: true,
          noCache: true,
          success: function success() {
            analyticsService.setUsername();
          }
        });
      }
    };

    var logoutSuccess = function logoutSuccess(response, attrs) {
      attrs = attrs || {};
      service.removeToken();
      CacheFactory.clearAll();
      authCookieFactory.clear();

      if (typeof attrs.success == 'function') {
        attrs.success(response || {});
      }
    };

    var getCacheToken = function getCacheToken() {
      return cacheToken.get('token') || undefined;
    };

    var service = {
      token: null,
      logoutSuccess: logoutSuccess,
      clearStorageWheLastTokenHasBeenChanged: function clearStorageWheLastTokenHasBeenChanged() {
        var currentTokenCookie = authCookieFactory.get();
        var lastTokenCookie = (getCacheToken() || {}).token;

        if (lastTokenCookie != currentTokenCookie) {
          console.log(['clearStorageWheLastTokenHasBeenChanged', 'lastTokenCookie: ' + lastTokenCookie, 'currentTokenCookie: ' + currentTokenCookie]);
          CacheFactory.clearAll();
        }
      },
      getCookie: function getCookie() {
        var tokenCookie = authCookieFactory.get();

        if (tokenCookie) {
          service.saveToken({
            token: tokenCookie
          });
        }
      },
      saveToken: function saveToken(data) {
        if (data) {
          service.token = data;
          cacheToken.put('token', data);
          service.addDefaultHeaderToken(data);
        }
      },
      getToken: function getToken() {
        service.getCookie();
        service.token = getCacheToken();
        service.addDefaultHeaderToken(service.token);
        loadUserProfile();
      },
      removeToken: function removeToken() {
        cacheToken.remove('token');
        service.token = null;
        service.addDefaultHeaderToken(undefined);
      },
      logout: function logout(attrs) {
        if (!service.token) {
          logoutSuccess(null, attrs);
          return;
        }

        $http({
          url: urls.apiHost + urls.apiPaths.logout,
          method: 'GET',
          toastrMessages: {
            success: null
          }
        }).then(function (response) {
          logoutSuccess(response, attrs);
        }, function (response) {
          console.error('Logout error', response);
          logoutSuccess(response, attrs);
        });
        usersService.clearCache();
      },
      cookieHasBeenChanged: function cookieHasBeenChanged() {
        CacheFactory.clearAll();
        usersService.clearCache();
        service.getCookie();
        $window.location.reload();
      },
      cookieHasBeenChangedButUserIsTheSame: function cookieHasBeenChangedButUserIsTheSame() {
        service.saveToken({
          token: authCookieFactory.get()
        });
      },
      // add token on default request headers
      addDefaultHeaderToken: function addDefaultHeaderToken(tokenObj) {
        $http.defaults.withCredentials = true;

        if (tokenObj && tokenObj.token) {
          $http.defaults.headers.common['access_token'] = tokenObj.token;
        } else {
          $http.defaults.headers.common['access_token'] = undefined;
        }
      },
      post: function post(attrs) {
        $http({
          url: urls.apiHost + urls.apiPaths.auth,
          method: 'POST',
          data: attrs.data
        }).then(function (response) {
          if (typeof attrs.success == 'function') {
            service.saveToken(response.data);
            attrs.success(response);
          }
        }, function (response) {
          if (typeof attrs.error == 'function') {
            attrs.error(response);
          }
        });
      }
    };
    return service;
  });
})();

'use strict';

(function () {
  angular.module('services.calendar', []).factory('calendarService', function ($http, $rootScope, listFactory, urls) {
    var getDefaultParams = function getDefaultParams() {
      // [todo] replace by preferences service
      var params = {
        limit: $rootScope.mainController.device == 'desktop' ? 30 : 5
      };
      params.fields = JSON.stringify(params.fields);
      return params;
    };

    var get = function get(attrs) {
      var params = {};

      if (!attrs.link) {
        params = getDefaultParams();

        if (attrs.params) {
          params = angular.extend(params, attrs.params);
        }
      } else {
        attrs.link = attrs.link.replace(/.*?(\?.*?)$/g, '' + '$1');
      }

      attrs = attrs || {};
      $http({
        url: urls.apiHost + urls.apiPaths.calendar + (attrs.link ? attrs.link : ''),
        method: 'GET',
        params: params,
        toastrMessages: attrs.toastrMessages
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var gerFilterHashLink = function gerFilterHashLink(path, attrs, routeParams) {
      var url = path;

      if (attrs.link && routeParams) {
        attrs.params = listFactory.getAttrsFromRouteParams(routeParams).params || {};
      }

      url += 'filters/' + listFactory.saveAttrsAndGetHashLink(attrs);
      return url;
    };

    var service = {
      get: get,
      gerFilterHashLink: gerFilterHashLink
    };
    return service;
  });
})();

'use strict';

(function () {
  angular.module('services.clients', []).factory('clientsService', function ($http, urls) {
    var post = function post(attrs) {
      console.log(attrs); // var resourceItem;
      // if(attrs.resource){
      // 	resourceItem =
      // 		urls.apiPaths[attrs.resource.resource] + '/' + attrs.resource.id;
      // }else{
      // 	resourceItem = '';
      // }
      // $http({
      // 	url: urls.apiHost + resourceItem + urls.apiPaths.followup,
      // 	method: 'POST',
      // 	data: attrs.data
      // }).then(
      // 	function(response){
      // 		if(typeof attrs.success == 'function'){
      // 			attrs.success(response);
      // 		}
      // 	},
      // 	function(response){
      // 		if(typeof attrs.error == 'function'){
      // 			attrs.error(response);
      // 		}
      // 	}
      // );
    };

    var patchItem = function patchItem(attrs) {
      $http({
        url: urls.apiHost + urls.apiPaths.clients + '/' + attrs.item.id,
        method: 'PATCH',
        toastrMessages: attrs.toastrMessages,
        data: attrs.data
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var get = function get(attrs) {
      console.log(attrs); // [todo] same get of services.transactions
      // must implement list filters
    };

    var getItem = function getItem(attrs) {
      $http({
        url: urls.apiHost + urls.apiPaths.clients + '/' + attrs.id,
        method: 'GET',
        params: attrs.params,
        toastrMessages: attrs.toastrMessages
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var factory = {
      get: get,
      getItem: getItem,
      post: post,
      patchItem: patchItem
    };
    return factory;
  });
})();

'use strict';

(function () {
  angular.module('services.followup', []).constant('followupSubTypes', {
    call: 'LIGACAO',
    whatsapp: 'WHATSAPP'
  }).run(function (CacheFactory) {
    CacheFactory('cachefollowupService', {
      storagePrefix: 'AnaproAPP-Caches.',
      storageMode: 'localStorage'
    });
  }).factory('followupService', function ($http, CacheFactory, urls) {
    var cache = CacheFactory.get('cachefollowupService');
    cache.removeAll();

    var saveCacheFollowup = function saveCacheFollowup(response) {
      cache.put('followupSubTypes', response);
    };

    var post = function post(attrs) {
      var resourceItem;

      if (attrs.resource) {
        resourceItem = urls.apiPaths[attrs.resource.resource] + '/' + attrs.resource.id;
      } else {
        resourceItem = '';
      }

      $http({
        url: urls.apiHost + resourceItem + urls.getCleanPath(urls.apiPaths.followups),
        method: 'POST',
        toastrMessages: attrs.toastrMessages,
        data: attrs.data
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          mergeResource(response.data, attrs.resource);
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var mergeResource = function mergeResource(item, resource) {
      item.parentResources = item.parentResources || {};

      if (!item.parentResources[resource.resource]) {
        item.parentResources[resource.resource] = {
          id: resource.id
        };
      }
    };

    var get = function get(attrs) {
      var resourceItem;

      if (attrs.resource) {
        resourceItem = urls.apiPaths[attrs.resource.resource] + '/' + attrs.resource.id;
      } else {
        resourceItem = '';
      }

      $http({
        url: urls.apiHost + resourceItem + urls.getCleanPath(urls.apiPaths.followupsGroupByStatus),
        method: 'GET',
        params: attrs.params,
        toastrMessages: attrs.toastrMessages
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var getSubTypes = function getSubTypes(attrs) {
      var cacheSubTypes = cache.get('followupSubTypes');

      if (cacheSubTypes) {
        if (typeof attrs.success == 'function') {
          attrs.success(cacheSubTypes);
        }

        return;
      }

      $http({
        url: urls.apiHost + urls.apiPaths.followupsSubTypes,
        method: 'GET'
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
          saveCacheFollowup(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var actions = function actions(attrs) {
      $http({
        url: urls.apiHost + urls.apiPaths.followups + '/' + attrs.item.id + urls.apiPaths.followupsActions[attrs.action],
        method: 'POST',
        toastrMessages: attrs.toastrMessages,
        data: attrs.data || {}
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var getInteraction = function getInteraction(item) {
      return item.fields[getType(item)];
    };

    var getType = function getType(item) {
      return Object.keys(item.fields)[0];
    };

    var factory = {
      get: get,
      post: post,
      actions: actions,
      getSubTypes: getSubTypes,
      getInteraction: getInteraction,
      getType: getType
    };
    return factory;
  });
})();

'use strict';

(function () {
  angular.module('services.longpolling', ['services.longpolling.cacheFactory']).factory('longpollingService', function ($rootScope, $timeout, urls, path, CacheFactory, longpollingTimer, authService, authCookieFactory) {
    var cache = CacheFactory.get('longpolling');
    var timer;
    var hasStarted = false;

    var setTimer = function setTimer() {
      stop();
      timer = setTimeout(ping, longpollingTimer);
    };

    var stop = function stop() {
      hasStarted = false;
      clearTimeout(timer);
    };

    var init = function init() {
      if (!hasStarted) {
        ping();
      }
    };

    var success = function success() {
      authCookieFactory.checkCookie();
      setTimer();
    };

    var error = function error(response) {
      if (response.status == 401) {
        var payloadErrorMessage = {
          title: 'Acesso encerrado!'
        };
        var friendlyMessageHeader = decodeURIComponent(response.getResponseHeader('friendlyMessage')).replace(/\+/g, ' ');

        if (friendlyMessageHeader) {
          payloadErrorMessage['message'] = friendlyMessageHeader;
        }

        $rootScope.$broadcast('requestUserAuthentication', {
          config: {
            toastrMessages: {
              payloadError: payloadErrorMessage
            }
          }
        });
      } else {
        setTimer();
      }
    };

    window.error401 = error;

    var canPing = function canPing() {
      if (navigator.onLine === false) {
        return false;
      }

      var lastPing = cache.get('lastPing') || 0;
      return new Date().getTime() - lastPing >= longpollingTimer;
    };

    var ping = function ping() {
      hasStarted = true;

      if (!canPing()) {
        success();
        return;
      }

      cache.put('lastPing', new Date().getTime());

      if (authService.token) {
        var headers = {
          'access_token': authService.token.token
        };

        if (urls.ocpApimSubscriptionKey) {
          headers['Ocp-Apim-Subscription-Key'] = urls.ocpApimSubscriptionKey;
        } // using jQuery ajax in order to prevent memory leak


        $.ajax({
          url: urls.apiHost + urls.apiPaths.legacyLongPollingPresence,
          method: 'HEAD',
          headers: headers
        }).then(success, error);
      } else {
        error();
      }
    };

    $rootScope.$on('tokenCookieHasBeenChanged', function () {
      console.log('services.longpolling.$on.tokenCookieHasBeenChanged');
      init();
    }); // Token Cookie Has Been Changed But User is the same

    $rootScope.$on('tokenCookieHasBeenChangedButUserIsTheSame', function () {
      console.log('services.longpolling.$on.tokenCookieHasBeenChangedButUserIsTheSame');
      init();
    });
    return {
      stop: stop,
      init: init
    };
  });
})();

'use strict';

(function () {
  angular.module('services.pending-processing', []).factory('pendingProcessingService', function ($rootScope, $http, urls, firebaseBroadcastsNames, notificationCenterFactory, firebaseCollections) {
    var lastTick,
        itemsIdByType = {
      pendingProcessingTransactionWaitingAttend: 'pendingProcessingHashKey'
    };

    var normalizeDataItemsIds = function normalizeDataItemsIds(data) {
      Object.keys(data).map(function (key) {
        if (data[key].constructor.name == 'Array' && itemsIdByType[key]) {
          data[key].map(function (item) {
            item.id = item[itemsIdByType[key]];
          });
        }
      });
    }; // var createEmptyArrayForTypesWhenUndefined = function(data){
    // 	Object.keys(itemsIdByType).map(function(type){
    // 		data[type] = data[type] || [];
    // 	});
    // };


    var getSuccess = function getSuccess(response) {
      start = response.data.id;
      var data = response.data.fields || {};
      normalizeDataItemsIds(data); // createEmptyArrayForTypesWhenUndefined(data);

      notificationCenterFactory.dispatch(firebaseCollections.pendingProcessing, data);
    };

    var start = 0;

    var get = function get(data) {
      if (data && typeof data.ticks != 'undefined') {
        $http({
          url: urls.apiHost + urls.apiPaths.servicesPendingprocessing,
          method: 'GET',
          params: {
            start: start,
            end: data.ticks
          }
        }).then(getSuccess, function (response) {
          console.error(response);
        });
      }
    };

    var init = function init() {
      $rootScope.$on(firebaseBroadcastsNames.pendenciaprocessamento, function (event, data) {
        var dataCopied = angular.copy(data);
        data = data || {};
        data = angular.merge({
          ticks: 0
        }, data);

        if (lastTick != data.ticks) {
          lastTick = data.ticks;
          console.log('listener ' + firebaseBroadcastsNames.pendenciaprocessamento + ':', dataCopied, data);
          get(data);
        } else {
          console.warn('listener ' + firebaseBroadcastsNames.pendenciaprocessamento + ' same last ticks ignored: ', dataCopied, data);
        }
      });
    };

    var setEmptyTransactionsAwaiting = function setEmptyTransactionsAwaiting() {
      notificationCenterFactory.dispatch(firebaseCollections.pendingProcessing, {
        pendingProcessingTransactionWaitingAttend: []
      });
    };

    return {
      get: get,
      setEmptyTransactionsAwaiting: setEmptyTransactionsAwaiting,
      init: init
    };
  });
})();

'use strict';

(function () {
  angular.module('services.permissions', []).factory('permissionsService', function ($http, urls, permissionsDescription) {
    var setPermissionsDescription = function setPermissionsDescription(permissions) {
      permissions.fields.permissionKeys.map(function (permissionItem) {
        permissionsDescription[permissionItem.fields.permissionKey] = permissionItem.fields.permissionKeyDescricao;
      });
    };

    var setDescriptions = function setDescriptions(response) {
      var permissions = response.data.data;
      permissions.map(function (permissionsFields) {
        setPermissionsDescription(permissionsFields);
      });
    };

    var service = {
      get: function get(attrs) {
        $http({
          url: urls.apiHost + urls.apiPaths.permissions,
          method: 'GET'
        }).then(function (response) {
          setDescriptions(response);

          if (typeof attrs.success == 'function') {
            attrs.success();
          }
        }, function () {
          // use default
          if (typeof attrs.success == 'function') {
            attrs.success();
          }
        });
      },
      getItem: function getItem(attrs) {
        $http({
          url: urls.apiHost + urls.apiPaths.permissions + '/' + attrs.permissionKey,
          method: 'GET'
        }).then(function (response) {
          setPermissionsDescription(response.data);

          if (typeof attrs.success == 'function') {
            attrs.success(response);
          }
        }, function (response) {
          if (typeof attrs.error == 'function') {
            attrs.error(response);
          }
        });
      }
    };
    return service;
  });
})();

'use strict';

(function () {
  angular.module('services.pipelines', []).run(function (CacheFactory) {
    CacheFactory('cachePipelinesService', {
      storagePrefix: 'AnaproAPP-Caches.',
      storageMode: 'localStorage'
    });
  }).factory('pipelinesService', function ($http, CacheFactory, urls) {
    var cache = CacheFactory.get('cachePipelinesService');

    var saveEachPipelineOnCache = function saveEachPipelineOnCache(response) {
      response.data.data.map(function (item) {
        var newResponse = angular.copy(response);
        newResponse.data = item;
        cache.put('pipelines/' + item.fields.pipelineStage.pipelineStageIdGuid, newResponse);
      });
    };

    var get = function get(attrs) {
      var cachePipelines = cache.get('pipelines');

      if (cachePipelines) {
        if (typeof attrs.success == 'function') {
          attrs.success(cachePipelines);
        }

        return;
      }

      $http({
        url: urls.apiHost + urls.apiPaths.pipelines,
        method: 'GET',
        toastrMessages: attrs.toastrMessages
      }).then(function (response) {
        cache.put('pipelines', response);
        saveEachPipelineOnCache(response);

        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var getItem = function getItem(attrs) {
      var cachePipeline = cache.get('pipelines/' + attrs.id);

      if (cachePipeline) {
        if (typeof attrs.success == 'function') {
          attrs.success(cachePipeline);
        }

        return;
      }

      $http({
        url: urls.apiHost + urls.apiPaths.pipelines + '/' + attrs.id,
        method: 'GET'
      }).then(function (response) {
        cache.put('pipelines/' + attrs.id, response);

        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var service = {
      get: get,
      getItem: getItem
    };
    return service;
  });
})();

'use strict';

(function () {
  angular.module('services.products', []) // .run(function(CacheFactory){
  // 	CacheFactory(
  // 		'cachefollowupService',
  // 		{
  // 			storagePrefix: 'AnaproAPP-Caches.',
  // 			storageMode: 'localStorage'
  // 		}
  // 	);
  // })
  .factory('productsService', function ($http, // CacheFactory,
  urls) {
    // var cache = CacheFactory.get('cachefollowupService');
    // cache.removeAll();
    // var saveCacheFollowup = function(response){
    // 	cache.put('followupSubTypes', response);
    // };
    var get = function get(attrs) {
      $http({
        url: urls.apiHost + urls.apiPaths.products,
        method: 'GET',
        params: {
          atendimentoIdGuid: attrs.item.id
        }
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var factory = {
      get: get
    };
    return factory;
  });
})();

'use strict';

(function () {
  angular.module('services.queues', []).factory('queuesService', function ($http, urls) {
    var actions = function actions(attrs) {
      attrs = attrs || {};
      $http({
        url: urls.apiHost + urls.apiPaths.queues + (attrs.item ? '/' + attrs.item.id : '') + urls.apiPaths.queuesActions[attrs.action],
        method: attrs.method || 'POST',
        data: attrs.data || {},
        params: attrs.params || {},
        toastrMessages: attrs.toastrMessages
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var factory = {
      actions: actions
    };
    return factory;
  });
})();

'use strict';

(function () {
  angular.module('services.schedules', []).factory('schedulesService', function ($http, urls) {
    var get = function get(attrs) {
      attrs = attrs || {};
      $http({
        url: urls.apiHost + urls.apiPaths.schedules,
        method: 'GET',
        toastrMessages: attrs.toastrMessages
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var service = {
      get: get
    };
    return service;
  });
})();

'use strict';

(function () {
  angular.module('services.transactions-report', []).factory('transactionsReportService', function ($http, urls) {
    var service = {
      get: function get(attrs) {
        $http({
          url: urls.apiHost + urls.apiPaths.transactionsReport,
          method: 'GET'
        }).then(function (response) {
          if (typeof attrs.success == 'function') {
            attrs.success(response);
          }
        }, function (response) {
          if (typeof attrs.error == 'function') {
            attrs.error(response);
          }
        });
      }
    };
    return service;
  });
})();

'use strict';

(function () {
  angular.module('services.transactions-summary', []).run(function (CacheFactory) {
    CacheFactory('cacheNestedStages', {
      storagePrefix: 'AnaproAPP-Caches.',
      storageMode: 'localStorage'
    });
  }).factory('transactionsSummaryService', function ($http, CacheFactory, urls) {
    var cacheNestedStages = CacheFactory.get('cacheNestedStages');

    var saveCacheNestedStages = function saveCacheNestedStages(response) {
      cacheNestedStages.put('stages', response);
    }; // translate pt-br properties into a better and friendly understanding


    var properties = {
      updated: 'resumoNegocioDtUltimaAtualizacao',
      totalValue: 'resumoNegocioVolumeFinanceiroTotal',
      totalCommission: 'resumoNegocioComissaoTotal',
      lastStageCommision: 'resumoNegocioComissaoUltimaFase',
      totalTransactions: 'resumoNegocioQtdNegociosTotal',
      stages: {
        index: 'resumoNegocioPipelineStageOrdem',
        items: 'resumoNegocios',
        name: 'resumoNegocioPipelineStageNome',
        nestedStages: 'resumoNegocioPipelineStageAgrupado',
        transactions: 'resumoNegocioQtdNegocios',
        value: 'resumoNegocioVolumeFinanceiroValor',
        subStages: 'subStages',
        percentTransactions: 'resumoNegocioQtdNegociosPercent',
        valuePercent: 'resumoNegocioVolumeFinanceiroPercent'
      }
    };

    var get = function get(attrs) {
      var defaultParams = {
        agruparSuperGrupo: true
      };
      attrs.params = angular.merge(defaultParams, attrs.params);
      $http({
        url: urls.apiHost + urls.apiPaths.transactionsSummary,
        method: 'GET',
        params: attrs.params,
        toastrMessages: attrs.toastrMessages
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          if (attrs.params.agruparSuperGrupo === false) {
            saveCacheNestedStages(response);
          }

          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var getNestedStages = function getNestedStages(attrs) {
      var defaultParams = {
        agruparSuperGrupo: false
      };
      attrs.params = angular.merge(defaultParams, attrs.params);
      service.get(attrs);
    };

    var getCacheNestedStages = function getCacheNestedStages(attrs) {
      attrs = attrs || {};
      var stages = cacheNestedStages.get('stages');

      if (stages && attrs.success) {
        attrs.success(stages);
      } else {
        service.getNestedStages(attrs);
      }
    };

    var service = {
      properties: properties,
      get: get,
      getNestedStages: getNestedStages,
      getCacheNestedStages: getCacheNestedStages
    };
    return service;
  });
})();

'use strict';

(function () {
  angular.module('services.transactions', []).factory('transactionsService', function ($rootScope, $http, $filter, path, urls, listFactory, permission) {
    var statuses = {
      queue: 'AGUARDANDOATENDIMENTO',
      attended: 'ATENDIDO',
      finished: 'ENCERRADO',
      added: 'INCLUIDO'
    };

    var statusesByFieldValue = function () {
      var obj = {};
      Object.keys(statuses).map(function (key) {
        obj[statuses[key]] = key;
      });
      return obj;
    }();

    var expiresProgressThreshold = {
      33: 'ok',
      66: 'warn',
      100: 'danger'
    };

    var getDefaultParams = function getDefaultParams() {
      // [todo] replace by preferences service
      var params = {
        fields: ['prospectNome', 'usuarioNome', 'canalNome', 'midiaNome', 'atendimentoDtAtendido', 'atendimentoInteracaoUsuarioUltimaData', 'atendimentoInteracaoUsuarioTipo', 'atendimentoPipelineStageNome', 'atendimentoPipelineStageIdGuid'],
        limit: $rootScope.mainController.device == 'desktop' ? 15 : 5
      };
      params.fields = JSON.stringify(params.fields);
      return params;
    };

    var get = function get(attrs) {
      var params = {};

      if (!attrs.link) {
        params = getDefaultParams();

        if (attrs.params) {
          params = angular.extend(params, attrs.params);
        }
      } else {
        attrs.link = attrs.link.replace(/.*?(\?.*?)$/g, urls.apiPaths.transactions + '$1');
      }

      $http({
        url: urls.apiHost + (attrs.link ? attrs.link : urls.apiPaths.transactions),
        method: 'GET',
        params: params,
        toastrMessages: attrs.toastrMessages
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var getItem = function getItem(attrs) {
      $http({
        url: urls.apiHost + urls.apiPaths.transactions + '/' + attrs.id,
        method: 'GET',
        params: attrs.params,
        toastrMessages: attrs.toastrMessages
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var patchItem = function patchItem(attrs) {
      $http({
        url: urls.apiHost + urls.apiPaths.transactions + '/' + attrs.item.id,
        method: 'PATCH',
        data: attrs.data
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var patchList = function patchList(attrs) {
      $http({
        url: urls.apiHost + urls.apiPaths.transactions,
        method: 'PATCH',
        data: attrs.items
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var gerFilterHashLink = function gerFilterHashLink(path, attrs, routeParams) {
      var url = path;

      if (attrs.link && routeParams) {
        attrs.params = listFactory.getAttrsFromRouteParams(routeParams).params || {};
      }

      url += 'filters/' + listFactory.saveAttrsAndGetHashLink(attrs);
      return url;
    };

    var getJSONFilterFromHref = function getJSONFilterFromHref(href) {
      var json;

      try {
        json = JSON.parse(href.replace(/^.*?filters=(\{.*?\}).*?$/, '$1'));
      } catch (e) {
        json = null;
      }

      return json;
    };

    var actions = function actions(attrs) {
      attrs = attrs || {};
      $http({
        url: urls.apiHost + urls.apiPaths.transactions + (attrs.item ? '/' + attrs.item.id : '') + urls.apiPaths.transactionsActions[attrs.action],
        method: attrs.method || 'POST',
        data: attrs.data || {},
        params: attrs.params || {},
        toastrMessages: attrs.toastrMessages
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var getPipelines = function getPipelines(attrs) {
      $http({
        url: urls.apiHost + urls.apiPaths.transactions + '/' + attrs.id + urls.getCleanPath(urls.apiPaths.pipelines) + '/' + (attrs.stageId || ''),
        method: 'GET'
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var activeOffer = function activeOffer(attrs) {
      var params = {};

      if (attrs.item) {
        params['campanhaIdGuid'] = attrs.item.fields.campanhaIdGuid;
      }

      $http({
        url: urls.apiHost + urls.apiPaths.transactionsActiveOffer + (attrs.item ? '/' + attrs.item.id : ''),
        params: params,
        method: 'GET',
        toastrMessages: attrs.toastrMessages
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var updateItem = function updateItem(item, newItem) {
      angular.merge(item, newItem);
    };

    var isOnQueue = function isOnQueue(item) {
      return item.fields.atendimento.atendimentoStatus == statuses.queue;
    };

    var isFinished = function isFinished(item) {
      return item.fields.atendimento.atendimentoStatus == statuses.finished;
    };

    var isActive = function isActive(item) {
      return item.fields.atendimento.atendimentoStatus == statuses.attended;
    };

    var canEditWhenNotActive = function canEditWhenNotActive(item) {
      return isActive(item) || permission.checkPermissions('atd_edit_nao_atendido') === true;
    };

    var getTransactionsAwaitingLink = function getTransactionsAwaitingLink() {
      return gerFilterHashLink(path.getPath('transactions'), {
        params: {
          removeFilterWhenEmpty: true,
          q: '',
          filters: {
            atendimentoStatus: statuses.queue
          }
        }
      });
    };

    var calcExpiresTimeInDays = function calcExpiresTimeInDays(item, key) {
      item.extraInfo[key] = item.extraInfo[key] || 0;

      if (item.extraInfo[key] > 0) {
        return Math.floor(item.extraInfo[key] / 60 / 24);
      } else if (item.extraInfo[key] < 0) {
        return 0;
      }

      return item.extraInfo[key];
    };

    var getExpiresTimeInDays = function getExpiresTimeInDays(item) {
      return calcExpiresTimeInDays(item, 'atendimentoExpiracaoAutomaticaQtdMinutosRestantesMax');
    };

    var getExpiresTimeConfInDays = function getExpiresTimeConfInDays(item) {
      return calcExpiresTimeInDays(item, 'atendimentoExpiracaoAutomaticaQtdMinutosConf');
    };

    var getExpiresText = function getExpiresText(item) {
      var days = getExpiresTimeInDays(item);
      return 'Você pode perder esse cliente em <strong>' + days + ' dia' + (days > 1 ? 's ' : ' ') + '</strong> (' + $filter('date')(item.extraInfo.atendimentoExpiracaoAutomaticaData, 'dd/MM/yy HH:mm') + ')<br />' + 'caso você não registre um novo <strong>follow-up</strong> ou <strong>agende</strong> uma próxima<br/>' + 'atividade <strong>(próximo passo)</strong>.';
    };

    var getExpiresProgressThreshold = function getExpiresProgressThreshold() {
      return expiresProgressThreshold;
    };

    var factory = {
      get: get,
      getItem: getItem,
      actions: actions,
      patchItem: patchItem,
      patchList: patchList,
      getDefaultParams: getDefaultParams,
      gerFilterHashLink: gerFilterHashLink,
      getTransactionsAwaitingLink: getTransactionsAwaitingLink,
      getJSONFilterFromHref: getJSONFilterFromHref,
      getPipelines: getPipelines,
      activeOffer: activeOffer,
      statuses: statuses,
      statusesByFieldValue: statusesByFieldValue,
      updateItem: updateItem,
      isOnQueue: isOnQueue,
      isFinished: isFinished,
      isActive: isActive,
      canEditWhenNotActive: canEditWhenNotActive,
      getExpiresTimeInDays: getExpiresTimeInDays,
      getExpiresTimeConfInDays: getExpiresTimeConfInDays,
      getExpiresText: getExpiresText,
      getExpiresProgressThreshold: getExpiresProgressThreshold
    };
    return factory;
  });
})();

'use strict';

(function () {
  angular.module('services.users', []).factory('usersService', function ($rootScope, $http, $timeout, urls, navigationBarFactory, permission, permissionsService) {
    var callbacksWhenNotLoaded = [];
    var cache = null;
    var profileLoaded = false;

    var isProfileLoaded = function isProfileLoaded(registerCallbackWhenNotLoaded) {
      if (!profileLoaded && typeof registerCallbackWhenNotLoaded == 'function') {
        callbacksWhenNotLoaded.push(registerCallbackWhenNotLoaded);
      }

      return profileLoaded;
    };

    $rootScope.isProfileLoaded = isProfileLoaded;

    var setNavigationBarLogo = function setNavigationBarLogo() {
      navigationBarFactory.logo.set({
        company: cache.data.extraInfo.contaSistemaNome
      });
    };

    var runRegisteredCallbacks = function runRegisteredCallbacks() {
      if (callbacksWhenNotLoaded.length) {
        callbacksWhenNotLoaded.map(function (func, index) {
          if (typeof func == 'function') {
            var registeredFunction = func;
            callbacksWhenNotLoaded[index] = null;
            registeredFunction();
          }
        });
      }

      callbacksWhenNotLoaded = [];
    };

    var getUserProfileSuccess = function getUserProfileSuccess(attrs, response) {
      profileLoaded = true;

      if (typeof attrs.success == 'function') {
        attrs.success(response);
      }

      runRegisteredCallbacks();
      setNavigationBarLogo();
    };

    var setUserPermissions = function setUserPermissions(profile) {
      if (profile.perfilUsuarioAdm) {
        permission.setAdm();
      } else if (profile.perfilUsuarioKeys) {
        permission.set(profile.perfilUsuarioKeys);
      } else {
        permission.set([]);
      }
    };

    var getAllPermissionsDescription = function getAllPermissionsDescription(attrs, response) {
      permissionsService.get({
        success: function success() {
          cache = response;
          setUserPermissions(response.data.expand.userprofiles.fields.perfilUsuario);
          getUserProfileSuccess(attrs, response);
        }
      });
    };

    var clearCache = function clearCache() {
      profileLoaded = false;
      cache = null;
    };

    var getUserProfile = function getUserProfile(attrs) {
      attrs = attrs || {};

      if (attrs.noCache) {
        clearCache();
      }

      if (cache && !attrs.reload) {
        getUserProfileSuccess(attrs, cache);
        return;
      }

      $http({
        url: urls.apiHost + urls.apiPaths.userProfile,
        method: 'GET',
        params: {
          '_embed': 'firebase,servicechannel'
        },
        goToAnaproLogin: attrs.goToAnaproLogin,
        toastrMessages: attrs.toastrMessages
      }).then(function (response) {
        getAllPermissionsDescription(attrs, response);
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var get = function get(attrs) {
      attrs = attrs || {};
      $http({
        url: urls.apiHost + urls.apiPaths.users + '/' + attrs.id,
        method: 'GET'
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var getMyUser = function getMyUser(attrs) {
      attrs = attrs || {};
      $http({
        url: urls.apiHost + urls.apiPaths.myUser,
        method: 'GET'
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var patch = function patch(attrs) {
      attrs = attrs || {};
      $http({
        url: urls.apiHost + urls.apiPaths.users + '/' + attrs.id,
        method: 'PATCH',
        data: attrs.data
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var patchMyUser = function patchMyUser(attrs) {
      attrs = attrs || {};
      $http({
        url: urls.apiHost + urls.apiPaths.myUser,
        method: 'PATCH',
        data: attrs.data
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var updateCurrentProfile = function updateCurrentProfile(item) {
      // angular.merge(cache.data.fields.usuario, item);
      cache.data.fields.usuario = item;
    };

    var isAdm = function isAdm() {
      return cache.data.expand.userprofiles.fields.perfilUsuario.perfilUsuarioAdm;
    };

    var service = {
      get: get,
      patch: patch,
      patchMyUser: patchMyUser,
      getUserProfile: getUserProfile,
      getMyUser: getMyUser,
      isProfileLoaded: isProfileLoaded,
      updateCurrentProfile: updateCurrentProfile,
      isAdm: isAdm,
      clearCache: clearCache
    };
    return service;
  });
})();

'use strict';

(function () {
  angular.module('services.users.status', []).factory('usersStatusService', function ($http, $timeout, usersService, urls) {
    var get = function get(attrs) {
      attrs = attrs || {};
      $http({
        url: urls.apiHost + urls.apiPaths.users + '/' + attrs.id + urls.apiPaths.usersServiceChannel,
        method: 'GET'
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var patch = function patch(attrs) {
      attrs = attrs || {};
      $http({
        url: urls.apiHost + urls.apiPaths.users + '/' + attrs.id + urls.apiPaths.usersServiceChannel,
        method: 'PATCH',
        data: {
          fields: attrs.data
        }
      }).then(function (response) {
        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var getCurrentUserProfileSuccess = function getCurrentUserProfileSuccess(attrs, response) {
      if (response.data.embed.servicechannel) {
        attrs.success({
          data: response.data.embed.servicechannel
        });
      } else {
        get({
          id: response.data.id,
          success: attrs.success,
          error: attrs.error
        });
      }
    };

    var getCurrentUserProfile = function getCurrentUserProfile(attrs) {
      usersService.getUserProfile({
        success: function success(response) {
          getCurrentUserProfileSuccess(attrs, response);
        }
      });
    };

    var getCurrentUser = function getCurrentUser(attrs) {
      attrs = attrs || {};

      if (usersService.isProfileLoaded(function () {
        getCurrentUserProfile(attrs);
      })) {
        getCurrentUserProfile(attrs);
      }
    };

    var patchCurrentUser = function patchCurrentUser(attrs) {
      attrs = attrs || {};
      getCurrentUserProfile({
        success: function success(response) {
          patch({
            id: response.data.id,
            data: attrs.data,
            success: attrs.success,
            error: attrs.error
          });
        }
      });
    };

    var service = {
      get: get,
      patch: patch,
      getCurrentUser: getCurrentUser,
      patchCurrentUser: patchCurrentUser
    };
    return service;
  });
})();

'use strict';

(function () {
  angular.module('services.utils-states', []).factory('utilsStatesService', function () {
    var states = {
      'AC': 'Acre',
      'AL': 'Alagoas',
      'AM': 'Amazonas',
      'AP': 'Amapá',
      'BA': 'Bahia',
      'CE': 'Ceará',
      'DF': 'Distrito Federal',
      'ES': 'Espírito Santo',
      'GO': 'Goiás',
      'MA': 'Maranhão',
      'MG': 'Minas Gerais',
      'MS': 'Mato Grosso do Sul',
      'MT': 'Mato Grosso',
      'PA': 'Pará',
      'PB': 'Paraíba',
      'PE': 'Pernambuco',
      'PI': 'Piauí',
      'PR': 'Paraná',
      'RJ': 'Rio de Janeiro',
      'RN': 'Rio Grande do Norte',
      'RO': 'Rondônia',
      'RR': 'Roraima',
      'RS': 'Rio Grande do Sul',
      'SC': 'Santa Catarina',
      'SE': 'Sergipe',
      'SP': 'São Paulo',
      'TO': 'Tocantins'
    };
    return states;
  });
})();

'use strict';

(function () {
  angular.module('services.utils', ['services.utils-states']).run(function (CacheFactory) {
    CacheFactory('cacheUtils', {
      storagePrefix: 'AnaproAPP-Caches.',
      storageMode: 'localStorage'
    });
  }).factory('utilsService', function ($http, $timeout, CacheFactory, urls) {
    var cache = CacheFactory.get('cacheUtils');

    var getOccupations = function getOccupations(attrs) {
      var cacheOccupations = cache.get('occupations');

      if (cacheOccupations) {
        if (typeof attrs.success == 'function') {
          attrs.success(cacheOccupations);
        }

        return;
      }

      $http({
        url: urls.apiHost + urls.apiPaths.utilsOccupations,
        method: 'GET'
      }).then(function (response) {
        cache.put('occupations', response);

        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var getStates = function getStates(attrs) {
      var cacheStates = cache.get('states');

      if (cacheStates) {
        if (typeof attrs.success == 'function') {
          attrs.success(cacheStates);
        }

        return;
      }

      $http({
        url: urls.apiHost + urls.apiPaths.utilsLocation.base + urls.apiPaths.utilsLocation.states,
        method: 'GET'
      }).then(function (response) {
        cache.put('states', response);

        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var getCities = function getCities(attrs) {
      var cacheCities = cache.get(attrs.params.state + '/cities');

      if (cacheCities) {
        if (typeof attrs.success == 'function') {
          attrs.success(cacheCities);
        }

        return;
      }

      $http({
        url: urls.apiHost + urls.apiPaths.utilsLocation.base + urls.apiPaths.utilsLocation.states + '/' + attrs.params.state + urls.apiPaths.utilsLocation.cities,
        method: 'GET'
      }).then(function (response) {
        cache.put(attrs.params.state + '/cities', response);

        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var getNeighborhoods = function getNeighborhoods(attrs) {
      var cacheNeighborhoods = cache.get(attrs.params.idCity + '/neighborhoods');

      if (cacheNeighborhoods) {
        if (typeof attrs.success == 'function') {
          attrs.success(cacheNeighborhoods);
        }

        return;
      }

      $http({
        url: urls.apiHost + urls.apiPaths.utilsLocation.base + urls.apiPaths.utilsLocation.cities + '/' + attrs.params.idCity + urls.apiPaths.utilsLocation.neighborhoods,
        method: 'GET'
      }).then(function (response) {
        cache.put(attrs.params.idCity + '/neighborhoods', response);

        if (typeof attrs.success == 'function') {
          attrs.success(response);
        }
      }, function (response) {
        if (typeof attrs.error == 'function') {
          attrs.error(response);
        }
      });
    };

    var service = {
      getOccupations: getOccupations,
      getStates: getStates,
      getCities: getCities,
      getNeighborhoods: getNeighborhoods
    };
    return service;
  });
})();

'use strict';

(function () {
  angular.module('directives.add-client', []).factory('addClientFactory', function ($modal) {
    var showModal = function showModal(attrs) {
      attrs = attrs || {};
      $modal({
        templateUrl: 'add-client/add-client-modal.html',
        show: true,
        animation: 'am-fade-and-slide-top',
        controller: function controller($scope) {
          $scope.delegate = attrs.delegate;
        },
        onHide: function onHide() {
          console.log('modalAddClient hide');
        }
      });
    };

    return {
      showModal: showModal
    };
  }).controller('AddClientController', function ($rootScope, $scope, $filter, $timeout, path, anaproFormlyFactory, transactionsService, usersService) {
    var userProfile;
    usersService.getUserProfile({
      success: function success(response) {
        userProfile = response.data;
      }
    });
    $scope.delegate = $scope.delegate || {};
    $scope.loading = false;
    $scope.submitStatus = {
      success: false,
      error: false
    };
    $scope.form = {};
    $scope.formOptions = {};
    $scope.model = {
      prospectEmails: [{}],
      prospectTelefones: [{}]
    };

    var postExecute = function postExecute() {
      $timeout(function () {
        $scope.submitStatus.success = false;
        $scope.submitStatus.error = false;
        $scope.loading = false;
      }, 500);
    };

    var submitError = function submitError() {
      $scope.submitStatus.error = true;
      postExecute();
    };

    var delegateItemAddedCurrentUserHasNoAccess = function delegateItemAddedCurrentUserHasNoAccess(item) {
      if ($scope.delegate.itemAddedCurrentUserHasNoAccess && !item.id) {
        $scope.delegate.itemAddedCurrentUserHasNoAccess(item);
      }
    };

    var delegateItemAddedToCurrentUser = function delegateItemAddedToCurrentUser(item) {
      if ($scope.delegate.itemAddedToCurrentUser && item.id && item.fields.atendimento.atendimentoUsuarioContaSistemaIdGuid == userProfile.id) {
        $scope.delegate.itemAddedToCurrentUser(item);
      }
    };

    var delegateItemAddedToOtherUser = function delegateItemAddedToOtherUser(item) {
      if ($scope.delegate.itemAddedToOtherUser && item.id && item.fields.atendimento.atendimentoUsuarioContaSistemaIdGuid != userProfile.id) {
        $scope.delegate.itemAddedToOtherUser(item);
      }
    };

    var delegateHide = function delegateHide() {
      if ($scope.delegate.hide) {
        $scope.delegate.hide();
      }
    };

    var runDelegates = function runDelegates(response) {
      delegateHide(response.data);
      delegateItemAddedCurrentUserHasNoAccess(response.data);
      delegateItemAddedToCurrentUser(response.data);
      delegateItemAddedToOtherUser(response.data);
    };

    var submitSuccess = function submitSuccess(response) {
      $scope.submitStatus.success = true;
      postExecute();
      runDelegates(response);
      $scope.formOptions.resetModel();
    };

    $scope.cancel = function () {
      $scope.formOptions.resetModel();

      if ($scope.delegate.hide) {
        $scope.delegate.hide();
      }
    };

    $scope.submit = function () {
      if ($scope.form.$valid && !$scope.loading) {
        $scope.loading = true;
        postAction();
      }
    };

    var toastrMessagesSetOptions = function toastrMessagesSetOptions(itemAdded) {
      if (itemAdded.id) {
        return {
          autoDimiss: false,
          closeButton: true,
          timeOut: 0,
          onTap: function onTap() {
            $rootScope.mainController.go(path.get('transaction').withItem(itemAdded));
          }
        };
      } else {
        return {};
      }
    };

    var postAction = function postAction() {
      transactionsService.actions({
        action: 'request',
        method: 'POST',
        data: {
          fields: $scope.model
        },
        toastrMessages: {
          success: {
            title: 'Cliente ' + $scope.model.prospectNome + ' adicionado com sucesso.',
            setOptions: toastrMessagesSetOptions
          },
          serverError: {
            title: 'Desculpe, estamos com dificuldades para adicionar o cliente' + $scope.model.prospectNome + '.'
          }
        },
        success: submitSuccess,
        error: submitError
      });
    };

    var update = function update() {
      var model = angular.copy($scope.model);
      $scope.loading = true;
      transactionsService.actions({
        action: 'request',
        method: 'GET',
        params: {
          filters: JSON.stringify(model)
        },
        toastrMessages: {
          serverError: {
            title: 'Desculpe, estamos com dificuldade para adicionar um novo cliente.'
          }
        },
        success: function success(response) {
          setFields(response.data.filters);
          $scope.loading = false;
        },
        error: delegateHide
      });
    };

    update();

    $scope.setAdvanced = function () {
      $scope.model.atendimentoActionRequestOpcaoAvancado = true;
      update();
    };

    var lastSelectedUser;

    var setLastSelectedUser = function setLastSelectedUser() {
      lastSelectedUser = $scope.model.usuarioIdGuid || lastSelectedUser || null;
      delete $scope.model.usuarioIdGuid;
    };

    var fieldsLayout = $rootScope.mainController.device == 'desktop' ? 'row' : 'column';

    var setFields = function setFields(fields) {
      $scope.fields = [];
      var formlyFields = [];
      anaproFormlyFactory.createFormlyFieldsFromAPI(fields, formlyFields, {
        merge: {
          prospectNome: {
            elementAttributes: {
              'layout': fieldsLayout
            },
            templateOptions: {
              label: 'Nome completo:',
              placeholder: 'Nome do cliente'
            }
          },
          prospectSexo: {
            type: 'anaproSelectButtons',
            elementAttributes: {
              'layout': 'row'
            }
          },
          atendimentoActionRequestAtenderAutomaticamente: {
            type: 'anaproSelectButtons',
            hideExpression: function hideExpression(newValue, oldValue, scope, field) {
              var sameCurrentUser = $scope.model.usuarioIdGuid == userProfile.id;

              if (sameCurrentUser) {
                var options = field.options.templateOptions.options;
                var value = options[options.length - 1].value;
                field.model[field.options.key] = value;
              }

              return sameCurrentUser;
            },
            templateOptions: {
              noErrorSpace: true
            },
            elementAttributes: {
              'layout': 'row'
            }
          },
          usuarioIdGuid: {
            type: 'nya-select',
            data: {
              customDesc: '{{name}}, <strong>{{properties.usuarioApelido}}</strong><br />{{properties.usuarioEmail}}'
            },
            templateOptions: {
              hint: 'Se o usuário não estiver na lista, é porque ele não pertence à campanha e canal selecionados.'
            }
          },
          usuarioSeguidoresIdGuids: {
            type: 'nya-select',
            data: {
              multiple: true,
              customDesc: '{{name}}, <strong>{{properties.usuarioApelido}}</strong><br />{{properties.usuarioEmail}}'
            },
            templateOptions: {
              noErrorSpace: true
            }
          },
          atendimentoTipoDirecionamento: {
            type: 'anaproSelectButtons',
            data: {
              onChange: function onChange() {
                setLastSelectedUser();
                update();
              }
            },
            elementAttributes: {
              'layout': 'row'
            }
          },
          campanhaIdGuid: {
            type: 'anaproSelectButtons',
            data: {
              onChange: function onChange() {
                setLastSelectedUser();
                delete $scope.model.canalIdGuid;
                delete $scope.model.produtoIdGuid;
                update();
              }
            }
          },
          canalIdGuid: {
            type: 'anaproSelectButtons',
            data: {
              onChange: function onChange() {
                setLastSelectedUser();
                delete $scope.model.produtoIdGuid;
                update();
              }
            }
          },
          produtoIdGuid: {
            type: 'nya-select',
            className: 'nya-position-top',
            templateOptions: {
              noErrorSpace: true
            }
          },
          midiaIdGuid: {
            className: 'nya-position-top',
            templateOptions: {
              noErrorSpace: true
            }
          },
          atendimentoActionRequestOpcaoAvancado: {
            type: 'hidden'
          },
          prospectCpf: {
            'className': 'input-nogrow',
            elementAttributes: {
              'layout': fieldsLayout,
              'flex': '50'
            },
            templateOptions: {
              placeholder: 'CPF do cliente'
            }
          }
        }
      });
      formlyFields = formlyFields.concat(fieldsOrig);
      anaproFormlyFactory.setFieldsOrder(formlyFields, ['prospectNome', 'prospectEmailValor', 'prospectTelefoneFull', 'prospectSexo', 'prospectCpf', 'usuarioIdGuid']);
      $scope.fields = formlyFields;
    };

    var fieldsOrig = [{
      type: 'maskedInput',
      key: 'prospectTelefoneFull',
      model: $scope.model.prospectTelefones[0],
      className: 'input-nogrow',
      elementAttributes: {
        'layout': fieldsLayout,
        'flex': '50'
      },
      templateOptions: {
        label: 'Telefone',
        type: 'tel',
        placeholder: 'Telefone com DDD',
        mask: '(99) 9?9999-9999'
      },
      expressionProperties: {
        'templateOptions.required': function templateOptionsRequired() {
          return $scope.model.prospectContatoObrigatorio && !$scope.model.prospectEmails[0].prospectEmailValor;
        }
      },
      validation: {
        messages: {
          mask: function mask(newValue, oldValue, scope) {
            newValue, oldValue, scope;
            return 'Número de telefone inválido!';
          }
        }
      }
    }, {
      type: 'anaproEmail',
      key: 'prospectEmailValor',
      model: $scope.model.prospectEmails[0],
      elementAttributes: {
        'layout': fieldsLayout
      },
      templateOptions: {
        label: 'Email',
        placeholder: 'exemplo@exemplo.com'
      },
      expressionProperties: {
        'templateOptions.required': function templateOptionsRequired() {
          return $scope.model.prospectContatoObrigatorio && !$scope.model.prospectTelefones[0].prospectTelefoneFull;
        }
      }
    }];
  }).directive('addClient', function () {
    return {
      restrict: 'E',
      templateUrl: 'add-client/add-client.html',
      controller: 'AddClientController',
      scope: {
        delegate: '=?'
      }
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.automate-new-lead', []).constant('activeOfferMessageDisabled', 'No momento, você não tem cliente disponível na Oferta Ativa. Tente novamente mais tarde.').controller('AutomateNewLeadController', function ($timeout, $scope, automateNewLeadFactory) {
    $scope.submitStatus = {
      success: false,
      error: false
    };
    var countProductsId = {};

    var setCountProductsId = function setCountProductsId() {
      $scope.items.map(function (item) {
        var id = item.fields.produtoIdGuid;

        if (!countProductsId[id]) {
          countProductsId[id] = 0;
        }

        countProductsId[id]++;
      });
    };

    $scope.campaignIsNeeded = function (item) {
      return countProductsId[item.fields.produtoIdGuid] > 1;
    };

    var getLeadSuccess = function getLeadSuccess(data) {
      $scope.submitStatus.success = true;
      postExecute(data);
    };

    var getLeadError = function getLeadError() {
      $scope.submitStatus.error = true;
      postExecute();
    };

    var postExecute = function postExecute(data) {
      $timeout(function () {
        $scope.submitStatus.success = false;
        $scope.submitStatus.error = false;
        $scope.loading = false;

        if (data) {
          automateNewLeadFactory.redirToPathItem(data);
        }

        $scope.delegate.hide();
      }, 500);
    };

    $scope.getLead = function (item) {
      $scope.loading = true;
      automateNewLeadFactory.get({
        product: item,
        success: getLeadSuccess,
        error: getLeadError
      });
    };

    setCountProductsId();
  }).factory('automateNewLeadFactory', function ($modal, $rootScope, path, transactionsService, toastrFactory, userStatusFactory, activeOfferMessageDisabled) {
    var isDisabled = function isDisabled() {
      return userStatusFactory.isDisabled('activeOffer');
    };

    var activeOfferMessage = function activeOfferMessage() {
      return isDisabled() ? activeOfferMessageDisabled : '';
    };

    var redirToPathItem = function redirToPathItem(item) {
      $rootScope.mainController.go(path.get('transaction').withItem(item));
    };

    var show = function show(attrs) {
      attrs = attrs || {};
      $modal({
        templateUrl: 'automate-new-lead/automate-new-lead-modal.html',
        show: true,
        animation: 'am-fade-and-slide-top',
        controller: function controller($scope) {
          $scope.items = attrs.items;
          $scope.delegate = attrs.delegate;
        },
        onHide: function onHide() {// if(attrs.delegate.hide) {
          // 	attrs.delegate.hide();
          // }
        }
      });
    };

    var canUse = function canUse() {
      if (isDisabled()) {
        toastrFactory.warn({
          title: 'Desculpe!',
          message: activeOfferMessageDisabled
        });
        return false;
      }

      return true;
    };

    var get = function get(attrs) {
      if (!canUse()) {
        return;
      }

      attrs = attrs || {};

      var isEmpty = function isEmpty(data) {
        if (data && data.data && !data.data.length) {
          toastrFactory.info({
            title: 'Desculpe!',
            message: activeOfferMessageDisabled
          });
          return true;
        }

        return false;
      };

      var showAvailableProducts = function showAvailableProducts(data) {
        show({
          items: data.data,
          delegate: {}
        });
      };

      var automateLeadSuccess = function automateLeadSuccess(response) {
        var data = response.data;

        if (isEmpty(data)) {
          return;
        } else if (!attrs.product) {
          showAvailableProducts(data);
        }

        if (attrs.success) {
          attrs.success(data);
        }
      };

      var automateLeadError = function automateLeadError() {
        if (attrs.error) {
          attrs.error();
        }
      };

      transactionsService.activeOffer({
        item: attrs.product,
        success: automateLeadSuccess,
        error: automateLeadError,
        toastrMessages: {
          serverError: {
            title: 'Desculpe!'
          }
        }
      });
    };

    var service = {
      get: get,
      redirToPathItem: redirToPathItem,
      isDisabled: isDisabled,
      activeOfferMessage: activeOfferMessage
    };
    return service;
  }).directive('automateNewLead', function () {
    return {
      restrict: 'E',
      templateUrl: 'automate-new-lead/automate-new-lead.html',
      controller: 'AutomateNewLeadController',
      scope: {
        items: '=',
        delegate: '=?'
      }
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.avatar', []).controller('AvatarController', function ($scope) {
    $scope.item = $scope.item || {};
    $scope.itemObj = {};

    $scope.getStyle = function () {
      if ($scope.imgsrc) {
        return {
          'background-image': 'url(' + $scope.imgsrc + ')'
        };
      } else {
        return {};
      }
    };

    var setItemObj = function setItemObj() {
      if ($scope.item.prospectUrlImagem) {
        $scope.itemObj = {
          name: $scope.item.prospectNome,
          imgsrc: $scope.item.prospectUrlImagem
        };
      } else if ($scope.item.usuarioUrlImagem) {
        $scope.itemObj = {
          name: $scope.item.usuarioNome + ', ' + $scope.item.usuarioApelido,
          imgsrc: $scope.item.usuarioUrlImagem
        };
      }

      if (!$scope.imgsrc) {
        $scope.imgsrc = $scope.itemObj.imgsrc || '';
      }
    };

    setItemObj();
  }).directive('avatar', function () {
    return {
      restrict: 'E',
      scope: {
        imgsrc: '=?',
        item: '=?'
      },
      transclude: true,
      templateUrl: 'avatar/avatar.html',
      controller: 'AvatarController'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.breadcrumbs', []).controller('BreadcrumbsController', function ($scope, path) {
    // add home as first
    $scope.trail.splice(0, 0, {
      label: path.getLabel('home'),
      path: path.getPath('home')
    });
    console.log($scope.trail);
  }).directive('breadcrumbs', function () {
    return {
      restrict: 'E',
      scope: {
        trail: '='
      },
      templateUrl: 'breadcrumbs/breadcrumbs.html',
      controller: 'BreadcrumbsController'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.card-actions-activity', []).controller('CardActionsActivityController', function ($rootScope, $scope, $timeout, $filter, $element, followupService, followupSubTypes, cardActionFactory) {
    if ($scope.$parent.cardActionsTabSelectedDelegate) {
      $scope.$parent.cardActionsTabSelectedDelegate['activity'] = function (attrs) {
        if ($scope.$parent.modalDelegate) {
          $scope.$parent.modalDelegate.setTitle('Atividade');
        }

        initWithSubTypeSelected(attrs);
      };
    }

    var initWithSubTypeSelected = function initWithSubTypeSelected(attrs) {
      if (attrs.interacaoTipoSub) {
        cardActionFactory.getSubTypeId({
          interacaoTipoSub: attrs.interacaoTipoSub,
          success: function success(id) {
            $scope.model.fields.interacaoAtividade.interacaoTipoSubIdGuid = id;
          }
        });
      }
    };

    $scope.loading = false;
    $scope.submitStatus = {
      success: false,
      error: false
    };
    $scope.form = null;
    $scope.formOptions = {};
    $scope.model = {
      fields: {
        interacaoAtividade: {
          tarefa: {
            alarme: {}
          }
        }
      }
    };
    var modelWhen = {};
    $scope.fields = [{
      key: $scope.edit ? 'alarmeDtAlarme' : 'interacaoDtInteracao',
      type: 'anaproDateTime',
      model: $scope.edit ? $scope.model.fields.interacaoAtividade.tarefa.alarme : $scope.model.fields.interacaoAtividade,
      defaultValue: $filter('date')($scope.edit ? $scope.item.fields.interacaoAtividade.interacaoDtInteracao : new Date(), 'yyyy-MM-ddTHH:mm:00'),
      hideExpression: function hideExpression() {
        return modelWhen.when == 'doing';
      },
      templateOptions: {
        // label: 'Data da atividade',
        required: true
      }
    }];

    var setFields = function setFields() {
      if (!$scope.edit) {
        var modelWhenValue = angular.merge({
          activity: {
            modelWhen: 'doing'
          }
        }, $scope.delegate.tabButtonAttrs);
        modelWhen.when = modelWhenValue.activity.modelWhen;
        $scope.fields.splice(0, 0, {
          type: 'anaproSelectButtons',
          key: 'when',
          model: modelWhen,
          elementAttributes: {
            'layout': 'row'
          },
          templateOptions: {
            required: true,
            label: 'Quando?',
            noErrorSpace: true,
            options: [{
              name: 'Já fiz',
              value: 'done'
            }, {
              name: 'Agora',
              value: 'doing'
            }, {
              name: 'Vou fazer',
              value: 'todo'
            }]
          }
        });
      }

      $scope.fields.push({
        type: 'select-async',
        key: 'interacaoTipoSubIdGuid',
        model: $scope.model.fields.interacaoAtividade,
        className: 'input-nogrow',
        elementAttributes: {
          'layout': 'row'
        },
        data: {
          async: {
            resource: 'followupsSubTypes'
          }
        },
        templateOptions: {
          label: 'Tipo:',
          options: []
        }
      }, {
        type: 'textarea',
        model: $scope.model.fields.interacaoAtividade,
        key: 'interacaoTexto',
        templateOptions: {
          required: true,
          placeholder: 'escreva sua nota',
          rows: 10,
          hint: 'Dica: Adicione Hashtags (#) para se organizar melhor!'
        }
      });
    };

    if (!$scope.edit) {
      setFields();
    }

    var postExecute = function postExecute(response) {
      $timeout(function () {
        $scope.submitStatus.success = false;
        $scope.submitStatus.error = false;
        $scope.loading = false;

        if ($scope.$parent.modalDelegate) {
          $scope.$parent.modalDelegate.hide();
        }

        delegate(response);
      }, 500);
    };

    var delegate = function delegate(response) {
      if ($scope.delegate && response) {
        if ($scope.edit) {
          $scope.delegate.reschedule(response.data);
        } else {
          $scope.delegate.postItem(response.data);
        }
      }
    };

    var getModelBeforeSubmit = function getModelBeforeSubmit() {
      var model = angular.copy($scope.model);

      if (modelWhen.when == 'doing') {
        delete $scope.model.fields.interacaoAtividade.interacaoDtInteracao;
      }

      if (model.fields.interacaoAtividade.tarefa.alarme.alarmeDtAlarme) {
        model.fields.interacaoAtividade.tarefa.tarefaDtTarefa = model.fields.interacaoAtividade.tarefa.alarme.alarmeDtAlarme;
      }

      if ($scope.edit) {
        model = {
          fields: model.fields.interacaoAtividade
        };
      }

      return model;
    };

    $scope.cancel = function () {
      if ($scope.$parent.modalDelegate) {
        $scope.$parent.modalDelegate.hide();
      }
    };

    $scope.submit = function () {
      if ($scope.form.$valid && !$scope.loading) {
        $scope.loading = true;
        var model = getModelBeforeSubmit();
        var attrs = {
          item: $scope.item,
          data: model,
          toastrMessages: getToastrMessages(),
          success: function success(response) {
            $scope.submitStatus.success = true;
            postExecute(response);
            $scope.formOptions.resetModel();
          },
          error: function error() {
            $scope.submitStatus.error = true;
            postExecute();
          }
        };

        if ($scope.edit) {
          attrs.action = 'reschedule';
          followupService.actions(attrs);
        } else {
          attrs.resource = $scope.$parent.resource || null;
          followupService.post(attrs);
        }
      }
    };

    var getToastrMessages = function getToastrMessages() {
      var messageActionSuccess, messageActionError;

      if ($scope.edit) {
        messageActionError = 'remarcar';
        messageActionSuccess = 'remarcada';
      } else {
        messageActionError = 'inserir';
        messageActionSuccess = 'criada';
      }

      return {
        success: {
          title: 'Nota ' + messageActionSuccess + ' com sucesso.'
        },
        serverError: {
          title: 'Desculpe, estamos com dificuldades para ' + messageActionError + ' sua nota',
          message: 'Tente novamente mais tarde, obrigado.'
        }
      };
    };
  }).directive('cardActionsActivity', function () {
    return {
      restrict: 'E',
      templateUrl: 'card-actions/card-actions-activity.html',
      controller: 'CardActionsActivityController',
      scope: {
        active: '=?',
        edit: '=?',
        item: '=?',
        delegate: '=?'
      },
      replace: true
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.card-actions-call', []).controller('CardActionsCallController', function ($rootScope, $scope, $timeout, $filter, $element, followupService, followupSubTypes, cardActionFactory) {
    $scope.cardActionsPhoneSelectDelegate = {
      phoneSelected: function phoneSelected(phoneNumber) {
        $scope.delegate.data.phoneClient = phoneNumber;
        registerCall();
        makeCall();
        setFields();
      }
    };

    $scope.$parent.cardActionsTabSelectedDelegate['call-activity'] = function () {
      if ($scope.$parent.modalDelegate) {
        $scope.$parent.modalDelegate.setTitle('Ligação');
      }

      cardActionFactory.getSubTypeId({
        interacaoTipoSub: followupSubTypes.call,
        success: function success(id) {
          $scope.model.fields.interacaoAtividade.interacaoTipoSubIdGuid = id;

          if ($scope.delegate.data.phones.length == 1) {
            registerCall();
            makeCall();
            setFields();
          }
        }
      });

      if ($scope.delegate.data.phones.length > 1) {
        $scope.delegate.data.phoneClient = null;
      }
    };

    var registerCall = function registerCall() {
      if ($rootScope.mainController.device == 'mobile') {
        var model = getModelBeforeSubmit();
        model.fields.interacaoAtividade.interacaoTexto = 'Tentativa de ligação';
        var attrs = {
          data: model,
          success: function success(response) {
            delegate(response);
          }
        };
        attrs.resource = $scope.$parent.resource || null;
        followupService.post(attrs);
      }

      $scope.model.fields.interacaoAtividade.interacaoTexto = 'Entrei em contato através do telefone ' + $filter('mask')($scope.delegate.data.phoneClient, 'tel') + ' e foi tratado';
    };

    $scope.phoneSelectedTitle = function () {
      if ($rootScope.mainController.device == 'desktop') {
        return 'Clique no número do telefone e já registre a ligação';
      } else {
        return 'Escolha o telefone para ligar.';
      }
    };

    var makeCall = function makeCall() {
      if ($rootScope.mainController.device == 'mobile') {
        document.location = cardActionFactory.getContactLinks($scope.delegate.data).phone;
        console.log(cardActionFactory.getContactLinks($scope.delegate.data).phone);
      }
    };

    $scope.loading = false;
    $scope.submitStatus = {
      success: false,
      error: false
    };
    $scope.form = null;
    $scope.formOptions = {};
    $scope.model = {
      fields: {
        interacaoAtividade: {}
      }
    };
    $scope.fields = [];

    var setFields = function setFields() {
      $scope.fields = [{
        key: 'interacaoDtInteracao',
        type: 'anaproDateTime',
        model: $scope.model.fields.interacaoAtividade,
        defaultValue: $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:00'),
        templateOptions: {
          label: 'Data da atividade',
          required: true
        }
      }, {
        type: 'textarea',
        model: $scope.model.fields.interacaoAtividade,
        key: 'interacaoTexto',
        templateOptions: {
          label: 'Registre aqui o que foi tratado na ligação com o número ' + $filter('mask')($scope.delegate.data.phoneClient, 'tel'),
          required: true,
          rows: 10,
          hint: 'Dica: Adicione Hashtags (#) para se organizar melhor!'
        }
      }];
    };

    var postExecute = function postExecute(response) {
      $timeout(function () {
        $scope.submitStatus.success = false;
        $scope.submitStatus.error = false;
        $scope.loading = false;

        if ($scope.$parent.modalDelegate) {
          $scope.$parent.modalDelegate.hide();
        }

        delegate(response);
      }, 500);
    };

    var delegate = function delegate(response) {
      if ($scope.delegate && response) {
        $scope.delegate.postItem(response.data);
      }
    };

    var getModelBeforeSubmit = function getModelBeforeSubmit() {
      return angular.copy($scope.model);
    };

    $scope.cancel = function () {
      if ($scope.$parent.modalDelegate) {
        $scope.$parent.modalDelegate.hide();
      }
    };

    $scope.submit = function (form) {
      $scope.form = form;

      if ($scope.form.$valid && !$scope.loading) {
        $scope.loading = true;
        var model = getModelBeforeSubmit();
        var attrs = {
          data: model,
          toastrMessages: getToastrMessages(),
          success: function success(response) {
            $scope.submitStatus.success = true;
            postExecute(response);
            $scope.formOptions.resetModel();
          },
          error: function error() {
            $scope.submitStatus.error = true;
            postExecute();
          }
        };
        attrs.resource = $scope.$parent.resource || null;
        followupService.post(attrs);
      }
    };

    var getToastrMessages = function getToastrMessages() {
      return {
        success: {
          title: 'Mensagem registrada com sucesso.'
        },
        serverError: {
          title: 'Desculpe, estamos com dificuldades para registrar sua mensagem',
          message: 'Tente novamente mais tarde, obrigado.'
        }
      };
    };
  }).directive('cardActionsCall', function () {
    return {
      restrict: 'E',
      templateUrl: 'card-actions/card-actions-call.html',
      controller: 'CardActionsCallController',
      scope: {
        active: '=?',
        delegate: '=?'
      },
      replace: true
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.card-actions-email', []).controller('CardActionsEmailController', function ($scope, cardActionFactory, mainController) {
    $scope.cardActionsEmailSelectDelegate = {
      emailSelected: function emailSelected(email) {
        $scope.delegate.data.emailClient = email;
        send();
      }
    };

    $scope.$parent.cardActionsTabSelectedDelegate['email'] = function () {
      if ($scope.$parent.modalDelegate) {
        $scope.$parent.modalDelegate.setTitle('Email');
      }

      if ($scope.delegate.data.emails.length > 1) {
        $scope.delegate.data.emailClient = null;
      } else {
        send();
      }
    };

    var getMessageUrl = function getMessageUrl() {
      return cardActionFactory.getContactLinks($scope.delegate.data).email;
    };

    var send = function send() {
      var newWindow = mainController.getDevice() == 'desktop';

      if (newWindow) {
        window.open(getMessageUrl(), 'AnaproAppSendEmail');
      } else {
        document.location = getMessageUrl();
      }

      $scope.$parent.setTabSelected({
        targetId: 'activity'
      });

      if ($scope.$parent.modalDelegate) {
        $scope.$parent.modalDelegate.hide();
      }
    };
  }).directive('cardActionsEmail', function () {
    return {
      restrict: 'E',
      templateUrl: 'card-actions/card-actions-email.html',
      controller: 'CardActionsEmailController',
      scope: {
        active: '=?',
        delegate: '=?'
      },
      replace: true
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.card-actions-note', []).controller('CardActionsNoteController', function ($rootScope, $scope, $timeout, $filter, followupService) {
    if ($scope.$parent.cardActionsTabSelectedDelegate) {
      $scope.$parent.cardActionsTabSelectedDelegate['note'] = function (attrs) {
        console.log('cardActionsTabSelectedDelegate["note"]', attrs);

        if ($scope.$parent.modalDelegate) {
          $scope.$parent.modalDelegate.setTitle('Anotação');
        }
      };
    }

    $scope.loading = false;
    $scope.submitStatus = {
      success: false,
      error: false
    };
    $scope.form = null;
    $scope.formOptions = {};
    var modelFoo = {
      reminder: false
    };
    $scope.model = {
      fields: {
        interacaoNota: {
          tarefa: {
            alarme: {}
          }
        }
      }
    };
    $scope.fields = [];

    var hideDateTime = function hideDateTime() {
      if ($scope.edit || modelFoo.reminder) {
        return false;
      }

      if (alarmeDtAlarmeField.model[alarmeDtAlarmeField.key]) {
        delete alarmeDtAlarmeField.model[alarmeDtAlarmeField.key];
      }

      return true;
    };

    if (!$scope.edit) {
      $scope.fields.push({
        type: 'textarea',
        model: $scope.model.fields.interacaoNota,
        key: 'interacaoTexto',
        templateOptions: {
          required: true,
          placeholder: 'escreva sua nota',
          rows: 10,
          hint: 'Dica: Adicione Hashtags (#) para se organizar melhor!'
        }
      }, {
        template: '<hr />'
      }, {
        type: 'anaproCheckbox',
        model: modelFoo,
        key: 'reminder',
        templateOptions: {
          label: 'Lembre-me'
        }
      });
    }

    var alarmeDtAlarmeField = {
      key: 'alarmeDtAlarme',
      type: 'anaproDateTime',
      model: $scope.model.fields.interacaoNota.tarefa.alarme,
      hideExpression: hideDateTime,
      defaultValue: $filter('date')(new Date(new Date().setHours(new Date().getHours() + 2)), 'yyyy-MM-ddTHH:00:00'),
      templateOptions: {
        label: 'Data e Hora',
        required: true,
        min: new Date()
      },
      validation: {
        messages: {
          min: '"A data precisa ser maior que agora"'
        }
      }
    };
    $scope.fields.push(alarmeDtAlarmeField);

    var postExecute = function postExecute(response) {
      $timeout(function () {
        $scope.submitStatus.success = false;
        $scope.submitStatus.error = false;
        $scope.loading = false;

        if ($scope.$parent.modalDelegate) {
          $scope.$parent.modalDelegate.hide();
        }

        delegate(response);
      }, 500);
    };

    var delegate = function delegate(response) {
      if ($scope.delegate && response) {
        if ($scope.edit) {
          $scope.delegate.reschedule(response.data);
        } else {
          $scope.delegate.postItem(response.data);
        }
      }
    };

    var getModelBeforeSubmit = function getModelBeforeSubmit() {
      var model = angular.copy($scope.model);

      if (model.fields.interacaoNota.tarefa.alarme.alarmeDtAlarme) {
        model.fields.interacaoNota.tarefa.tarefaDtTarefa = model.fields.interacaoNota.tarefa.alarme.alarmeDtAlarme;
      }

      if ($scope.edit) {
        model = {
          fields: model.fields.interacaoNota
        };
      }

      return model;
    };

    $scope.cancel = function () {
      if ($scope.$parent.modalDelegate) {
        $scope.$parent.modalDelegate.hide();
      }
    };

    $scope.submit = function () {
      if ($scope.form.$valid && !$scope.loading) {
        $scope.loading = true;
        var model = getModelBeforeSubmit();
        var attrs = {
          item: $scope.item,
          data: model,
          toastrMessages: getToastrMessages(),
          success: function success(response) {
            $scope.submitStatus.success = true;
            postExecute(response);
            $scope.formOptions.resetModel();
          },
          error: function error() {
            $scope.submitStatus.error = true;
            postExecute();
          }
        };

        if ($scope.edit) {
          attrs.action = 'reschedule';
          followupService.actions(attrs);
        } else {
          attrs.resource = $scope.$parent.resource || null;
          followupService.post(attrs);
        }
      }
    };

    var getToastrMessages = function getToastrMessages() {
      var messageActionSuccess, messageActionError;

      if ($scope.edit) {
        messageActionError = 'remarcar';
        messageActionSuccess = 'remarcada';
      } else {
        messageActionError = 'inserir';
        messageActionSuccess = 'criada';
      }

      return {
        success: {
          title: 'Nota ' + messageActionSuccess + ' com sucesso.'
        },
        serverError: {
          title: 'Desculpe, estamos com dificuldades para ' + messageActionError + ' sua nota',
          message: 'Tente novamente mais tarde, obrigado.'
        }
      };
    };
  }).directive('cardActionsNote', function () {
    return {
      restrict: 'E',
      templateUrl: 'card-actions/card-actions-note.html',
      controller: 'CardActionsNoteController',
      scope: {
        active: '=?',
        edit: '=?',
        item: '=?',
        delegate: '=?'
      },
      replace: true
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.card-actions-sms', []).controller('CardActionsSmsController', function ($scope) {
    $scope;
  }).directive('cardActionsSms', function () {
    return {
      restrict: 'E',
      templateUrl: 'card-actions/card-actions-sms.html',
      controller: 'CardActionsSmsController',
      scope: {
        active: '='
      },
      replace: true
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.card-actions-tab-button', []).controller('CardActionsTabButtonController', function ($scope) {
    $scope.setTabSelected = function () {
      $scope.$parent.setTabSelected({
        targetId: $scope.targetId
      }); // if($scope.dataToggle){
      // 	$scope.$parent.tabSelected = $scope.targetId;
      // }
    };
  }).directive('cardActionsTabButton', function (mainController) {
    var link = function link(scope, element, attributes) {
      if (mainController.getDevice() == 'desktop' && /mailto|wa\.me/.test(attributes.ngHref)) {
        element.find('a').attr('target', '_blank');
      }
    };

    return {
      restrict: 'E',
      templateUrl: 'card-actions/card-actions-tab-button.html',
      controller: 'CardActionsTabButtonController',
      transclude: true,
      replace: true,
      link: link,
      scope: {
        targetId: '@targetId',
        href: '@',
        icon: '@',
        active: '=',
        disabled: '@'
      }
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.card-actions-tour', []).controller('CardActionsTourController', function ($scope) {
    $scope;
  }).directive('cardActionsTour', function () {
    return {
      restrict: 'E',
      templateUrl: 'card-actions/card-actions-tour.html',
      controller: 'CardActionsTourController',
      scope: {
        active: '='
      },
      replace: true
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.card-actions-whatsapp', []).controller('CardActionsWhatsappController', function ($rootScope, $scope, $timeout, $filter, $element, followupService, followupSubTypes, cardActionFactory, mainController) {
    $scope.cardActionsPhoneSelectDelegate = {
      phoneSelected: function phoneSelected(phoneNumber) {
        $scope.delegate.data.phoneClient = phoneNumber;
      }
    };

    if ($scope.$parent.cardActionsTabSelectedDelegate) {
      $scope.$parent.cardActionsTabSelectedDelegate['whatsapp'] = function () {
        if ($scope.$parent.modalDelegate) {
          $scope.$parent.modalDelegate.setTitle('Whatsapp');
        }

        cardActionFactory.getSubTypeId({
          interacaoTipoSub: followupSubTypes.whatsapp,
          success: function success(id) {
            $scope.model.fields.interacaoAtividade.interacaoTipoSubIdGuid = id;
          }
        });

        if ($scope.delegate.data.phones.length > 1) {
          $scope.delegate.data.phoneClient = null;
        }
      };
    }

    var getMessageUrl = function getMessageUrl() {
      return cardActionFactory.getContactLinks($scope.delegate.data).whatsapp + '?text=' + encodeURIComponent($scope.model.fields.interacaoAtividade.interacaoTexto);
    };

    var sendMessage = function sendMessage(newWindow) {
      if (newWindow) {
        window.open(getMessageUrl(), 'AnaproAppWhatsapp');
      } else {
        document.location = getMessageUrl();
      }
    };

    $scope.loading = false;
    $scope.submitStatus = {
      success: false,
      error: false
    };
    $scope.form = null;
    $scope.formOptions = {};
    $scope.model = {
      fields: {
        interacaoAtividade: {}
      }
    };
    $scope.fields = [{
      type: 'textarea',
      model: $scope.model.fields.interacaoAtividade,
      key: 'interacaoTexto',
      defaultValue: 'Olá ' + $scope.delegate.data.prospectNome,
      templateOptions: {
        label: 'Whatsapp',
        required: true,
        placeholder: 'Escreva aqui a mensagem para enviar pelo Whatsapp',
        rows: 10
      }
    }];

    var postExecute = function postExecute(response) {
      $timeout(function () {
        $scope.submitStatus.success = false;
        $scope.submitStatus.error = false;
        $scope.loading = false;

        if ($scope.$parent.modalDelegate) {
          $scope.$parent.modalDelegate.hide();
        }

        delegate(response);
      }, 500);
    };

    var delegate = function delegate(response) {
      if ($scope.delegate && response) {
        $scope.delegate.postItem(response.data);
      }
    };

    var getModelBeforeSubmit = function getModelBeforeSubmit() {
      return angular.copy($scope.model);
    };

    $scope.cancel = function () {
      if ($scope.$parent.modalDelegate) {
        $scope.$parent.modalDelegate.hide();
      }
    };

    $scope.submit = function (form) {
      $scope.form = form;

      if ($scope.form.$valid && !$scope.loading) {
        if (mainController.getDevice() == 'desktop') {
          sendMessage(true);
        }

        $scope.loading = true;
        var model = getModelBeforeSubmit();
        var attrs = {
          data: model,
          toastrMessages: getToastrMessages(),
          success: function success(response) {
            $scope.submitStatus.success = true;
            postExecute(response);

            if (mainController.getDevice() == 'mobile') {
              sendMessage();
            }

            $scope.formOptions.resetModel();
          },
          error: function error() {
            $scope.submitStatus.error = true;
            postExecute();
          }
        };
        attrs.resource = $scope.$parent.resource || null;
        followupService.post(attrs);
      }
    };

    var getToastrMessages = function getToastrMessages() {
      return {
        success: {
          title: 'Mensagem registrada com sucesso.'
        },
        serverError: {
          title: 'Desculpe, estamos com dificuldades para registrar sua mensagem',
          message: 'Tente novamente mais tarde, obrigado.'
        }
      };
    };
  }).directive('cardActionsWhatsapp', function () {
    return {
      restrict: 'E',
      templateUrl: 'card-actions/card-actions-whatsapp.html',
      controller: 'CardActionsWhatsappController',
      scope: {
        active: '=?',
        delegate: '=?'
      },
      replace: true
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.card-actions.factory', []).factory('cardActionFactory', function ($modal, followupService, mainController, transactionsService) {
    var modalTitlesByTabName = {
      default: 'Ações',
      activity: 'Atividade',
      note: 'Nota',
      'call-activity': 'Ligação',
      email: 'E-mail',
      whatsapp: 'WhatsApp'
    };

    var getContactLinks = function getContactLinks(data) {
      return {
        email: 'mailto:' + data.emailClient + '?subject=' + (data.title || '') + '&cc=' + data.emailFollowup + '&body=' + 'Olá ' + data.prospectNome + ',%0A%0A%0A',
        phone: data.phoneClient ? 'tel:' + data.phoneClient : null,
        whatsapp: data.phoneClient ? '//wa.me/55' + data.phoneClient : null
      };
    };

    var getSubTypeId = function getSubTypeId(attrs) {
      followupService.getSubTypes({
        success: function success(response) {
          var id;
          response.data.data.map(function (item) {
            if (item.fields.interacaoTipoSubSys == attrs.interacaoTipoSub) {
              id = item.fields.interacaoTipoSubIdGuid;
            }
          });

          if (typeof attrs.success == 'function') {
            attrs.success(id);
          }
        }
      });
    };

    var preventModalAndPerformAction = function preventModalAndPerformAction(attrs) {
      if (attrs.data) {
        attrs.data.emails = attrs.data.emails || [];
        var contactLinks = getContactLinks(attrs.data);

        if (attrs.tabButtonActivated == 'email' && attrs.data.emails.length == 1) {
          if (mainController.getDevice() == 'desktop') {
            window.open(contactLinks.email, 'AnaproAppSendEmail');
          } else {
            document.location = contactLinks.email;
          }

          return true;
        }
      }

      return false;
    };

    var showModal = function showModal(attrs) {
      if (preventModalAndPerformAction(attrs)) {
        return;
      }

      return $modal({
        templateUrl: 'card-actions/card-actions-modal.html',
        show: true,
        animation: 'am-fade-and-slide-top',
        controller: function controller($scope, $timeout) {
          $scope.hideTabButtons = true;
          $scope.cardActionsAttrs = attrs;
          $scope.delegate = {
            setTitle: function setTitle(title) {
              $scope.title = title;
            }
          };
          $scope.title = $scope.cardActionsAttrs.tabButtonActivated ? modalTitlesByTabName[$scope.cardActionsAttrs.tabButtonActivated] : modalTitlesByTabName['default'];

          if ($scope.cardActionsAttrs.tabButtonActivated) {
            $timeout(function () {
              $scope.delegate.setTabSelected({
                targetId: $scope.cardActionsAttrs.tabButtonActivated
              });
            });
          }
        },
        onHide: function onHide() {
          console.log('onHide');
        }
      });
    };

    var getNewCardActionsData = function getNewCardActionsData() {
      var data = {
        title: '',
        emailFollowup: '',
        prospectNome: '',
        emailClient: null,
        emails: [],
        phoneClient: null,
        phones: []
      };
      data.update = updateCardActionsData.bind(data);
      return data;
    };

    var updateCardActionsData = function updateCardActionsData(newData) {
      var data = this; //normalize arrays

      newData.emails = newData.emails || [];
      newData.phones = newData.phones || []; // empty arrays

      data.emails.splice(0, data.emails.length);
      data.phones.splice(0, data.phones.length);
      angular.merge(data, newData);
      data.emailClient = data.emails.length == 1 ? data.emails[0].prospectEmailValor : null;
      data.phoneClient = data.phones.length == 1 ? data.phones[0].prospectTelefoneFull : null;
      return data;
    };

    var getItemByResourceServices = {
      transactions: function transactions(attrs) {
        transactionsService.getItem({
          id: attrs.resource.id,
          params: {
            '_expand': ['clients']
          },
          success: function success(response) {
            response.data.extraInfo.prospectTelefones = response.data.expand.clients.fields.prospectTelefones;
            response.data.extraInfo.prospectEmails = response.data.expand.clients.fields.prospectEmails;
            attrs.success(response.data);
          },
          error: attrs.error
        });
      }
    };

    var getItemByResource = function getItemByResource(attrs) {
      getItemByResourceServices[attrs.resource.resource](attrs);
    };

    var service = {
      getContactLinks: getContactLinks,
      showModal: showModal,
      getSubTypeId: getSubTypeId,
      getNewCardActionsData: getNewCardActionsData,
      modalTitlesByTabName: modalTitlesByTabName,
      getItemByResource: getItemByResource
    };
    return service;
  });
})();

'use strict';

(function () {
  angular.module('directives.card-actions', ['directives.card-actions-tab-button', 'directives.card-actions-tour', 'directives.card-actions-email', 'directives.card-actions-call', 'directives.card-actions-sms', 'directives.card-actions-note', 'directives.card-actions-activity', 'directives.card-actions-whatsapp', 'directives.card-actions-phone-select', 'directives.card-actions-email-select', 'directives.card-actions-select-client', 'directives.card-actions.factory']).controller('CardActionsController', function ($scope, $element, $timeout, $rootScope, path, cardActionFactory, mainController) {
    $scope.tabButtonAttrs = $scope.tabButtonAttrs || {};

    if (!$scope.hideTabButtons) {
      $scope.hideTabButtons = false;
    }

    $scope.isHiddenTabButtons = function () {
      return $scope.hideTabButtons && $scope.tabButtonActivated;
    };

    $scope.delegate = $scope.delegate || {
      postItem: function postItem() {
        console.log('directives.card-actions.delegate.postItem()');
      },
      reschedule: function reschedule() {
        console.log('directives.card-actions.delegate.reschedule()');
      }
    };
    var onlyTabButtonsList = [];
    $scope.cardActionsTabSelectedDelegate = {};

    var setOnlyTabButtonsList = function setOnlyTabButtonsList() {
      if (typeof $scope.onlyTabButtons === 'string' && $scope.onlyTabButtons != '') {
        onlyTabButtonsList = $scope.onlyTabButtons.split(',');
      }
    };

    $scope.isTabButtonListed = function (tabButton) {
      return onlyTabButtonsList.length === 0 || onlyTabButtonsList.indexOf(tabButton) >= 0;
    };

    if (mainController.getDevice() == 'desktop' && !$scope.tabButtonActivated) {
      $scope.tabButtonActivated = 'activity';
    }

    $scope.isActived = function (tabButton) {
      return $scope.tabButtonActivated == tabButton;
    };

    $scope.tabSelected = null;

    $scope.setTabSelected = function (attrs) {
      $scope.tabSelected = attrs.targetId;
      var tabAction = $($element[0]).find('#tab-acoes-' + attrs.targetId);

      if (tabAction.length) {
        $scope.tabButtonActivated = attrs.targetId;
        $($element[0]).find('.tab-pane').removeClass('active');
        tabAction.addClass('active');
      }

      if (typeof $scope.cardActionsTabSelectedDelegate[attrs.targetId] === 'function') {
        $scope.cardActionsTabSelectedDelegate[attrs.targetId](attrs);
      }
    }; // set modal close delegate


    if ($scope.modalDelegate) {
      $scope.modalDelegate.reset = function () {
        $timeout(function () {
          $($element).find('.active').removeClass('active');
        }, 0);
        $scope.tabSelected = null;
      };

      $scope.modalDelegate.setTabSelected = $scope.setTabSelected;
    }

    $scope.cardActionsSelectClientDelegate = {
      setClientId: function setClientId(item) {
        $scope.data = cardActionFactory.getNewCardActionsData().update({
          title: item.extraInfo.produtoNome,
          emailFollowup: item.extraInfo.atendimentoFollowUpEmail,
          prospectNome: item.extraInfo.prospectNome,
          phones: item.extraInfo.prospectTelefones,
          emails: item.extraInfo.prospectEmails
        });
        $scope.cardActionsItemDelegate.data = $scope.data;
        $scope.resource.id = item.id;

        if ($scope.tabButtonActivated) {
          $timeout(function () {
            $scope.setTabSelected({
              targetId: $scope.tabButtonActivated
            });
          });
        }
      }
    };
    $scope.cardActionsItemDelegate = {
      postItem: function postItem(item) {
        item.extraInfo = item.extraInfo || {};
        angular.merge(item, {
          extraInfo: {
            prospectNome: $scope.data.prospectNome
          }
        }, {
          extraInfo: item.extraInfo
        });
        $scope.delegate.postItem(item);
      },
      data: $scope.data,
      tabButtonAttrs: $scope.tabButtonAttrs
    };
    var contactActionLinks = {};

    $scope.getContactActionLinks = function () {
      console.log('getContactActionsLinks');
      angular.merge(contactActionLinks, cardActionFactory.getContactLinks($scope.data));
      return contactActionLinks;
    };

    $scope.goToClient = function () {
      if ($scope.resource.resource == 'transactions') {
        $rootScope.mainController.go(path.get('transaction').withItem({
          id: $scope.resource.id
        }));
      }

      if ($scope.modalDelegate) {
        $scope.modalDelegate.hide();
      }
    };

    if ($scope.resource.id && !$scope.data) {
      $scope.loading = true;
      cardActionFactory.getItemByResource({
        resource: $scope.resource,
        success: function success(data) {
          $scope.cardActionsSelectClientDelegate.setClientId(data);
          $scope.loading = false;
        },
        error: function error() {
          if ($scope.modalDelegate) {
            $scope.modalDelegate.hide();
          }
        }
      });
    }

    setOnlyTabButtonsList();
  }).directive('cardActions', function () {
    return {
      restrict: 'E',
      templateUrl: 'card-actions/card-actions.html',
      controller: 'CardActionsController',
      scope: {
        delegate: '=?',
        modalDelegate: '=?modalDelegate',
        resource: '=resource',
        data: '=?data',
        onlyTabButtons: '@',
        tabButtonActivated: '@',
        tabButtonAttrs: '=?',
        hideTabButtons: '=?'
      }
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.card-client-profile', []).controller('CardClientProfileController', function ($rootScope, $scope, $timeout, $filter, $sce, anaproFormlyFactory, clientsService, permission) {
    $scope.blocks = ($scope.blocks || 'informacoespessoais,contato').split(',');
    $scope.expandedBlocks = ($scope.expandedBlocks || '').split(',');
    $scope.hideTitleBlocks = ($scope.hideTitleBlocks || '').split(',');
    $scope.loading = false;
    $scope.submitStatus = {
      success: false,
      error: false
    };
    var fieldsLayout = $rootScope.mainController.device == 'desktop' ? 'row' : 'column';
    $scope.form = null;
    $scope.formContact = null;

    var gernerateClientContactMultiInputFieldsAttrs = function gernerateClientContactMultiInputFieldsAttrs(attrs) {
      var tooltip = {};

      if (attrs.permissionStatus === 'disabled') {
        tooltip = {
          title: $sce.trustAsHtml(attrs.tooltip.disabled),
          type: 'error'
        };
      } else if (attrs.permissionStatus === false) {
        tooltip = {
          title: $sce.trustAsHtml(attrs.tooltip.forbidden),
          type: 'warn'
        };
      }

      return {
        attrs: {
          'ng-readonly': 'to.readonly',
          'bs-tooltip': 'options.data.tooltip'
        },
        expressions: attrs.permissionStatus === true ? {} : {
          'templateOptions.noErrorSpace': '!!model.' + attrs.fieldId,
          'templateOptions.readonly': function templateOptionsReadonly(currentValue, newValue, scope) {
            return !!scope.model[attrs.fieldId];
          },
          'data.tooltip': function dataTooltip(currentValue, newValue, scope) {
            if (scope.model[attrs.fieldId]) {
              return tooltip;
            } else {
              return {};
            }
          }
        }
      };
    };

    var initAndUpdateClient = function initAndUpdateClient(client) {
      if (client) {
        angular.extend($scope.client, client);
      }

      if ($scope.client) {
        $scope.edit = true;
      }

      $scope.model = {
        fields: {
          prospect: {}
        }
      };
      $scope.modelContact = {
        fields: {}
      };
      $timeout(function () {
        setFields();
      }, 0);
    };

    $scope.fields = [];
    $scope.fieldsContact = [];

    var setFields = function setFields() {
      // client properties
      var permissionStatusClientProperties = permission.permissionStatus('pro_acessar_cadastro_de_prospect');
      var clientPropertiesPermission = {
        status: permissionStatusClientProperties,
        readonly: permissionStatusClientProperties !== true,
        attrs: permissionStatusClientProperties === true ? {} : {
          'readonly': '',
          'bs-tooltip': 'options.data.tooltip'
        },
        tooltip: permissionStatusClientProperties === true ? {} : permissionStatusClientProperties === 'disabled' ? {
          title: $sce.trustAsHtml('Desculpe, a edição do cadastro do cliente está ' + 'temporariamente desativado'),
          type: 'error'
        } : {
          title: $sce.trustAsHtml('Você, não tem permissão para editar o cadastro do cliente'),
          type: 'warn'
        }
      };
      $scope.fields = [{
        type: 'input',
        key: 'prospectNome',
        model: clientPropertiesPermission.readonly ? {} : $scope.model.fields.prospect,
        defaultValue: $scope.client.fields.prospect.prospectNome,
        ngModelElAttrs: clientPropertiesPermission.attrs,
        data: {
          tooltip: clientPropertiesPermission.tooltip
        },
        elementAttributes: {
          'layout': fieldsLayout
        },
        templateOptions: {
          label: 'Nome completo:',
          type: 'text',
          required: true,
          placeholder: 'Nome do cliente',
          minlength: 6,
          maxlength: 100
        }
      }, {
        type: 'anaproDate',
        key: 'prospectDtNascimento',
        model: clientPropertiesPermission.readonly ? {} : $scope.model.fields.prospect,
        defaultValue: $scope.client.fields.prospect.prospectDtNascimento,
        ngModelElAttrs: clientPropertiesPermission.attrs,
        data: {
          tooltip: clientPropertiesPermission.tooltip
        },
        className: 'input-nogrow',
        elementAttributes: {
          'layout': fieldsLayout
        },
        templateOptions: {
          label: 'Data de aniversário:',
          max: $filter('date')(new Date(), 'yyyy-MM-ddT00:00:00'),
          dateFormat: 'yyyy-MM-ddT00:00:00'
        },
        validation: {
          messages: {
            max: function max() {
              return 'A data de nascimento precisa ser menor ou igual a hoje';
            }
          }
        }
      }, {
        type: 'radio',
        key: 'prospectSexo',
        model: clientPropertiesPermission.readonly ? {} : $scope.model.fields.prospect,
        defaultValue: $scope.client.fields.prospect.prospectSexo,
        ngModelElAttrs: clientPropertiesPermission.attrs,
        data: {
          tooltip: clientPropertiesPermission.tooltip
        },
        elementAttributes: {
          'layout': fieldsLayout
        },
        templateOptions: {
          label: 'Sexo: ',
          noErrorSpace: true,
          options: [{
            name: 'Masculino',
            value: 'M'
          }, {
            name: 'Feminino',
            value: 'F'
          }]
        }
      }]; // documentos

      if (permission.permissionStatus('pro_visualizar_documento') === true) {
        var clientDocumentsPermission = gernerateClientContactMultiInputFieldsAttrs({
          permissionStatus: permission.permissionStatus('pro_excluir_documento'),
          fieldId: 'prospectDocumentoIdGuid',
          tooltip: {
            disabled: 'Desculpe, a edição de documentos do cliente está ' + 'temporariamente desativado',
            forbidden: 'Você, não tem permissão para editar os documentos do cliente'
          }
        });
        $scope.fields.push({
          type: 'multiinput',
          key: 'prospectDocumentos',
          model: $scope.model.fields,
          defaultValue: $scope.client.fields.prospectDocumentos,
          elementAttributes: {
            'layout': 'column'
          },
          className: 'input-nogrow',
          templateOptions: {
            label: 'Número de documentos:'
          },
          data: {
            // layout: 'column',
            keepOnRemoveWhenContainsKey: 'prospectDocumentoIdGuid',
            addLabel: 'Adicionar número de documento',
            fieldTypeKey: 'prospectDocumentoTipo',
            fieldTypeKeyUnique: true,
            fieldsByType: {
              CPF: [{
                type: 'maskedInput',
                key: 'prospectDocumentoValor',
                ngModelElAttrs: clientDocumentsPermission.attrs,
                templateOptions: {
                  required: true,
                  cpf: true,
                  placeholder: 'CPF do cliente',
                  noErrorSpace: clientDocumentsPermission.readonly
                },
                expressionProperties: clientDocumentsPermission.expressions
              }]
            }
          }
        });
      }

      $scope.fieldsContact = []; // emails

      if (permission.permissionStatus('pro_visualizar_email') === true) {
        var clientEmailPermission = gernerateClientContactMultiInputFieldsAttrs({
          permissionStatus: permission.permissionStatus('pro_excluir_email'),
          fieldId: 'prospectEmailIdGuid',
          tooltip: {
            disabled: 'Desculpe, a edição de emails do cliente está ' + 'temporariamente desativado',
            forbidden: 'Você, não tem permissão para editar os emails do cliente'
          }
        });
        $scope.fieldsContact.push({
          type: 'multiinput',
          key: 'prospectEmails',
          model: $scope.modelContact.fields,
          defaultValue: $scope.client.fields.prospectEmails,
          elementAttributes: {
            'layout': 'column'
          },
          templateOptions: {
            label: 'Emails:'
          },
          data: {
            keepOnRemoveWhenContainsKey: 'prospectEmailIdGuid',
            layout: 'column',
            addLabel: 'Adicionar email',
            fields: [{
              type: 'anaproEmail',
              key: 'prospectEmailValor',
              ngModelElAttrs: clientEmailPermission.attrs,
              templateOptions: {
                placeholder: 'exemplo@exemplo.com',
                required: true,
                noErrorSpace: clientEmailPermission.readonly
              },
              expressionProperties: clientEmailPermission.expressions
            }]
          }
        });
      } // phone numbers


      if (permission.permissionStatus('pro_visualizar_telefone') === true) {
        var clientPhoneNumbersPermission = gernerateClientContactMultiInputFieldsAttrs({
          permissionStatus: permission.permissionStatus('pro_excluir_telefone'),
          fieldId: 'prospectTelefoneIdGuid',
          tooltip: {
            disabled: 'Desculpe, a edição de telefones do cliente está ' + 'temporariamente desativado',
            forbidden: 'Você, não tem permissão para editar os telefones do cliente'
          }
        });
        console.log(clientPhoneNumbersPermission);
        $scope.fieldsContact.push({
          type: 'multiinput',
          key: 'prospectTelefones',
          model: $scope.modelContact.fields,
          defaultValue: $scope.client.fields.prospectTelefones,
          elementAttributes: {
            'layout': 'column'
          },
          templateOptions: {
            label: 'Telefones:'
          },
          data: {
            keepOnRemoveWhenContainsKey: 'prospectTelefoneIdGuid',
            layout: 'row',
            addLabel: 'Adicionar telefone',
            fields: [{
              type: 'maskedInput',
              key: 'prospectTelefoneFull',
              elementAttributes: {
                'flex': '50'
              },
              ngModelElAttrs: clientPhoneNumbersPermission.attrs,
              templateOptions: {
                required: true,
                type: 'tel',
                placeholder: 'Telefone com DDD',
                mask: '(99) 9?9999-9999'
              },
              expressionProperties: clientPhoneNumbersPermission.expressions,
              validation: {
                messages: {
                  mask: function mask(newValue, oldValue, scope) {
                    newValue, oldValue, scope;
                    return 'Número de telefone inválido!';
                  }
                }
              }
            }, {
              type: 'input',
              key: 'prospectTelefoneRamal',
              className: 'multiinput-align-fields-row-padding',
              elementAttributes: {
                'flex': 'auto'
              },
              ngModelElAttrs: clientPhoneNumbersPermission.attrs,
              templateOptions: {
                type: 'text',
                placeholder: 'Ramal',
                maxlength: 10
              },
              expressionProperties: clientPhoneNumbersPermission.expressions
            }, {
              type: 'input',
              key: 'prospectTelefoneObs',
              elementAttributes: {
                'flex': 'auto'
              },
              ngModelElAttrs: clientPhoneNumbersPermission.attrs,
              templateOptions: {
                type: 'text',
                placeholder: 'Obs.',
                maxlength: 100
              },
              expressionProperties: clientPhoneNumbersPermission.expressions
            }]
          }
        });
      } // addresses


      if (permission.permissionStatus('pro_visualizar_endereco') === true) {
        var clientAddressesPermission = gernerateClientContactMultiInputFieldsAttrs({
          permissionStatus: permission.permissionStatus('pro_excluir_endereco'),
          fieldId: 'prospectEnderecoIdGuid',
          tooltip: {
            disabled: 'Desculpe, a edição de endereços do cliente está ' + 'temporariamente desativado',
            forbidden: 'Você, não tem permissão para editar os endereços do cliente'
          }
        });
        clientAddressesPermission;
        $scope.fieldsContact.push({
          type: 'multiinput',
          key: 'prospectEnderecos',
          model: $scope.modelContact.fields,
          defaultValue: $scope.client.fields.prospectEnderecos,
          elementAttributes: {
            'layout': 'column'
          },
          templateOptions: {
            label: 'Endereços:'
          },
          data: {
            keepOnRemoveWhenContainsKey: 'prospectEnderecoIdGuid',
            layout: 'column',
            addLabel: 'Adicionar endereço',
            fields: [{
              type: 'address',
              className: 'no-padding-bottom',
              // ngModelElAttrs: clientAddressesPermission.attrs,
              templateOptions: {
                required: true
              },
              expressionProperties: clientAddressesPermission.expressions,
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
            }]
          }
        });
      }
    };

    initAndUpdateClient();

    var postExecute = function postExecute() {
      $timeout(function () {
        $scope.submitStatus.success = false;
        $scope.submitStatus.error = false;
        $scope.loading = false;
      }, 500);
    };

    var submitError = function submitError() {
      $scope.submitStatus.error = true;
      postExecute();
    };

    var submitSuccess = function submitSuccess(response) {
      initAndUpdateClient(response.data);
      $scope.submitStatus.success = true;
      postExecute();
    };

    $scope.cancel = function (fields, model) {
      anaproFormlyFactory.resetModel(fields, model);
    };

    $scope.submit = function (form, fields, model) {
      if (form.$valid && !$scope.loading) {
        $scope.loading = true;
        clientsService.patchItem({
          item: $scope.client,
          data: model,
          toastrMessages: {
            serverError: {
              title: 'Desculpe, estamos com dificuldades para atualizar os dados do cliente.',
              message: 'Tente novamente mais tarde, obrigado.'
            }
          },
          success: submitSuccess,
          error: submitError
        });
      }
    };

    $scope.hasBlock = function (block) {
      return $scope.blocks.indexOf(block) >= 0;
    };

    $scope.isExpandedBlock = function (block) {
      return $scope.expandedBlocks.indexOf(block) >= 0;
    };

    $scope.isTitleBlockHidden = function (block) {
      return $scope.hideTitleBlocks.indexOf(block) >= 0;
    };
  }).directive('cardClientProfile', function () {
    return {
      restrict: 'E',
      scope: {
        title: '@',
        client: '=',
        blocks: '@',
        expandedBlocks: '@',
        hideTitleBlocks: '@'
      },
      controller: 'CardClientProfileController',
      templateUrl: 'card-client-profile/card-client-profile.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.card-followup', ['directives.card-followup-item', 'services.followup']).controller('CardFollowupController', function ($scope, $timeout, followupService) {
    $scope.loading = true;
    $scope.data = {
      fields: []
    };
    var filterByType;

    $scope.getClass = function (item) {
      return {
        removed: item.removed,
        added: item.added && !item.removed
      };
    };

    $scope.toggleFilterByType = function (type) {
      var index = filterByType.indexOf(type);

      if (index < 0) {
        filterByType.push(type);
      } else {
        filterByType.splice(index, 1);
      }
    };

    $scope.isTypeInFilterList = function (item) {
      if (item.constructor.name == 'String') {
        return filterByType.indexOf(item) >= 0;
      } else if (filterByType.length === 0) {
        return true;
      } else if (item.fields) {
        var itemType = Object.keys(item.fields)[0];

        if (!$scope.summaryLabels[itemType]) {
          itemType = 'interacaoLog';
        }

        return filterByType.indexOf(itemType) >= 0;
      }

      return false;
    };

    $scope.summaryLabels = {
      interacaoAtividade: 'Atividades',
      interacaoVisita: 'Visitas',
      interacaoEmail: 'E-mails',
      interacaoChat: 'Chat',
      interacaoLigacao: 'Ligações',
      interacaoProposal: 'Proposta',
      interacaoNota: 'Notas',
      interacaoLog: 'Sistema'
    };

    var setFilterByType = function setFilterByType() {
      if (Object.keys($scope.summary).length > 1 && !filterByType) {
        filterByType = Object.keys($scope.summaryLabels).filter(function (item) {
          return item != 'interacaoLog';
        });
      }

      filterByType = filterByType || [];
    };

    var setSummary = function setSummary() {
      $scope.summary = {};
      var items = [].concat($scope.data.fields.due, $scope.data.fields.overdue, $scope.data.fields.done, $scope.data.fields.unread);
      items.map(function (item) {
        if (item) {
          var itemType = Object.keys(item.fields)[0];

          if (!$scope.summaryLabels[itemType]) {
            itemType = 'interacaoLog';
          }

          $scope.summary[itemType] = !$scope.summary[itemType] ? 1 : $scope.summary[itemType] + 1;
        }
      });
      setFilterByType();
    };

    var deleteItem = function deleteItem(item) {
      var items = $scope.data.data;
      item.removed = true;

      if (items.overdue && items.overdue.indexOf(item) > -1) {
        items = items.overdue;
      } else if (items.due && items.due.indexOf(item) > -1) {
        items = items.due;
      }

      $timeout(function () {
        items.splice(items.indexOf(item), 1);
        setSummary();
      }, 500);
    };

    var addLogItem = function addLogItem(item) {
      $scope.data.fields.done = $scope.data.fields.done || [];
      $scope.data.fields.done.splice(0, 0, item);
      setSummary();
    };

    var addDueItem = function addDueItem(item) {
      $scope.data.fields.due = $scope.data.fields.due || [];
      $scope.data.fields.due.splice(0, 0, item);
      setSummary();
    };

    var patchItem = function patchItem(oldItem, newItem) {
      var items = $scope.data.fields;

      if (items.overdue.indexOf(oldItem) > -1) {
        items = items.overdue;
      } else if (items.due.indexOf(oldItem) > -1) {
        items = items.due;
      } else if (items.done.indexOf(oldItem) > -1) {
        items = items.done;
      }

      var index = items.indexOf(oldItem);
      items[index] = newItem;
    };

    $scope.followupItemDelegate = {
      deleteItem: deleteItem,
      patchItem: patchItem
    };

    $scope.delegate.addItem = function (item) {
      var type = Object.keys(item.fields)[0];
      item.added = true;

      if (item.fields[type].tarefa && item.fields[type].tarefa.alarme) {
        addDueItem(item);
      } else {
        addLogItem(item);
      }
    };

    var success = function success(response) {
      $scope.loading = false;
      $scope.data = response.data;
      setSummary();
    };

    var error = function error() {
      $scope.loading = false;
    };

    followupService.get({
      resource: $scope.resource,
      success: success,
      error: error,
      toastrMessages: {
        serverError: {
          title: 'Desculpe, estamos com dificuldades para exibir as interações e tarefas desse atendimento.'
        }
      }
    });
  }).directive('cardFollowup', function () {
    return {
      restrict: 'E',
      templateUrl: 'card-followup/card-followup.html',
      controller: 'CardFollowupController',
      scope: {
        modalDelegate: '=?modalDelegate',
        delegate: '=?',
        resource: '=resource'
      }
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.chat', []).controller('ChatController', function ($scope) {
    $scope;
  }).directive('chat', function () {
    return {
      restrict: 'E',
      templateUrl: 'chat/chat.html',
      controller: 'ChatController'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.client-avatar', []) // .controller(
  // 	'clientAvatarController',
  // 	function($scope){
  // 	}
  // )
  .directive('clientAvatar', function () {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        extra: '=?',
        transactionItem: '='
      },
      // controller: 'clientAvatarController',
      templateUrl: 'client-avatar/client-avatar.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.client-contacts.factory', []).factory('clientContactsFactory', function ($modal, $timeout, $popover) {
    $popover;

    var showModal = function showModal(attrs) {
      $modal({
        templateUrl: 'client-contacts/client-contacts-modal.html',
        show: true,
        animation: 'am-fade-and-slide-top',
        controller: function controller($scope) {
          $scope.id = attrs.id;
          $scope.clientContactsResource = attrs.resource;
          $scope.modalDelegate = {
            hide: function hide() {
              console.log('hide');
            }
          };
        },
        onHide: function onHide() {
          console.log('modalAddClient onHide');
        }
      });
    };

    var showPopover = function showPopover(attrs) {
      var scope = attrs.scope.$new();
      scope.popoverAttrs = attrs;
      var popover = $popover(attrs.element, {
        scope: scope,
        title: 'Dados do cliente',
        contentTemplate: 'client-contacts/client-contacts-popover.html',
        trigger: 'manual',
        autoClose: true,
        animation: 'am-flip-x',
        placement: 'bottom-left'
      });
      $timeout(popover.show);
      return popover;
    };

    var service = {
      showModal: showModal,
      showPopover: showPopover
    };
    return service;
  });
})();

'use strict';

(function () {
  angular.module('directives.client-contact', ['directives.client-contacts.factory']).controller('clientContactsController', function ($scope, cardActionFactory, transactionsService) {
    $scope.loading = true;

    $scope.showCardActionsModal = function (phoneClient, tabButtonActivated) {
      cardActionFactory.showModal({
        data: cardActionFactory.getNewCardActionsData().update({
          prospectNome: $scope.clientItem.fields.prospect.prospectNome,
          phones: [{
            prospectTelefoneFull: phoneClient
          }]
        }),
        resource: $scope.resource,
        tabButtonActivated: tabButtonActivated
      });
    };

    $scope.sendEmail = function (emailClient) {
      return cardActionFactory.getContactLinks({
        prospectNome: $scope.item.extraInfo.prospectNome,
        emailClient: emailClient,
        title: $scope.item.extraInfo.produtoNome,
        emailFollowup: $scope.item.extraInfo.atendimentoFollowUpEmail
      });
    };

    var success = function success(response) {
      $scope.item = response.data;
      $scope.clientItem = response.data.expand.clients;
      $scope.loading = false;
    };

    if ($scope.item) {
      success({
        data: $scope.item
      });
    } else if ($scope.resource && $scope.resource.id) {
      transactionsService.getItem({
        id: $scope.resource.id,
        params: {
          '_expand': ['clients']
        },
        success: success
      });
    }
  }).directive('clientContacts', function () {
    return {
      restrict: 'E',
      scope: {
        item: '=?',
        id: '=?',
        resource: '='
      },
      controller: 'clientContactsController',
      templateUrl: 'client-contacts/client-contacts.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.enriched-person-data', []).controller('EnrichedPersonDataController', function ($scope, enrichedDataTypesFactory, maskFilter) {
    var typesByFields = enrichedDataTypesFactory.getTypesByField();
    console.log(typesByFields);

    $scope.getTypeByField = function (item) {
      return typesByFields[item.field] || 'dataList';
    };

    $scope.getLabel = function (option, item) {
      if (item.field == 'enrichPersonPhone') {
        return maskFilter(option.name, 'tel');
      }

      return option.name;
    };

    var userImagesError = [];

    $scope.hideIcon = function (item) {
      userImagesError.push(item);
    };

    $scope.isUserImageError = function (item) {
      return userImagesError.indexOf(item) >= 0;
    };
  }).factory('enrichedDataTypesFactory', function () {
    var listTypes = {
      dataIcons: ['enrichPersonUrl'],
      dataImages: ['enrichPersonImage'],
      dataText: ['enrichPersonGender']
    };
    var typesByFields = {};
    Object.keys(listTypes).map(function (key) {
      listTypes[key].map(function (field) {
        typesByFields[field] = key;
      });
    });

    var getTypesByField = function getTypesByField() {
      return typesByFields;
    };

    return {
      getTypesByField: getTypesByField
    };
  }).directive('enrichedPersonData', function () {
    return {
      restrict: 'E',
      scope: {
        person: '='
      },
      controller: 'EnrichedPersonDataController',
      templateUrl: 'enriched-person-data/enriched-person-data.html'
    };
  }).directive('enrichedPersonDataIcons', function () {
    return {
      restrict: 'E',
      // controller: 'EnrichedPersonDataController',
      templateUrl: 'enriched-person-data/enriched-person-data-icons.html'
    };
  }).directive('enrichedPersonDataText', function () {
    return {
      restrict: 'E',
      // controller: 'EnrichedPersonDataController',
      templateUrl: 'enriched-person-data/enriched-person-data-text.html'
    };
  }).directive('enrichedPersonDataList', function () {
    return {
      restrict: 'E',
      // controller: 'EnrichedPersonDataController',
      templateUrl: 'enriched-person-data/enriched-person-data-list.html'
    };
  }).directive('enrichedPersonDataImages', function () {
    return {
      restrict: 'E',
      // controller: 'EnrichedPersonDataController',
      templateUrl: 'enriched-person-data/enriched-person-data-images.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.footer', []).controller('FooterController', function ($scope, $window) {
    $scope.version = $window.VERSION;
  }).directive('footer', function () {
    return {
      restrict: 'E',
      templateUrl: 'footer/footer.html',
      controller: 'FooterController'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.icon-medal', []).controller('IconMedalController', function ($scope) {
    $scope;
  }).directive('iconMedal', function () {
    return {
      restrict: 'E',
      scope: {
        number: '@number'
      },
      templateUrl: 'icon-medal/icon-medal.html',
      controller: 'IconMedalController as iconMedal'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.icon-svg', []).provider('iconsSVG', function () {
    var bundle = $('.iconSVGBundle symbol');
    var icons = {};
    $(bundle).each(function (key, element) {
      icons[element.getAttribute('id').replace('icon-svg-', '')] = {
        viewbox: element.getAttribute('viewBox'),
        paths: $(element).html()
      };
    });
    var self = this;
    self.icons = icons;

    self.$get = function () {
      return self;
    };
  }).controller('IconSVGController', function ($scope) {
    $scope;
  }).directive('iconSvg', function () {
    return {
      restrict: 'E',
      scope: {
        iconName: '@name',
        className: '@'
      },
      replace: true,
      templateUrl: 'icon-svg/icon-svg.html',
      controller: 'IconSVGController as iconSVG'
    };
  }).directive('iconSvgInline', function () {
    return {
      restrict: 'E',
      scope: {
        iconName: '@name',
        className: '@'
      },
      replace: true,
      controller: function controller($scope, $sce, iconsSVG) {
        $scope.icon = iconsSVG.icons[$scope.iconName] || {};
        $scope.svg = $sce.trustAsHtml($scope.icon.paths);
      },
      templateUrl: 'icon-svg/icon-svg-inline.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.img-src-error-remove', []).directive('onErrorSrcRemove', function () {
    return {
      restrict: 'A',
      link: function link(scope, element, attrs) {
        element.bind('error', function () {
          element.remove();

          if (attrs['onErrorSrcRemove']) {
            scope.$evalAsync(attrs['onErrorSrcRemove']);
          }
        });
      }
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.list.factory', []).run(function (CacheFactory) {
    CacheFactory('cacheLinks', {
      storagePrefix: 'AnaproAPP-Caches.',
      storageMode: 'localStorage',
      capacity: 100
    });
  }).factory('listFactory', function (CacheFactory) {
    var cacheLinks = CacheFactory.get('cacheLinks');

    var saveAttrsAndGetHashLink = function saveAttrsAndGetHashLink(attrs) {
      var hash = 0;
      var stringAttrs = {};

      try {
        stringAttrs = JSON.stringify(attrs);
      } catch (e) {}

      for (var i = 0; i < stringAttrs.length; i++) {
        hash = (hash << 5) - hash + stringAttrs.charCodeAt(i);
      }

      hash = hash.toString(36);

      if (!cacheLinks.get(hash)) {
        cacheLinks.put(hash, attrs);
      }

      return hash;
    };

    var getAttrsFromHash = function getAttrsFromHash(hash) {
      return cacheLinks.get(hash);
    };

    var getAttrsFromRouteParams = function getAttrsFromRouteParams(routeParams) {
      if (routeParams.hash) {
        return getAttrsFromHash(routeParams.hash) || {};
      } else if (routeParams.q) {
        return {
          params: {
            q: routeParams.q
          }
        };
      } else {
        return {};
      }
    };

    var service = {
      saveAttrsAndGetHashLink: saveAttrsAndGetHashLink,
      getAttrsFromRouteParams: getAttrsFromRouteParams
    };
    return service;
  });
})();

'use strict';

(function () {
  angular.module('directives.list', ['directives.list.factory']).controller('ListController', function ($scope) {
    $scope.listObj = $scope.$parent.listObj;
    $scope.listObj.listType = 'table';

    $scope.listObj.setListType = function (type) {
      $scope.listObj.listType = type;
    };

    $scope.listObj.selected = {
      items: [],
      toggle: function toggle(item) {
        if (this.has(item)) {
          this.items.splice(this.items.indexOf(item), 1);
        } else {
          this.items.push(item);
        }
      },
      has: function has(item) {
        return this.items.indexOf(item) >= 0;
      }
    };
  }).directive('list', function () {
    return {
      restrict: 'E',
      templateUrl: 'list/list.html',
      controller: 'ListController',
      scope: {},
      transclude: {
        table: '?listTypeTable',
        column: '?listTypeColumn'
      }
    };
  }).controller('ListColumnController', function ($scope) {
    $scope.listObj = $scope.$parent.listObj;
  }).directive('listColumn', function () {
    return {
      restrict: 'E',
      templateUrl: 'list/list-column.html',
      scope: {},
      controller: 'ListColumnController',
      transclude: true
    };
  }).controller('ListTableController', function ($scope, $timeout) {
    $scope.listObj = $scope.$parent.listObj; //$scope.hasPages = $scope.listObj.data.links.totalPages > 1;

    $scope.listObj.removeItem = function (item) {
      item.slideOutEffect = true;
      $timeout(function () {
        item.removed = true;
      }, 500);
    };
  }).directive('listTable', function () {
    return {
      restrict: 'E',
      templateUrl: 'list/list-table.html',
      scope: {},
      controller: 'ListTableController',
      transclude: true
    };
  }).controller('ListPaginationController', function ($rootScope, $scope) {
    $scope.listObj = $scope.$parent.listObj;
    var limitItems = $rootScope.mainController.device == 'desktop' ? 10 : 5;
    var limitItemsHalf = Math.floor(limitItems / 2);
    var fromItem = 2;
    var toItem = limitItems + 1;

    if ($scope.listObj.data.links.totalPages <= limitItems) {
      fromItem = 1;
      toItem = $scope.listObj.data.links.totalPages;
    } else if ($scope.listObj.data.links.currentPage == $scope.listObj.data.links.totalPages - 1) {
      toItem = $scope.listObj.data.links.totalPages;
      fromItem = toItem - limitItems;
    } else if ($scope.listObj.data.links.currentPage > limitItemsHalf) {
      fromItem = $scope.listObj.data.links.currentPage - limitItemsHalf;
      toItem = fromItem + limitItems;
    }

    if (toItem > $scope.listObj.data.links.totalPages) {
      var diff = toItem - $scope.listObj.data.links.totalPages;
      fromItem -= diff;
      toItem = $scope.listObj.data.links.totalPages;
    }

    $scope.limits = {
      limitItems: limitItems,
      fromItem: fromItem,
      toItem: toItem
    };
    var hashLinks = {};

    $scope.linkNavigation = function (link) {
      if (hashLinks[link]) {
        return hashLinks[link];
      }

      hashLinks[link] = $scope.listObj.delegate.gerFilterHashLink({
        link: link
      });
      return hashLinks[link];
    };

    $scope.linkNavigationFromNumber = function (page) {
      return $scope.linkNavigation($scope.listObj.data.links.first.replace(/(page=)./, '$1' + page));
    };

    $scope.getPaginationArray = function () {
      var links = $scope.listObj.data.links;

      if (links && links.totalPages) {
        return new Array(parseInt($scope.listObj.data.links.totalPages));
      }

      return new Array(0);
    };
  }).directive('listPagination', function () {
    return {
      restrict: 'E',
      templateUrl: 'list/list-pagination.html',
      scope: {},
      controller: 'ListPaginationController'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.list-filter', []).controller('ListFilterController', function ($scope, $routeParams, listFactory, destroyFactory) {
    $scope.listObj = $scope.$parent.listObj;

    if (!$scope.listObj.delegate || !$scope.listObj.delegate.get) {
      console.error('You must to implement the \'listObj.delegate.get\' on current $scope');
    }

    var setFilters = function setFilters() {
      $scope.listObj.delegate.get({
        params: {
          q: $scope.listFilter.model.q,
          filters: $scope.listFilter.model.filters
        },
        success: function success() {
          if ($scope.listFilter.modalDelegate.hide) {
            $scope.listFilter.modalDelegate.hide();
          }
        }
      });
    };

    var formQSubmit = function formQSubmit(form) {
      if (form.$invalid) {
        return;
      }

      $scope.listObj.delegate.get({
        params: {
          q: $scope.listFilter.model.q
        }
      });
    };

    var model = {
      q: '',
      filters: {}
    };
    model = listFactory.getAttrsFromRouteParams($routeParams).params || model;
    $scope.listFilter = {
      model: model,
      formQSubmit: formQSubmit,
      setFilters: setFilters,
      modalDelegate: {}
    };
    destroyFactory({
      scope: $scope,
      objects: [$scope.listFilter]
    });
  }).directive('listFilter', function () {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      templateUrl: 'list-filter/list-filter.html',
      controller: 'ListFilterController'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.loading-spinner', []).controller('LoadingSpinnerController', function ($scope) {
    $scope;
  }).directive('loadingSpinner', function () {
    return {
      restrict: 'E',
      templateUrl: 'loading-spinner/loading-spinner.html',
      controller: 'LoadingSpinnerController as loadingSpinner'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.mainController', []).controller('MainController', function ($rootScope, $scope, $location, $element, $timeout, path, mainController, usersService) {
    console.log('main controller'); // redirect between views
    // used by ng-click

    var go = function go(view, replace) {
      if (view) {
        if (replace) $location.path(view).replace();else $location.path(view);
      }
    }; // automatically invoked by provider.path.setCurrent(name)
    // do NOT call it by yourself


    var setViewAttribute = function setViewAttribute() {
      $($element).attr('view', path.getCurrentViewName());
      $scope.mainController.currentView = path.getCurrentViewName();
    };

    $scope.userProfileLoaded = function () {
      return usersService.isProfileLoaded();
    }; // hold all main controller communication


    $rootScope.mainController = {
      device: mainController.getDevice(),
      go: go,
      currentView: null,
      setViewAttribute: setViewAttribute
    }; // set device attribute

    $($element).attr('device', $scope.mainController.device);
  }).directive('mainController', function () {
    return {
      restrict: 'E',
      templateUrl: 'main-controller/main-controller.html',
      controller: 'MainController'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.modal', []).controller('ModalController', function ($location, $rootScope, $scope, $attrs, $document, $element, $timeout) {
    $scope.attrs = $attrs;

    if (!$scope.delegate) {
      $scope.delegate = {};
      console.error('You must to implement the \'modal.delegate.\' on current $scope', $element);
    }

    var removeBodyClass = function removeBodyClass() {
      $($document).find('body').removeClass('modal-open');
    }; // remove any opened modal trace when user back history navigation


    $rootScope.$on('$routeChangeStart', function () {
      if ($location.$$path) {
        if ($scope.$parent.$hide) {
          $scope.$parent.$hide();
        } else {
          $('.modal-backdrop').remove();
        }

        removeBodyClass();
      }
    });

    $scope.delegate.hide = function (data) {
      if ($scope.$parent.$hide) {
        $scope.$parent.$hide();
      } else {
        $($element).modal('hide'); // $($element).find(' > .modal').modal('hide');
      }

      removeBodyClass();

      if ($scope.delegate.reset) {
        $scope.delegate.reset(data);
      }
    };

    $scope.hide = function () {
      $scope.delegate.hide();
    }; // remove .fade class when animation has applies AngularMotion .am-fade-*


    $timeout(function () {
      if (/am-fade/.test($element[0].className)) {
        angular.element($element[0]).removeClass('fade');
      }
    }, 0); // destroy scope when modal element is removed from DOM

    $element.on('$destroy', function () {
      if ($scope.$parent.$hide) {
        $scope.$parent.$destroy();
      }
    });
  }).directive('modal', function () {
    return {
      restrict: 'E',
      templateUrl: 'modal/modal.html',
      controller: 'ModalController',
      replace: true,
      transclude: {
        title: '?modalTitle',
        bodyCustom: '?modalBodyCustom',
        body: '?modalBody',
        footer: '?modalFooter'
      },
      scope: {
        delegate: '=?'
      }
    };
  });
})();

'use strict';

(function () {
  var resources = {
    userProfile: {
      title: 'Meus dados',
      getUrl: function getUrl() {
        return '//login.anapro.com.br/web/pages/Usuario/Cadastro/Editar.aspx';
      }
    } // transfer: {
    // 	url: 'http://anapro.crm.anapro.com.br/webcrm/pages/atendimento/atendimento_transferir.aspx?key=dt7cwfkSJLk1&op=',
    // 	title: 'Transferir Atendimento',
    // 	getUrl: function(data){
    // 		return resources.transfer.url
    // 			+ '&id='
    // 			+ data.data.id
    // 			+ '&AnaproAppModal=true';
    // 	}
    // }

  };
  angular.module('directives.modal-iframe-anapro-v1', []).provider('modalIframeAnaproV1', function () {
    var scope;
    var rootScope;
    rootScope;
    var self = this;

    self.show = function (data) {
      scope.data = data;
      scope.show();
    };

    self.setScope = function (directiveScope) {
      scope = directiveScope;
    };

    self.$get = function ($rootScope) {
      rootScope = $rootScope;
      return self;
    };
  }).controller('modaliFrameAnaproV1Controller', function ($scope, $sce, $location, $document, modalIframeAnaproV1) {
    modalIframeAnaproV1.setScope($scope);

    var setIframeURL = function setIframeURL() {
      $scope.iframeURL = $sce.trustAsResourceUrl(resources[$scope.data.resource].getUrl($scope.data));
    };

    $scope.show = function () {
      $scope.title = resources[$scope.data.resource].title;
      setIframeURL();
      $('#modal-iframe-anaprov1').modal();
    };

    $scope.modalDelegate = {
      reset: function reset(message) {
        if ($scope.data && $scope.data.callback) {
          $scope.data.callback(message, $scope.data.data);
        }

        $scope.data = null;
        $scope.iframeURL = null;
      }
    };
    $scope.$root.$on('$routeChangeStart', function () {
      if ($scope.data && $location.$$path && $($document).find('body').hasClass('modal-open')) {
        $scope.modalDelegate.hide();
      }
    });
    $scope.$root.$on('$messageIncoming', function (event, data) {
      $scope.modalDelegate.hide(angular.fromJson(data));
    });
  }).directive('modalIframeAnaproV1', function () {
    return {
      restrict: 'E',
      templateUrl: 'modal-iframe-anapro-v1/modal-iframe-anapro-v1.html',
      controller: 'modaliFrameAnaproV1Controller',
      scope: {}
    };
  });
})();

'use strict';

(function () {
  angular.module('factories.navigationBar', []).factory('navigationBarFactory', function ($window) {
    var backButton = {
      hidden: false,
      customFunction: null,
      hide: function hide() {
        backButton.hidden = true;
      },
      show: function show() {
        backButton.hidden = false;
      },
      isHidden: function isHidden() {
        return backButton.hidden;
      },
      run: function run() {
        if (backButton.customFunction) {
          backButton.customFunction();
          backButton.customFunction = null;
        } else {
          $window.history.back();
        }
      },
      set: function set(func) {
        backButton.customFunction = func;
      }
    };
    var logo = {
      data: {
        company: null
      },
      set: function set(data) {
        angular.extend(logo.data, data || {});
      },
      get: function get() {
        return logo.data;
      }
    };
    return {
      backButton: backButton,
      logo: logo
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.navigationBar', ['directives.navigationBarChat', 'directives.navigationBarMobileUserStatus', 'directives.navigationBarWhatsnew', 'directives.navigationBarActions']).controller('NavigationBarController', function ($rootScope, $scope, $timeout, path, permission, navigationBarFactory, mainController, usersService, notificationCenterTransactionsAwaiting, transactionsService, navigationBarActionsFactory) {
    $scope.urlAnaproOld;

    var setUrlAnaproOld = function setUrlAnaproOld() {
      usersService.getUserProfile({
        success: function success(response) {
          $scope.urlAnaproOld = response.data.extraInfo;
        }
      });
    };

    $scope.showNavigationBarActionsModal = navigationBarActionsFactory.showModal;
    $scope.model = {
      q: ''
    };
    $scope.isBackButtonHidden = navigationBarFactory.backButton.isHidden;
    $scope.goBack = navigationBarFactory.backButton.run;

    var isMobile = function isMobile() {
      return mainController.getDevice() == 'mobile';
    };

    if (isMobile()) {
      $scope.showMenuNav = false;
    } else {
      $scope.showMenuNav = true;
    }

    $scope.mobileSideMenuShowItems = true;

    $scope.hideMobileNavbar = function () {
      if (isMobile()) {
        $timeout(function () {
          $scope.showMenuNav = false;
          setBodyScrollBars();
        }, 200);
      }
    };

    $scope.showMobileNavbar = function () {
      if (isMobile()) {
        $scope.showMenuNav = true;
        setBodyScrollBars();
      }
    };

    $scope.toogleMobileNavBar = function () {
      if (isMobile()) {
        $scope.showMenuNav = !$scope.showMenuNav;
        setBodyScrollBars();
      }
    };

    var setBodyScrollBars = function setBodyScrollBars() {
      $rootScope.mainController.mobileSideMenuShow = $scope.showMenuNav;
    };

    $scope.submitSearchForm = function () {
      $scope.mainController.go(path.getPath('transactions') + $scope.model.q);
      $timeout(function () {
        $('[button-search]').collapse('toggle');
      }, 0);
    };

    $scope.getLogo = function () {
      return navigationBarFactory.logo.get();
    };

    $scope.mobileUserStatusDelegate = {
      show: function show() {
        $scope.mobileSideMenuShowItems = false;
      },
      hide: function hide() {
        $scope.mobileSideMenuShowItems = true;
      }
    };

    this.isActive = function (views) {
      return {
        active: views.split(',').indexOf(path.getCurrentViewName()) >= 0
      };
    };

    $scope.getTotalTransactionsAwaiting = function () {
      return notificationCenterTransactionsAwaiting.getTotalNewClients();
    };

    $scope.getViewTransactionsLink = function () {
      if (notificationCenterTransactionsAwaiting.getTotalNewClients() > 0) {
        return transactionsService.getTransactionsAwaitingLink();
      } else {
        return path.getPath('transactions');
      }
    };

    setUrlAnaproOld();
  }).directive('navigationBar', function () {
    return {
      restrict: 'E',
      templateUrl: 'navigation-bar/navigation-bar.html',
      controller: 'NavigationBarController as navigationBarController'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.notifications-container', ['directives.notifications-container.dialog-container']).run(function (toastrConfig) {
    angular.extend(toastrConfig, {
      maxOpened: 10,
      extendedTimeOut: 0,
      positionClass: 'toast-bottom-right' // target: document.querySelector('#toastr-container-wrapper') || 'body'

    });
  }).controller('NotificationsContainerController', function ($scope, $timeout, toastrFactory, notificationCenter) {
    $timeout(function () {
      notificationCenter.init();
    });
  }).directive('notificationsContainer', function (toastrConfig, desktopNotificationsFactory) {
    var postLInk = function postLInk() {
      angular.extend(toastrConfig, {
        target: '#toastr-container-wrapper'
      });
      desktopNotificationsFactory.hasPermission();
    };

    return {
      restrict: 'E',
      templateUrl: 'notifications-container/notifications-container.html',
      controller: 'NotificationsContainerController',
      scope: {},
      link: {
        post: postLInk
      }
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.perfil-transactions-report', ['services.transactions-report']).controller('PerfilTransactionsReportController', function ($scope, path, transactionsService, transactionsReportService) {
    $scope.currentDate = new Date();
    $scope.loading = true;
    $scope.error = false;
    $scope.data = {};

    $scope.getLinkFilter = function (item) {
      var filterJSON = transactionsService.getJSONFilterFromHref(item.href);

      if (filterJSON) {
        return transactionsService.gerFilterHashLink(path.getPath('transactions'), {
          params: {
            q: '',
            filters: filterJSON
          }
        });
      } else {
        return path.getPath('transactions');
      }
    };

    var success = function success(response) {
      $scope.data = response.data;
      $scope.loading = false;
    };

    var error = function error() {
      $scope.data = {};
      $scope.loading = false;
      $scope.error = true;
    };

    var getData = function getData() {
      $scope.loading = true;
      $scope.error = false;
      transactionsReportService.get({
        success: success,
        error: error
      });
    };

    getData();
  }).directive('perfilTransactionsReport', function () {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'perfil/perfil-transactions-report.html',
      controller: 'PerfilTransactionsReportController'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.perfil', ['directives.perfil-transactions-report', 'services.users']).controller('PerfilController', function ($scope, path, usersService) {
    $scope.pathUserProfile = path.getPath('user-profile');
    $scope.userProfile = {};

    $scope.collapse = function ($event) {
      if ($($event.target).closest('user-status-bullet').length) {
        $event.stopPropagation();
      }
    };

    var getUserProfile = function getUserProfile(reload) {
      usersService.getUserProfile({
        reload: reload,
        success: function success(response) {
          $scope.userProfile = response.data;
        }
      });
    };

    getUserProfile();
  }).directive('perfil', function () {
    return {
      restrict: 'E',
      templateUrl: 'perfil/perfil.html',
      controller: 'PerfilController'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.perfil-transactions-summary', ['services.transactions-summary']).controller('PerfilTransactionsSummaryController', function ($rootScope, $scope, $timeout, $element, transactionsSummaryService, path, urls, transactionsService, notificationCenterTransactionSumary) {
    $scope.mainController = $rootScope.mainController;
    $scope.loading = true;
    $scope.error = false;
    $scope.empty = true;
    $scope.properties = transactionsSummaryService.properties;
    $scope.data = {};
    $scope.linkViewTransactions = path.getPath('transactions');

    var nestedStagesNormalize = function nestedStagesNormalize(obj) {
      return obj[$scope.properties.stages.nestedStages].join(', ').replace(new RegExp(obj[$scope.properties.stages.name] + '*.?/', 'g'), '<br />').replace(/,.</g, '<').replace('<br />', '');
    };

    $scope.get = function (obj, property) {
      if (property == $scope.properties.stages.nestedStages) {
        return nestedStagesNormalize(obj);
      } else {
        return obj[property];
      }
    };

    $scope.getFormattedName = function (name) {
      return name.replace(/^.+\/./, '');
    };

    $scope.showSubStage = function (item, subStage) {
      item.activeSubStage = subStage;
    };

    $scope.hideSubStage = function (item) {
      item.activeSubStage = null;
    };

    var hashLinks = {};

    $scope.getLinkFilter = function (item) {
      if (hashLinks[item.href]) {
        return hashLinks[item.href];
      }

      var filterJSON = transactionsService.getJSONFilterFromHref(item.href);

      if (filterJSON) {
        hashLinks[item.href] = transactionsService.gerFilterHashLink($scope.linkViewTransactions, {
          params: {
            q: '',
            filters: filterJSON
          }
        });
      } else {
        hashLinks[item.href] = path.getPath('transactions');
      }

      return hashLinks[item.href];
    };

    var error = function error() {
      $scope.loading = false;
      $scope.error = true;
    };

    var setStageTransactionsPercent = function setStageTransactionsPercent(group, percent) {
      group[$scope.properties.stages.percentTransactions] += percent;

      if (group[$scope.properties.stages.percentTransactions] >= 1) {
        group[$scope.properties.stages.percentTransactions] = Math.floor(group[$scope.properties.stages.percentTransactions]);
      }
    };

    var setStageValuePercent = function setStageValuePercent(group, percent) {
      group[$scope.properties.stages.valuePercent] += percent;

      if (group[$scope.properties.stages.valuePercent] >= 1) {
        group[$scope.properties.stages.valuePercent] = Math.floor(group[$scope.properties.stages.valuePercent]);
      }
    };

    var setNestedStages = function setNestedStages() {
      var pipelines = $scope.data.resumoNegocios;
      $scope.data.resumoNegocios = [];
      var groups = {};
      pipelines.map(function (pipeline) {
        var group = pipeline.resumoNegocioPipelineStageGrupo;

        if (!groups[group]) {
          groups[group] = {
            subStages: []
          };
          groups[group].href = urls.apiPaths.transactions + '?filters=' + JSON.stringify({
            pipelineStageGrupo: group
          });
          groups[group][$scope.properties.stages.name] = group;
          groups[group][$scope.properties.stages.nestedStages] = [];
          groups[group][$scope.properties.stages.value] = 0;
          groups[group][$scope.properties.stages.transactions] = 0;
          groups[group][$scope.properties.stages.percentTransactions] = 0;
          groups[group][$scope.properties.stages.valuePercent] = 0;
          $scope.data.resumoNegocios.push(groups[group]);
        }

        groups[group][$scope.properties.stages.transactions] += pipeline[$scope.properties.stages.transactions];
        groups[group][$scope.properties.stages.nestedStages].push(pipeline[$scope.properties.stages.name]);
        setStageTransactionsPercent(groups[group], pipeline[$scope.properties.stages.percentTransactions]);
        setStageValuePercent(groups[group], pipeline[$scope.properties.stages.valuePercent]);
        groups[group][$scope.properties.stages.value] += pipeline[$scope.properties.stages.value];
        groups[group].subStages.push(pipeline);
      });
    };

    var perfilTransactionsSummarySucess = function perfilTransactionsSummarySucess(data) {
      if (!data.fields) {
        error();
        return;
      }

      $scope.empty = false;
      $scope.data = angular.copy(data.fields);
      setNestedStages();
      $scope.loading = false;
      $timeout(function () {
        $($element).find('[data-toggle="tooltip"]').tooltip({
          html: true
        });
      }, 0);
    };

    var dispatchCallbackAttrs = {
      success: perfilTransactionsSummarySucess
    };
    notificationCenterTransactionSumary.dispatchCallback(dispatchCallbackAttrs);
    $scope.$on('$destroy', function () {
      // prevent memory leaks
      dispatchCallbackAttrs.success = null;
    });
  }).directive('perfilTransactionsSummary', function () {
    return {
      restrict: 'E',
      templateUrl: 'perfil-transactions-summary/perfil-transactions-summary.html',
      controller: 'PerfilTransactionsSummaryController',
      scope: {}
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.permissions', [])
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
  .directive('permissions', function ($compile, permission) {
    var attrAddWhenFalseName = 'permissionsAttrsWhenFalse';
    var attrAddWhenDisabledName = 'permissionsAttrsWhenDisabled';
    var matchAttrAddWhenFalseName = new RegExp(attrAddWhenFalseName);
    var matchAttrAddWhenDisabledName = new RegExp(attrAddWhenDisabledName);

    var addAttributes = function addAttributes(attrs, when) {
      var match = when === false ? matchAttrAddWhenFalseName : matchAttrAddWhenDisabledName;
      var keys = Object.keys(attrs);
      keys.map(function (key) {
        if (match.test(key)) {
          var newAttr = key.replace(match, '');
          attrs.$set(newAttr, attrs[key]);
          attrs.$set(key, null);
        }
      });
    };

    var clearAttributes = function clearAttributes(attrs) {
      attrs.$set('permissions', null);
      attrs.$set('permissions-remove-attrs', null);
      var keys = Object.keys(attrs);
      keys.map(function (key) {
        if (new RegExp(attrAddWhenFalseName + '|' + attrAddWhenDisabledName).test(key)) {
          attrs.$set(key, null);
        }
      });
    };

    var removeAttributes = function removeAttributes(attrs) {
      var list = attrs.permissionsRemoveAttrs;

      if (list) {
        var attributes = list.split(',');
        attributes.map(function (item) {
          attrs.$set(item, null);
        });
      }
    };

    var compile = function compile(element, attrs) {
      if (attrs.permissions !== '') {
        var doNotRemoveIt = typeof attrs.permissionsDisableMode != 'undefined';
        var permissionStatus = permission.checkPermissions(attrs.permissions); // console.log('-----> Directive Permissions ----< ');
        // console.log(element);
        // console.log(
        // 	'permissions: ' + attrs.permissions
        // );
        // console.log('status: ' + permissionStatus);
        // console.log('is set permissions-disable-mode: ' + doNotRemoveIt);
        // console.log('----------------------------');

        if (!permissionStatus || permissionStatus == 'disabled') {
          if (!doNotRemoveIt) {
            element.remove();
            return;
          }

          removeAttributes(attrs);
          addAttributes(attrs, permissionStatus);
        } else {
          attrs.$set('permissions-disable-mode', null);
        } // clear attributes


        clearAttributes(attrs);
      }

      return function (scope, element) {
        $compile(element)(scope);
      };
    };

    return {
      restrict: 'A',
      terminal: true,
      priority: 6000,
      compile: compile
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.radial-progress', []).controller('RadialProgressController', function ($scope, $element, $attrs, $tooltip, $timeout) {
    if ($scope.tooltip) {
      $timeout(function () {
        $tooltip(angular.element($($element[0]).find('> div')[0]), {
          title: $scope.tooltip,
          type: 'success' // trigger: 'click',

        });
      });
    }

    var basis = 126;

    var calcPercentage = function calcPercentage() {
      if ($scope.value < 0 || $scope.value > $scope.total) {
        return 0;
      } else {
        return $scope.value / $scope.total;
      }
    };

    var calcStroke = function calcStroke() {
      var percentage = calcPercentage();

      if (percentage == 0) {
        return basis;
      }

      var stroke = basis - basis * percentage;
      return stroke;
    };

    $scope.getClassThreshold = function () {
      var percentage = calcPercentage();
      var className = '';

      if ($scope.classThresholds) {
        var thresholds = Object.keys($scope.classThresholds);

        for (var i = 0; i < thresholds.length; i++) {
          if (thresholds[i] / 100 >= percentage) {
            className = $scope.classThresholds[thresholds[i]];
            break;
          }
        }
      }

      return className;
    };

    $scope.getStyle = function () {
      return {
        strokeDashoffset: calcStroke()
      };
    };

    $scope.hasLabel = function () {
      return typeof $scope.label != 'undefined';
    };
  }).directive('radialProgress', function () {
    return {
      restrict: 'E',
      scope: {
        total: '=',
        value: '=',
        label: '=',
        tooltip: '=',
        classThresholds: '='
      },
      templateUrl: 'radial-progress/radial-progress.html',
      controller: 'RadialProgressController'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.submit-on-enter', []).directive('submitOnEnter', function () {
    var link = function link(scope, element) {
      if (element[0].tagName != 'TEXTAREA') {
        console.warn('submitOnEnter is only allowed on <textarea> elements');
        return;
      }

      var onKeyDown = function onKeyDown(e) {
        if (e.keyCode == 13) {
          e.preventDefault();
          e.stopPropagation();
          triggerFormEvent();
        }
      };

      var triggerFormEvent = function triggerFormEvent() {
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
})();

'use strict';

(function () {
  angular.module('directives.transaction-finish', []).controller('TransactionFinishController', function ($rootScope, $scope, $filter, anaproFormlyFactory, transactionsService, $timeout) {
    $scope.delegate = $scope.delegate || {};
    $scope.loading = true;
    $scope.submitStatus = {
      success: false,
      error: false
    };
    $scope.form = {};
    $scope.formOptions = {};
    $scope.model = {};
    $scope.fields = [];

    var postExecute = function postExecute() {
      $timeout(function () {
        $scope.submitStatus.success = false;
        $scope.submitStatus.error = false;
        $scope.loading = false;
      }, 500);
    };

    var submitError = function submitError() {
      $scope.submitStatus.error = true;
      postExecute();
    };

    var delegateUpdateItem = function delegateUpdateItem(item) {
      if ($scope.delegate.updateItem && item.id) {
        $scope.delegate.updateItem(item);
      }
    };

    var delegateHide = function delegateHide() {
      if ($scope.delegate.hide) {
        $scope.delegate.hide();
      }
    };

    var runDelegates = function runDelegates(response) {
      delegateHide(response.data);
      delegateUpdateItem(response.data);
    };

    var submitSuccess = function submitSuccess(response) {
      $scope.submitStatus.success = true;
      postExecute();
      runDelegates(response);
      $scope.formOptions.resetModel();
    };

    $scope.cancel = function () {
      $scope.formOptions.resetModel();

      if ($scope.delegate.hide) {
        $scope.delegate.hide();
      }
    };

    $scope.submit = function () {
      if ($scope.form.$valid && !$scope.loading) {
        $scope.loading = true;
        postAction();
      }
    };

    var postAction = function postAction() {
      transactionsService.actions({
        action: $scope.action,
        method: 'POST',
        item: $scope.item,
        data: {
          fields: $scope.model
        },
        toastrMessages: {
          success: {
            title: $scope.action == 'won' ? 'Atendimento fechado como ganho.' : 'Atendimento fechado como perdido.'
          },
          serverError: {
            title: 'Desculpe, estamos com dificuldades para fechar o atendimento.',
            message: 'Tente novamente mais tarde, obrigado.'
          }
        },
        success: submitSuccess,
        error: submitError
      });
    };

    var setFields = function setFields(fields) {
      $scope.fields = [];
      anaproFormlyFactory.createFormlyFieldsFromAPI(fields, $scope.fields);
      anaproFormlyFactory.setFieldsOrder($scope.fields, ['atendimentoNegocioValor', 'atendimentoNegocioComissaoValor']);
    };

    var update = function update() {
      var model = angular.copy($scope.model);
      $scope.loading = true;
      transactionsService.actions({
        action: $scope.action,
        method: 'GET',
        item: $scope.item,
        params: {
          filters: JSON.stringify(model)
        },
        success: function success(response) {
          setFields(response.data.filters);
          $scope.loading = false;
        },
        error: delegateHide
      });
    };

    $scope.submitLabel = function () {
      return $scope.action == 'won' ? 'Registrar venda' : 'Marcar como perdido';
    };

    update();
  }).directive('transactionFinish', function () {
    return {
      restrict: 'E',
      templateUrl: 'transaction-finish/transaction-finish.html',
      controller: 'TransactionFinishController',
      scope: {
        delegate: '=?',
        item: '=',
        action: '='
      }
    };
  }).factory('transactionFinishFactory', function ($modal) {
    var show = function show(attrs) {
      attrs = attrs || {};
      $modal({
        templateUrl: 'transaction-finish/transaction-finish-modal.html',
        show: true,
        animation: 'am-fade-and-slide-top',
        controller: function controller($scope) {
          $scope.item = attrs.item;
          $scope.action = attrs.action, $scope.delegate = attrs.delegate;
          $scope.title = $scope.action == 'won' ? 'Registrar venda' : 'Marcar como perdido';
        },
        onHide: function onHide() {
          if (attrs.delegate.hide) {
            attrs.delegate.hide();
          }
        }
      });
    };

    return {
      show: show
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.transaction-transfer', []).controller('TransactionTransferController', function ($rootScope, $scope, $filter, anaproFormlyFactory, transactionsService, usersService, $timeout) {
    var itemOwnerIsSameCurrentUser = null,
        userProfile;
    $scope.isOnQueue = transactionsService.isOnQueue;
    $scope.isFinished = transactionsService.isFinished;
    usersService.getUserProfile({
      success: function success(response) {
        userProfile = response.data;
      }
    });
    $scope.delegate = $scope.delegate || {};
    $scope.loading = true;
    $scope.submitStatus = {
      success: false,
      error: false
    };
    $scope.form = {};
    $scope.formOptions = {};
    $scope.model = {};
    $scope.fields = [];

    var postExecute = function postExecute() {
      $timeout(function () {
        $scope.submitStatus.success = false;
        $scope.submitStatus.error = false;
        $scope.loading = false;
      }, 500);
    };

    var submitError = function submitError() {
      $scope.submitStatus.error = true;
      postExecute();
    };

    var delegateUpdateItem = function delegateUpdateItem(item) {
      if ($scope.delegate.updateItem && item.id) {
        $scope.delegate.updateItem(item);
      }
    };

    var delegateHide = function delegateHide() {
      if ($scope.delegate.hide) {
        $scope.delegate.hide();
      }
    };

    var delegateTransferedFromOtherToSameCurrentUser = function delegateTransferedFromOtherToSameCurrentUser(item) {
      if ($scope.delegate.transferedFromOtherToSameCurrentUser && $scope.model.usuarioIdGuid == userProfile.id && !itemOwnerIsSameCurrentUser) {
        $scope.delegate.transferedFromOtherToSameCurrentUser(item);
      }
    };

    var delegateRemoveItemFromUser = function delegateRemoveItemFromUser(item) {
      if ($scope.delegate.removeItemFromUser && !item.id) {
        $scope.delegate.removeItemFromUser(item);
      }
    };

    var runDelegates = function runDelegates(response) {
      delegateHide(response.data);
      delegateUpdateItem(response.data);
      delegateTransferedFromOtherToSameCurrentUser(response.data);
      delegateRemoveItemFromUser(response.data);
    };

    var submitSuccess = function submitSuccess(response) {
      $scope.submitStatus.success = true;
      postExecute();
      runDelegates(response);
      $scope.formOptions.resetModel();
    };

    $scope.cancel = function () {
      $scope.formOptions.resetModel();

      if ($scope.delegate.hide) {
        $scope.delegate.hide();
      }
    };

    $scope.submit = function () {
      if ($scope.form.$valid && !$scope.loading) {
        $scope.loading = true;
        postAction();
      }
    };

    var postAction = function postAction() {
      transactionsService.actions({
        action: 'transfer',
        method: 'POST',
        item: $scope.item,
        data: {
          fields: $scope.model
        },
        toastrMessages: {
          success: {
            title: $scope.isFinished($scope.item) ? 'Atendimento reaberto com sucesso.' : 'Transferido com sucesso.'
          },
          serverError: {
            title: $scope.isFinished($scope.item) ? 'Desculpe, estamos com dificuldades para reabrir o atendimento.' : 'Desculpe, estamos com dificuldades para realizar a transferência.',
            message: 'Tente novamente mais tarde, obrigado.'
          }
        },
        success: submitSuccess,
        error: submitError
      });
    };

    var setFields = function setFields(fields) {
      $scope.fields = [];
      anaproFormlyFactory.createFormlyFieldsFromAPI(fields, $scope.fields, {
        merge: {
          atendimentoActionTransferOpcaoAvancado: {
            type: 'hidden'
          },
          atendimentoTipoDirecionamento: {
            type: 'anaproSelectButtons',
            hideExpression: function hideExpression(newValue, oldValue, scope, field) {
              return field.options.templateOptions.options.length === 1;
            },
            data: {
              onChange: function onChange() {
                setLastSelectedUser();
                update();
              }
            },
            templateOptions: {
              noErrorSpace: true
            },
            elementAttributes: {
              'layout': 'row'
            }
          },
          atendimentoActionTransferAtenderAutomaticamente: {
            type: 'anaproSelectButtons',
            hideExpression: function hideExpression(newValue, oldValue, scope, field) {
              var sameCurrentUser = $scope.model.usuarioIdGuid == userProfile.id;

              if (sameCurrentUser) {
                var options = field.options.templateOptions.options;
                var value = options[options.length - 1].value;
                field.model[field.options.key] = value;
              }

              return sameCurrentUser;
            },
            templateOptions: {
              noErrorSpace: true
            },
            elementAttributes: {
              'layout': 'row'
            }
          },
          atendimentoConfirmacaoProspectFidelizado: {
            type: 'anaproSelectButtons',
            templateOptions: {
              noErrorSpace: true
            },
            elementAttributes: {
              'layout': 'row'
            }
          },
          usuarioIdGuid: {
            type: 'nya-select',
            data: {
              customDesc: '{{name}}, <strong>{{properties.usuarioApelido}}</strong><br />{{properties.usuarioEmail}}'
            },
            templateOptions: {
              hint: 'Se o usuário não estiver na lista, é porque ele não pertence à campanha e canal selecionados. Para alterar acesse as opções avançadas.'
            }
          },
          usuarioSeguidoresIdGuids: {
            type: 'nya-select',
            data: {
              multiple: true,
              customDesc: '{{name}}, <strong>{{properties.usuarioApelido}}</strong><br />{{properties.usuarioEmail}}'
            }
          },
          campanhaIdGuid: {
            type: 'anaproSelectButtons',
            data: {
              onChange: function onChange() {
                setLastSelectedUser();
                delete $scope.model.canalIdGuid;
                delete $scope.model.produtoIdGuid;
                update();
              }
            }
          },
          canalIdGuid: {
            type: 'anaproSelectButtons',
            data: {
              onChange: function onChange() {
                setLastSelectedUser();
                delete $scope.model.produtoIdGuid;
                update();
              }
            }
          },
          produtoIdGuid: {
            type: 'nya-select',
            className: 'nya-position-top',
            templateOptions: {
              noErrorSpace: true
            }
          },
          observacao: {
            templateOptions: {
              noErrorSpace: true
            }
          }
        }
      });
      anaproFormlyFactory.setFieldsOrder($scope.fields, ['atendimentoTipoDirecionamento', 'usuarioIdGuid']);
      $timeout(function () {
        if (itemOwnerIsSameCurrentUser === null) {
          itemOwnerIsSameCurrentUser = !$scope.model.usuarioIdGuid;
        }

        pickLastSelectedUser($scope.fields);
      }, 0);
    };

    $scope.setAdvanced = function () {
      $scope.model.atendimentoActionTransferOpcaoAvancado = true;
      update();
    };

    var lastSelectedUser;

    var setLastSelectedUser = function setLastSelectedUser() {
      lastSelectedUser = $scope.model.usuarioIdGuid || lastSelectedUser || null;
      delete $scope.model.usuarioIdGuid;
    };

    var pickLastSelectedUser = function pickLastSelectedUser(fields) {
      if (lastSelectedUser) {
        fields.map(function (field) {
          if (field.key == 'usuarioIdGuid') {
            (field.templateOptions.options || []).map(function (option) {
              if (option.value == lastSelectedUser) {
                $scope.model.usuarioIdGuid = lastSelectedUser;
              }
            });
          }
        });
      }
    };

    var update = function update() {
      var model = angular.copy($scope.model);
      $scope.loading = true;
      transactionsService.actions({
        action: 'transfer',
        method: 'GET',
        item: $scope.item,
        params: {
          filters: JSON.stringify(model)
        },
        success: function success(response) {
          setFields(response.data.filters);
          $scope.loading = false;
        },
        error: delegateHide
      });
    };

    update();
  }).directive('transactionTransfer', function () {
    return {
      restrict: 'E',
      templateUrl: 'transaction-transfer/transaction-transfer.html',
      controller: 'TransactionTransferController',
      scope: {
        delegate: '=?',
        item: '='
      }
    };
  }).factory('transactionTransferFactory', function ($modal) {
    var show = function show(attrs) {
      attrs = attrs || {};
      $modal({
        templateUrl: 'transaction-transfer/transaction-transfer-modal.html',
        show: true,
        animation: 'am-fade-and-slide-top',
        controller: function controller($scope, transactionsService) {
          $scope.item = attrs.item;
          $scope.delegate = attrs.delegate;
          $scope.isOnQueue = transactionsService.isOnQueue;
          $scope.isFinished = transactionsService.isFinished;
        },
        onHide: function onHide() {
          if (attrs.delegate.hide) {
            attrs.delegate.hide();
          }
        }
      });
    };

    return {
      show: show
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.user-position-in-queues.channel-position-in-queue', []).controller('ChannelPositionInQueueController', function ($rootScope, $scope, $modal, path) {
    $scope.showQueue = function (item) {
      $rootScope.mainController.go(path.get('queues-handler-position').withItem(item));
    };

    $scope.showRules = function () {
      $modal({
        templateUrl: 'user-position-in-queues/rules-modal.html',
        show: true,
        animation: 'am-fade-and-slide-top',
        scope: $scope
      });
    };
  }).directive('channelPositionInQueue', function () {
    return {
      restrict: 'E',
      replace: true,
      controller: 'ChannelPositionInQueueController',
      scope: {
        item: '=',
        queueName: '='
      },
      templateUrl: 'user-position-in-queues/channel-position-in-queue.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.user-position-in-queues', ['directives.user-position-in-queues.channel-position-in-queue']).controller('UserPositionInQueuesController', function ($scope, userStatusLabels, permission, userStatusFactory, notificationCenterPositionInQueues) {
    $scope.data = [];
    var dispatchCallbackAttrs = {
      success: function success(data) {
        $scope.data = data;
      }
    };
    notificationCenterPositionInQueues.dispatchCallback(dispatchCallbackAttrs);

    $scope.hasQueues = function () {
      var hasQueues = false;

      for (var i = 0; i < $scope.data.length; i++) {
        if ($scope.isChannelQueueVisible($scope.data[i].channelProperties.channel)) {
          hasQueues = true;
          break;
        }
      }

      return hasQueues;
    };

    var channelLabelPreprositions = {
      'chat': 'do',
      'phone': 'da',
      'others': 'de'
    };

    $scope.getChannelLabel = function (channel) {
      return channelLabelPreprositions[channel] + ' ' + userStatusLabels[channel];
    };

    $scope.isChannelQueueVisible = function (channel) {
      return userStatusFactory.isOnline(channel) || userStatusFactory.isPaused(channel);
    };

    $scope.$on('$destroy', function () {
      // prevent memory leaks
      dispatchCallbackAttrs.success = null;
    });
  }).directive('userPositionInQueues', function () {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'user-position-in-queues/user-position-in-queues.html',
      controller: 'UserPositionInQueuesController'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.user-status-bullet', []).factory('UserStatusBulletFactory', function () {
    var popovers = [];

    var hideAll = function hideAll() {
      popovers.map(function (popover) {
        popover.hide();
      });
    };

    var putPopover = function putPopover(popover) {
      popovers.push(popover);
    };

    return {
      putPopover: putPopover,
      hideAll: hideAll
    };
  }).controller('UserStatusBulletController', function ($scope, $element, $timeout, $popover, $attrs, UserStatusBulletFactory, userStatusFactory, userStatusLabels) {
    $scope.getChannelValueLabel = function (channel) {
      return userStatusFactory.getChannelValueLabel(channel);
    };

    var listAllChannels = typeof $attrs.list != 'undefined';

    $scope.listAllChannels = function () {
      return listAllChannels;
    };

    $scope.getClass = function () {
      var overall = userStatusFactory.get().overall;
      return angular.merge({
        switchers: !!$scope.switchers || $element.attr('switchers') === ''
      }, overall ? {
        online: true
      } : {
        offline: true
      });
    };

    $scope.getChannelClass = function (channel) {
      if (userStatusFactory.isDisabled(channel)) {
        return {
          disabled: true
        };
      } else {
        return {
          offline: userStatusFactory.isOffline(channel),
          online: userStatusFactory.isOnline(channel),
          paused: userStatusFactory.isPaused(channel)
        };
      }
    };

    $scope.getChannelLabel = function (channel) {
      return userStatusLabels[channel];
    };

    $scope.canUserChangeChannelStatus = function (channel) {
      return userStatusFactory.canUserChange(channel);
    };

    $scope.layout = $attrs.layout;

    if (listAllChannels) {
      $scope.allUserStatus = userStatusFactory.get();
    }

    if ($scope.switchers || $element.attr('switchers') === '') {
      $timeout(function () {
        UserStatusBulletFactory.putPopover($popover(angular.element($element[0].querySelector('div')), {
          scope: $scope,
          title: 'Status nos canais',
          contentTemplate: 'user-status/user-status-switchers-popover.html',
          trigger: 'click',
          autoClose: true,
          animation: 'am-flip-x',
          placement: 'bottom-left',
          onBeforeShow: UserStatusBulletFactory.hideAll
        }));
      }, 0);
    }

    $scope.getNextPositionInQueues = function (channel) {
      var position = userStatusFactory.getNextPositionInQueues(channel);

      if (/string|number/.test(_typeof(position))) {
        return '[' + position + ']';
      }

      return '';
    };
  }).directive('userStatusBullet', function (userStatusFactory) {
    var compile = function compile() {
      return {
        // remove bullet status if there is not any available channel
        pre: function pre(scope, iElement) {
          if (userStatusFactory.get().noChannelsAvailable) {
            iElement.remove();
          }
        }
      };
    };

    return {
      restrict: 'E',
      compile: compile,
      scope: {
        switchers: '=',
        list: '='
      },
      // replace: true,
      templateUrl: 'user-status/user-status-bullet.html',
      controller: 'UserStatusBulletController'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.user-status-switchers', []).run(function (formlyConfig) {
    formlyConfig.setWrapper([{
      name: 'user-status-switchers-formly-wrapper',
      templateUrl: 'user-status/user-status-switchers-formly-wrapper.html'
    }, {
      name: 'user-status-switcher-formly-wrapper-additional-options',
      templateUrl: 'user-status/user-status-switcher-formly-wrapper-additional-options.html'
    }]);
  }).controller('UserStatusSwitchersController', function ($rootScope, $scope, $timeout, $filter, audioFactory, path, userStatusFactory, toastrFactory, usersService, userStatusBroadcastName, userStatusLabels, userStatusValuesProperties) {
    var additionalOptions = {
      phone: []
    };

    var setStatuses = function setStatuses() {
      $scope.statuses = userStatusFactory.get();
    };

    var set = function set(channel, value, additionalOption) {
      userStatusFactory.set(channel, value, additionalOption);

      if (channel == 'chat' && value == userStatusValuesProperties.online.status) {
        audioFactory.play('system');
      }
    };

    var switchOnClick = function switchOnClick(event, options) {
      var channelProperties = userStatusFactory.getChannelProperties(options.key);

      if (channelProperties.additionalOption) {
        event.preventDefault();

        if (options.value() == userStatusValuesProperties.offline.status) {
          options.data.selectAdditionalOption = true;
        } else {
          options.data.selectAdditionalOption = false;
          set(options.key, userStatusValuesProperties.offline.status);
        }
      }

      if (options.templateOptions.disabled) {
        toastrFactory.warn({
          title: 'Desculpe',
          message: 'Você precisa estar vinculado a um grupo com permissão para atender o Chat',
          autoDismiss: true
        });
      }
    };

    var showValues = function showValues(key) {
      return userStatusFactory.getChannelValueLabel(key);
    };

    var fieldControllerDefault = function fieldControllerDefault($scope) {
      var channel = $scope.options.key; // var channelServiceData = userStatusFactory.getChannelServiceData(channel);

      var channelProperties = userStatusFactory.getChannelProperties(channel);

      $scope.getAdditionalOptions = function () {
        return additionalOptions[channel];
      };

      $scope.cancelAdditionalOption = function () {
        $scope.options.data.selectAdditionalOption = false;
      };

      $scope.addAdditionalOption = function () {
        $scope.options.data.selectAdditionalOption = false;

        switch (channel) {
          case 'phone':
            $rootScope.mainController.go(path.getPath('user-profile'));
            break;
        }
      };

      $scope.showValues = function () {
        return showValues(channel);
      };

      $scope.setChannelWithAdditionalOption = function (item) {
        var additionalOption = {};
        additionalOption[channelProperties.additionalOption] = item;
        set($scope.options.key, userStatusValuesProperties.online.status, additionalOption);
        $timeout(function () {
          $scope.options.data.selectAdditionalOption = false;
        }, 200);
      };

      $scope.hasAdditionalOptions = !!additionalOptions[channel];
    };

    var fieldControllerWhenChannelHasPauseStatus = function fieldControllerWhenChannelHasPauseStatus($scope) {
      var channel = $scope.options.key;
      $scope.hasAdditionalOptions = false;

      $scope.showToggleButton = function () {
        return !userStatusFactory.isDisabled(channel) && !userStatusFactory.isOffline(channel);
      };

      $scope.showValues = function () {
        return showValues(channel);
      };

      $scope.pauseToggle = function () {
        var status = userStatusFactory.isPaused(channel) ? userStatusValuesProperties.online.status : userStatusValuesProperties.paused.status;
        console.log('status pauseToggle', channel, status);
        set(channel, status);
      };
    };

    var setFields = function setFields() {
      if (!$scope.fields) {
        $scope.fields = [];
        Object.keys($scope.statuses.channels).map(function (key) {
          if (($scope.switchers && $scope.switchers[key] || !$scope.switchers) && userStatusFactory.canUserChange(key)) {
            $scope.fields.push({
              type: 'anaproSwitch',
              key: key,
              controller: userStatusFactory.canBePaused(key) ? fieldControllerWhenChannelHasPauseStatus : fieldControllerDefault,
              wrapper: function () {
                var wrappers = ['user-status-switcher-formly-wrapper-additional-options'];

                if (userStatusFactory.canBePaused(key)) {
                  wrappers.splice(0, 0, 'user-status-switchers-formly-wrapper');
                }

                return wrappers;
              }(),
              templateOptions: {
                label: userStatusLabels[key],
                onChange: function onChange(value, field) {
                  set(field.key, value);
                },
                customTrueValue: '\'' + userStatusValuesProperties.online.status + '\'',
                customFalseValue: '\'' + userStatusValuesProperties.offline.status + '\''
              },
              expressionProperties: {
                'templateOptions.disabled': '$modelValue == \'' + userStatusValuesProperties.disabled.status + '\'',
                'templateOptions.paused': '$modelValue == \'' + userStatusValuesProperties.paused.status + '\''
              },
              data: {
                onclick: switchOnClick
              }
            });
          }
        });
      }
    };

    var setPhoneNumbers = function setPhoneNumbers() {
      usersService.getUserProfile({
        success: function success(response) {
          additionalOptions.phone = response.data.fields.usuario.usuarioTelefones;
        }
      });
    };

    setPhoneNumbers();
    setStatuses();
    setFields();
    $rootScope.$on(userStatusBroadcastName, function () {
      console.log('directives.user-status-switchers.$on.user-status');
      setStatuses();
    });
  }).directive('userStatusSwitchers', function () {
    return {
      restrict: 'E',
      scope: {
        switchers: '='
      },
      templateUrl: 'user-status/user-status-switchers.html',
      controller: 'UserStatusSwitchersController'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.view-title', []).controller('ViewTitleController', function ($scope) {
    if ($scope.extra && $scope.extra.constructor.name != 'Array') {
      $scope.extra = [$scope.extra];
    }
  }).directive('viewTitle', function () {
    return {
      restrict: 'E',
      link: function link(scope, element, attrs) {
        attrs.$set('title', null);
      },
      scope: {
        title: '=',
        subtitle: '=',
        desc: '=',
        extra: '='
      },
      templateUrl: 'view-title/view-title.html',
      controller: 'ViewTitleController',
      transclude: true
    };
  });
})();

'use strict';

(function () {
  angular.module('factories.notification-center.dialogs', []).run(function (notificationCenterFactory, notificationCenterDialogs, notificationsContainerDialog, firebaseCollections) {
    var types = [];
    notificationsContainerDialog.getDialogTypesByPriority().map(function (item) {
      types.push(item.collectionKey);
    });
    notificationCenterFactory.registerToGetNotifications({
      collection: [firebaseCollections.pendingProcessing, firebaseCollections.chat],
      service: notificationCenterDialogs,
      types: types
    });
  }).factory('notificationCenterDialogs', function ($rootScope, $location, CacheFactory, path, $timeout, audioFactory, firebaseCollections, notificationsContainerDialog, userStatusFactory, desktopNotificationsFactory, userStatusBroadcastName) {
    var cache = CacheFactory('dispatchedDialogsNotifications', {
      storagePrefix: 'AnaproAPP-Caches.',
      storageMode: 'localStorage'
    });
    var newDialog = notificationsContainerDialog.put,
        dialogTypesByPriority = notificationsContainerDialog.getDialogTypesByPriority(),
        dispatchedNotifications = cache.get('doNotShowIdsAgain') || [],
        // only ids
    removedNotificationsByAttributeWaitingForDispatch = [],
        activedDialogs = {},
        // grouped by type
    delayFurtherSameTypeNotificationsDuration = 2 * 60 * 1000,
        // 2 minutes
    delayFurtherSameTypeNotificationsPromisse,
        dataHoldingByUserStatusOffline = {},
        dataHoldingByChannelStatusCollectionType = {// others: [
      // 	'pendingProcessingTransactionWaitingAttend'
      // ]
    },
        desktopNotificationAttrsByType = {
      newLead: {
        title: 'Novo cliente',
        body: 'prospectNome',
        icon: 'prospectUrlImagem',
        onclick: function onclick() {
          audioFactory.play('system');
          $rootScope.mainController.go(path.get('transaction').withItem({
            id: this.atendimentoIdGuid
          }));
        }
      },
      newChat: {
        title: 'Novo chat',
        body: 'ProspectNome',
        icon: 'ProspectUrlImagem',
        onclick: function onclick() {
          audioFactory.play('system');
          window.open('//' + this.Href, '_blank');
        }
      }
    };

    var cleanUpActivedDialogs = function cleanUpActivedDialogs() {
      // removed empty objects
      Object.keys(activedDialogs).map(function (key) {
        activedDialogs[key] = activedDialogs[key].filter(function (item) {
          return !!item.data;
        });
      });
    };

    dialogTypesByPriority.map(function (item) {
      activedDialogs[item.type] = [];
    });

    var removeWaitingNotificationsRemovedByAttribute = function removeWaitingNotificationsRemovedByAttribute(data) {
      removedNotificationsByAttributeWaitingForDispatch.map(function (notification) {
        Object.keys(data).map(function (collectionKey) {
          data[collectionKey] = data[collectionKey].filter(function (dataItem) {
            if (dataItem[notification.data.attribute] != notification.data.value) {
              return true;
            } else {
              var indexOf = removedNotificationsByAttributeWaitingForDispatch.indexOf(notification);

              if (indexOf >= 0) {
                console.log(['factories.notification-center.dialogs.removeWaitingNotificationsRemovedByAttribute()', angular.copy({
                  dataItem: dataItem,
                  notification: notification
                })]);
                removedNotificationsByAttributeWaitingForDispatch.splice(indexOf, 1);
              }

              setDoNotShowAgain(dataItem.id, notification.doNotShowAgain);
              return false;
            }
          });
        });
      });
    }; // remove notifications from pendingProcessing that has been already dispatched


    var cleanUpData = function cleanUpData(data) {
      removeWaitingNotificationsRemovedByAttribute(data);
      Object.keys(data).map(function (collectionKey) {
        data[collectionKey] = data[collectionKey].filter(function (dataItem) {
          return dispatchedNotifications.indexOf(dataItem.id) == -1;
        });
      });
    };

    var dispatchDesktopNotification = function dispatchDesktopNotification(dialog) {
      if (!document.hasFocus()) {
        var data = dialog.data;
        var dialogType = notificationsContainerDialog.getDialogType(data.type);
        dialogType.desktopNotification = dialogType.desktopNotification || {};
        dialog.desktopNotification = desktopNotificationsFactory.send({
          tag: data.id,
          title: desktopNotificationAttrsByType[data.type].title,
          body: data[desktopNotificationAttrsByType[data.type].body],
          icon: dialogType.desktopNotification.icon || data[desktopNotificationAttrsByType[data.type].icon],
          requireInteraction: true,
          renotify: true,
          callback: desktopNotificationAttrsByType[data.type].onclick.bind(data)
        });
      }
    };

    var dispatchNewDialogNotification = function dispatchNewDialogNotification(nextNotification) {
      if (nextNotification) {
        var dialogObj = newDialog(angular.merge({
          type: nextNotification.dialogTypeObj.type
        }, nextNotification.notification));
        activedDialogs[nextNotification.dialogTypeObj.type].push(dialogObj);
        dispatchDesktopNotification(dialogObj);
        dispatchedNotifications.push(dialogObj.data.id);
      }
    };

    var selectNextGroupTypeNotificationsByPriority = function selectNextGroupTypeNotificationsByPriority(data) {
      var nextGroupTypeNotificationsByPriority;

      for (var i = 0; i < dialogTypesByPriority.length; i++) {
        var dialogTypeObj = dialogTypesByPriority[i];

        if (dialogTypeObj.collectionKey && data[dialogTypeObj.collectionKey] && data[dialogTypeObj.collectionKey].length) {
          nextGroupTypeNotificationsByPriority = {
            dialogTypeObj: dialogTypeObj,
            items: data[dialogTypeObj.collectionKey]
          };
          break;
        }
      }

      return nextGroupTypeNotificationsByPriority;
    };

    var hasGroupTypeNotificationsSlotsFree = function hasGroupTypeNotificationsSlotsFree(groupTypeNotifications) {
      return activedDialogs[groupTypeNotifications.dialogTypeObj.type].length < groupTypeNotifications.dialogTypeObj.limit;
    };

    var getNextPriorityNotification = function getNextPriorityNotification(data) {
      var nextGroupTypeNotificationsByPriority = selectNextGroupTypeNotificationsByPriority(data),
          nextNotification;

      if (nextGroupTypeNotificationsByPriority && hasGroupTypeNotificationsSlotsFree(nextGroupTypeNotificationsByPriority)) {
        nextNotification = {
          dialogTypeObj: nextGroupTypeNotificationsByPriority.dialogTypeObj,
          notification: nextGroupTypeNotificationsByPriority.items.shift()
        };
      }

      return nextNotification;
    };

    var delayFurtherSameTypeNotifications = function delayFurtherSameTypeNotifications(data) {
      var hasMoreNotifications = false,
          dataKeys = Object.keys(data);

      for (var i = 0; i < dataKeys.length; i++) {
        if (data[dataKeys[i]].length) {
          hasMoreNotifications = true;
          break;
        }
      }

      if (hasMoreNotifications) {
        $timeout.cancel(delayFurtherSameTypeNotificationsPromisse);
        console.log(['factories.notification-center.dialogs.delayFurtherSameTypeNotifications()', angular.copy(data)]);
        delayFurtherSameTypeNotificationsPromisse = $timeout(function () {
          getAndShowNextNotification(data);
        }, delayFurtherSameTypeNotificationsDuration);
      }
    };

    var moveDataCollectionsTypeToOnHold = function moveDataCollectionsTypeToOnHold(channel, data) {
      dataHoldingByChannelStatusCollectionType[channel].map(function (collectionKey) {
        if (data[collectionKey]) {
          dataHoldingByUserStatusOffline[collectionKey] = data[collectionKey];
          delete data[collectionKey];
        }
      });
    };

    var moveDataToOnHold = function moveDataToOnHold(data) {
      Object.keys(dataHoldingByChannelStatusCollectionType).map(function (channel) {
        if (!userStatusFactory.isOnline(channel)) {
          moveDataCollectionsTypeToOnHold(channel, data);
        }
      });

      if (Object.keys(dataHoldingByUserStatusOffline).length) {
        console.log(['factories.notification-center.dialogs.moveDataCollectionsTypeToOnHold', angular.copy(dataHoldingByUserStatusOffline)]);
      }
    };

    var getAndShowNextNotification = function getAndShowNextNotification(data) {
      cleanUpData(data);
      moveDataToOnHold(data);
      console.log(['factories.notification-center.dialogs.getAndShowNextNotification', angular.copy(data)]);
      cleanUpActivedDialogs();
      var nextNotification = getNextPriorityNotification(data);
      dispatchNewDialogNotification(nextNotification);
      delayFurtherSameTypeNotifications(data);
    };

    var removeMissedDialogsNotifications = function removeMissedDialogsNotifications(data) {
      Object.keys(activedDialogs).map(function (type) {
        var dialogType = notificationsContainerDialog.getDialogType(type);
        var dialogsNotFound = [];
        activedDialogs[type].map(function (dialog) {
          if (dialog.data && data[dialogType.collectionKey]) {
            var dialogFound = data[dialogType.collectionKey].filter(function (dataItem) {
              return dataItem.id === dialog.data.id;
            })[0];

            if (!dialogFound) {
              dialogsNotFound.push(dialog.data.id);
              console.warn('Dialog Notification Missed!', dialog.data);
              dialog.remove();
            }
          }
        });
        activedDialogs[type] = activedDialogs[type].filter(function (dialog) {
          return dialog.data && dialogsNotFound.indexOf(dialog.data.id) < 0;
        });
      });
    };

    var removeNotification = function removeNotification(dialog) {
      if (dialog.desktopNotification) {
        dialog.desktopNotification.close();
        delete dialog.desktopNotification;
      }
    };

    var setDoNotShowAgain = function setDoNotShowAgain(id, doNotShowAgain) {
      dispatchedNotifications.push(id);

      if (doNotShowAgain) {
        addIdNotificationCache(id);
      }
    };

    var removeById = function removeById(id, doNotShowAgain) {
      setDoNotShowAgain(id, doNotShowAgain);
      dialogTypesByPriority.map(function (typeObj) {
        activedDialogs[typeObj.type].map(function (dialog) {
          if (dialog && dialog.data && dialog.data.id == id) {
            console.log(['factories.notification-center.dialogs.removeById()', angular.copy(dialog.data)]);
            removeNotification(dialog);
            dialog.remove();
          }
        });
      });
    };

    var removeByAttribute = function removeByAttribute(attrs, doNotShowAgain) {
      var found = false;
      dialogTypesByPriority.map(function (typeObj) {
        activedDialogs[typeObj.type].map(function (dialog) {
          if (dialog && dialog.data && dialog.data[attrs.attribute] == attrs.value) {
            console.log(['factories.notification-center.dialogs.removeByAttribute()', angular.copy(dialog.data)]);
            setDoNotShowAgain(dialog.data.id, doNotShowAgain);
            removeNotification(dialog);
            dialog.remove();
            found = true;
          }
        });
      });

      if (!found) {
        console.log(['factories.notification-center.dialogs.removeByAttribute().WaitingForDispatch', angular.copy(attrs)]);
        removedNotificationsByAttributeWaitingForDispatch.push({
          data: attrs,
          doNotShowAgain: doNotShowAgain
        });
      }
    };

    var addIdNotificationCache = function addIdNotificationCache(id) {
      var ids = cache.get('doNotShowIdsAgain') || [];
      ids.push(id);
      cache.put('doNotShowIdsAgain', ids);
    }; // release all on hold data and clean it up


    var releaseDataOnHold = function releaseDataOnHold() {
      var data = dataHoldingByUserStatusOffline;
      dataHoldingByUserStatusOffline = {};

      if (Object.keys(data).length) {
        console.log(['factories.notification-center.dialogs.releaseDataOnHold()', angular.copy(data)]);
        getAndShowNextNotification(data);
      }
    };

    var groupChats = function groupChats(data) {
      var groupedChats = [];

      if (data[firebaseCollections.chat] && data[firebaseCollections.chat].length) {
        var chats = angular.copy(data[firebaseCollections.chat]);
        groupedChats.push(chats.pop());
        chats.map(function (chat) {
          groupedChats[0].ProspectNome += ', ' + chat.ProspectNome;
        });
        data[firebaseCollections.chat] = groupedChats;
      }
    };

    var dispatch = function dispatch(data) {
      console.log(['factories.notification-center.dialogs.dispatch(' + Object.keys(data).join(',') + ')', angular.copy(data)]);
      groupChats(data); // prevent dispatch dialog notifications twice

      $timeout.cancel(delayFurtherSameTypeNotificationsPromisse);
      removeMissedDialogsNotifications(data);
      getAndShowNextNotification(data);
    };

    $rootScope.$on(userStatusBroadcastName, releaseDataOnHold);
    var factory = {
      name: 'dialogs',
      dispatch: dispatch,
      removeById: removeById,
      removeByAttribute: removeByAttribute
    };
    return factory;
  });
})();

'use strict';

(function () {
  angular.module('factories.notification-center', ['factories.notification-center.dialogs', 'factories.notification-center.toastr', 'factories.notification-center.transactions-awaiting', 'factories.notification-center.transactionSumary', 'factories.notification-center.position-in-queues']).provider('notificationCenter', function () {
    var self = this;

    self.$get = function (notificationCenterFactory, firebaseService, pendingProcessingService) {
      self.init = function () {
        firebaseService.init();
        pendingProcessingService.init();
      };

      return self;
    };
  }).factory('notificationCenterFactory', function () {
    var registeredServices = [],
        registerToGetNotifications = function registerToGetNotifications(register) {
      if (register.service) {
        registeredServices.push(register);
      }
    },
        generateDataByServicesRegistered = function generateDataByServicesRegistered(collection, register, data) {
      var registerData = {};

      if (register.types.indexOf(collection) >= 0) {
        registerData[collection] = data;
      } else {
        var filteredType = Object.keys(data).filter(function (key) {
          return register.types.indexOf(key) >= 0;
        });
        filteredType.map(function (type) {
          registerData[type] = data[type];
        });
      }

      return registerData;
    },
        removeNotificationById = function removeNotificationById(id, doNotShowAgain) {
      registeredServices.map(function (register) {
        if (register.service.removeById) {
          register.service.removeById(id, doNotShowAgain);
        }
      });
    },
        removeNotificationByAttribute = function removeNotificationByAttribute(attrs, doNotShowAgain) {
      registeredServices.map(function (register) {
        if (register.service.removeByAttribute) {
          register.service.removeByAttribute(attrs, doNotShowAgain);
        }
      });
    },
        dispatch = function dispatch(collection, data) {
      registeredServices.map(function (register) {
        if (register.collection.indexOf(collection) >= 0) {
          var registerData = generateDataByServicesRegistered(collection, register, data);

          if (Object.keys(registerData).length) {
            register.service.dispatch(registerData);
          }
        }
      });
    },
        factory = {
      registerToGetNotifications: registerToGetNotifications,
      dispatch: dispatch,
      removeNotificationById: removeNotificationById,
      removeNotificationByAttribute: removeNotificationByAttribute
    };

    return factory;
  });
})();

'use strict';

(function () {
  angular.module('factories.notification-center.position-in-queues', []).run(function (notificationCenterFactory, notificationCenterPositionInQueues, firebaseCollections) {
    notificationCenterFactory.registerToGetNotifications({
      collection: [firebaseCollections.queuesChannelChatByUser],
      service: notificationCenterPositionInQueues,
      types: [firebaseCollections.queuesChannelChatByUser]
    });
  }).factory('notificationCenterPositionInQueues', function ($rootScope, $timeout, userStatusFactory, permission) {
    var channelsKey = {
      queuesChannelChatByUser: 'channelChat',
      queuesChannelPhoneByUser: 'channelPhone',
      queuesChannelOthersByUser: 'channelOthers'
    };
    var queues = [];
    var callbacks = [];

    var setQueues = function setQueues(data) {
      queues.splice(0, queues.length);

      if (data) {
        Object.keys(data).map(function (key) {
          var channelName = userStatusFactory.getChannelsByKey(key);
          var channelQueue = data[key].Campanhas;
          var channelProperties = userStatusFactory.getChannelProperties(channelName) || {};

          if (!channelProperties.permissionPositionInQueue || channelProperties.permissionPositionInQueue && permission.checkPermissions(channelProperties.permissionPositionInQueue) && channelQueue) {
            queues.push({
              channelProperties: channelProperties,
              queues: channelQueue
            });
          }
        });
      }

      setPositionToChannelWhenHasOnlyOne();
    };

    var setNextPositionInQueues = function setNextPositionInQueues() {
      queues.map(function (channel) {
        var position = null;
        angular.merge(channel, {
          queues: []
        });
        channel.queues.map(function (campaign) {
          angular.merge(campaign, {
            Canais: []
          });
          campaign.Canais.map(function (campaignChannel) {
            angular.merge(campaignChannel, {
              Posicao: {}
            });

            if (typeof campaignChannel.Posicao.Ordem == 'number' && (campaignChannel.Posicao.Ordem < position || position === null)) {
              position = campaignChannel.Posicao.Ordem;
            }
          });
        });
        channel.nextPositionInQueues = position;
        userStatusFactory.setNextPositionInQueues(channel.channelProperties.channel, position);
      });
    };

    var setPositionToChannelWhenHasOnlyOne = function setPositionToChannelWhenHasOnlyOne() {
      queues.map(function (item) {
        if (item.queues && item.queues.length == 1 && item.queues[0].Canais.length == 1) {
          item.campaignChannel = item.queues[0].Canais[0];
        }
      });
    };

    var dispatch = function dispatch(data) {
      var dataCopied = angular.copy(data);
      var dataFormatted = {};
      Object.keys(data).map(function (channelQueuesKey) {
        userStatusFactory.setNextPositionInQueues(userStatusFactory.getChannelsByKey(channelsKey[channelQueuesKey]), null);
        dataFormatted[channelsKey[channelQueuesKey]] = data[channelQueuesKey];
      });
      setQueues(dataFormatted);
      setNextPositionInQueues();
      console.log(['factories.notification-center.notificationCenterPositionInQueues.dispatch()', dataCopied, queues]);
      runCallbacks();
      $rootScope.$digest();
    },
        dispatchCallback = function dispatchCallback(attrs) {
      var found = callbacks.indexOf(attrs);

      if (found < 0) {
        callbacks.push(attrs);
      }

      if (attrs.success) {
        attrs.success(queues);
      }
    },
        runCallbacks = function runCallbacks() {
      callbacks = callbacks.filter(function (callback) {
        return typeof callback.success == 'function';
      });
      callbacks.map(function (callback) {
        callback.success(queues);
      });
    },
        factory = {
      dispatch: dispatch,
      dispatchCallback: dispatchCallback
    };

    return factory;
  });
})();

'use strict';

(function () {
  angular.module('factories.notification-center.toastr', []).run(function (notificationCenterFactory, notificationCenterToastr, firebaseCollections) {
    notificationCenterFactory.registerToGetNotifications({
      collection: [firebaseCollections.systemMessages],
      service: notificationCenterToastr,
      types: ['newsMessages', 'systemMessages']
    });
  }).factory('notificationCenterToastr', function (toastrFactory, audioFactory, notificationCenterFactory, CacheFactory) {
    var cache = CacheFactory('toastsMessagesInfo', {
      storagePrefix: 'AnaproAPP-Caches.',
      storageMode: 'localStorage'
    }),
        removedIds = cache.get('removedIds') || [],
        registeredToasts = [],
        toastsById = {},
        createToasts = function createToasts(messages) {
      messages.map(function (message) {
        audioFactory.play('system');
        var toast = toastrFactory[message.type];

        if (toast && registeredToasts.indexOf(message.id) == -1 && removedIds.indexOf(message.id) == -1) {
          registeredToasts.push(message.id);
          toastsById[message.id] = toast({
            title: message.title,
            message: message.message,
            autoDismiss: false,
            onTap: message.onTap || null,
            onHidden: function onHidden() {
              if (message.onHidden) {
                message.onHidden();
              }

              removeById(message.id);
            }
          });
        }
      });
    },
        lookForMessages = function lookForMessages(data) {
      Object.keys(data).map(function (key) {
        createToasts(data[key]);
      });
    },
        dispatch = function dispatch(data) {
      console.log(['factories.notification-center.toastr.dispatch(' + Object.keys(data).join(',') + ')', angular.copy(data)]);
      lookForMessages(data);
    },
        removeById = function removeById(id) {
      removedIds.push(id);

      if (toastsById[id]) {
        toastsById[id].scope.close();
        toastsById[id] = null;
        delete toastsById[id];
      }

      cache.put('removedIds', removedIds);
    },
        factory = {
      dispatch: dispatch,
      removeById: removeById
    };

    return factory;
  });
})();

'use strict';

(function () {
  angular.module('factories.notification-center.transactionSumary', []).run(function (notificationCenterFactory, notificationCenterTransactionSumary, firebaseCollections) {
    notificationCenterFactory.registerToGetNotifications({
      collection: [firebaseCollections.pendingProcessing],
      service: notificationCenterTransactionSumary,
      types: ['pendingProcessingTransactionsSummary']
    });
  }).factory('notificationCenterTransactionSumary', function () {
    var callbacks = [];
    var result;

    var dispatch = function dispatch(data) {
      console.log(['factories.notification-center.notificationCenterTransactionSumary.dispatch()', angular.copy(data)]);
      result = data.pendingProcessingTransactionsSummary;
      runCallbacks();
    },
        dispatchCallback = function dispatchCallback(attrs) {
      var found = callbacks.indexOf(attrs);

      if (found < 0) {
        callbacks.push(attrs);
      }

      if (result) {
        attrs.success(result);
      }
    },
        runCallbacks = function runCallbacks() {
      callbacks = callbacks.filter(function (callback) {
        return typeof callback.success == 'function';
      });
      callbacks.map(function (callback) {
        callback.success(result);
      });
    },
        factory = {
      dispatch: dispatch,
      dispatchCallback: dispatchCallback
    };

    return factory;
  });
})();

'use strict';

(function () {
  angular.module('factories.notification-center.transactions-awaiting', ['factories.favico']).run(function (notificationCenterFactory, notificationCenterTransactionsAwaiting, firebaseCollections) {
    notificationCenterFactory.registerToGetNotifications({
      collection: [firebaseCollections.pendingProcessing, firebaseCollections.chat],
      service: notificationCenterTransactionsAwaiting,
      types: ['pendingProcessingTransactionWaitingAttend', firebaseCollections.chat]
    });
  }).factory('notificationCenterTransactionsAwaiting', function (firebaseCollections, favicoFactory) {
    var data = {
      pendingProcessingTransactionWaitingAttend: []
    };
    data[firebaseCollections.chat] = [];

    var dispatch = function dispatch(collectionKeys) {
      console.log(['notificationCenterTransactionsAwaiting.dispatch(' + Object.keys(collectionKeys).join(',') + ')', angular.copy(collectionKeys)]);
      Object.assign(data, collectionKeys);
      setFavico();
    };

    var removeByAttribute = function removeByAttribute(attrs) {
      Object.keys(data).map(function (collectionKey) {
        data[collectionKey] = data[collectionKey].filter(function (item) {
          return item[attrs.attribute] != attrs.value;
        });
      });
      setFavico();
    };

    var removeById = function removeById(id) {
      Object.keys(data).map(function (collectionKey) {
        data[collectionKey] = data[collectionKey].filter(function (item) {
          return item.id != id;
        });
      });
      setFavico();
    };

    var setFavico = function setFavico() {
      favicoFactory.set({
        chat: data[firebaseCollections.chat].length,
        clients: data.pendingProcessingTransactionWaitingAttend.length
      });
    };

    var getTotalNewClients = function getTotalNewClients() {
      return data.pendingProcessingTransactionWaitingAttend.length;
    };

    var getTotalChats = function getTotalChats() {
      return data[firebaseCollections.chat].length;
    };

    return {
      dispatch: dispatch,
      removeByAttribute: removeByAttribute,
      removeById: removeById,
      getTotalNewClients: getTotalNewClients,
      getTotalChats: getTotalChats
    };
  });
})();

'use strict';

(function () {
  angular.module('anapro.formly.examples', []).controller('FormlyExamplesController', function ($scope, $filter, anaproFormlyFactory) {
    $scope.formBOptions = {};

    $scope.submit = function () {
      if ($scope.formB.$valid) {
        console.info('Submitting...', [$scope.formB, $scope.filterModel]);
      }
    };

    $scope.reset = function () {
      // $scope.formBOptions.resetModel();
      anaproFormlyFactory.resetModel($scope.formlyFields, $scope.filterModel);
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
      addressMultiInput: [{
        id: 123,
        // addressObj: {
        'prospectEnderecoLogradouro': 'Rua Piratininga',
        'prospectEnderecoNumero': '111',
        'prospectEnderecoBairroId': 24032,
        'prospectEnderecoBairroNome': 'Brás',
        'prospectEnderecoUF': 'SP',
        'prospectEnderecoCidadeId': 8860,
        'prospectEnderecoCidadeNome': 'São Paulo',
        'prospectEnderecoCEP': '03042001' // }

      }, {
        id: 456,
        // addressObj: {
        'prospectEnderecoLogradouro': 'Rua Piratininga',
        'prospectEnderecoNumero': '222',
        'prospectEnderecoBairroId': 24032,
        'prospectEnderecoBairroNome': 'Brás',
        'prospectEnderecoUF': 'SP',
        'prospectEnderecoCidadeId': 8860,
        'prospectEnderecoCidadeNome': 'São Paulo',
        'prospectEnderecoCEP': '03042001' // }

      }],
      phonesMultiInput: [{
        id: 1,
        phoneNumber: '1133334444'
      }, {
        id: 2,
        phoneNumber: '1133335555'
      }, {
        id: 3,
        phoneNumber: '1133335555'
      }],
      contactMultiInput: [{
        id: '123',
        cod: '112233',
        name: 'Client A'
      }, {
        id: '456',
        cod: '776655',
        name: 'Client B'
      }],
      documentsMultiInput: [{
        id: 1,
        type: 'CPF',
        cpfNumber: '50260466069'
      }, {
        id: 2,
        type: 'CNPJ',
        cnpjNumber: '65042630000174'
      }],
      documentsMultiInputUniqueType: [{
        id: 1,
        type: 'CPF',
        cpfNumber: '50260466069'
      }]
    };
    $scope.filterModel = {
      amounts: {}
    };
    $scope.formlyFields = [// {
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
        fields: [{
          // key: 'addressObj',
          type: 'address',
          templateOptions: {
            required: true
          },
          ngModelElAttrs: {
            'ng-readonly': 'to.readonly'
          },
          expressionProperties: {
            'templateOptions.readonly': function templateOptionsReadonly(currentValue, newValue, scope) {
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
        }]
      },
      templateOptions: {
        label: 'Endereços:'
      }
    }, {
      type: 'multiinput',
      key: 'documentsMultiInput',
      defaultValue: item.documentsMultiInput,
      data: {
        addLabel: '+',
        keepOnRemoveWhenContainsKey: 'id',
        fieldTypeKey: 'type',
        fieldsByType: {
          CPF: [{
            key: 'cpfNumber',
            type: 'maskedInput',
            templateOptions: {
              // label: 'CPF',
              required: true,
              cpf: true
            }
          }],
          CNPJ: [{
            key: 'cnpjNumber',
            type: 'maskedInput',
            templateOptions: {
              // label: 'CPNJ',
              required: true,
              cnpj: true
            }
          }]
        }
      },
      templateOptions: {
        label: 'Documentos:'
      }
    }, {
      type: 'multiinput',
      key: 'documentsMultiInputUniqueType',
      defaultValue: item.documentsMultiInputUniqueType,
      data: {
        addLabel: '+',
        keepOnRemoveWhenContainsKey: 'id',
        fieldTypeKey: 'type',
        fieldTypeKeyUnique: true,
        fieldsByType: {
          CPF: [{
            key: 'cpfNumber',
            type: 'maskedInput',
            templateOptions: {
              required: true,
              cpf: true
            }
          }],
          CNPJ: [{
            key: 'cnpjNumber',
            type: 'maskedInput',
            templateOptions: {
              // label: 'CPNJ',
              required: true,
              cnpj: true
            }
          }],
          OUTROS: [{
            key: 'outrosNumber',
            type: 'input',
            templateOptions: {
              optionLabel: 'OutrosX',
              required: true
            }
          }]
        }
      },
      templateOptions: {
        label: 'Documentos Unique:'
      }
    }, {
      type: 'multiinput',
      key: 'usuarioTelefones',
      className: 'user-progile-phones-field',
      defaultValue: item.phonesMultiInput,
      data: {
        addLabel: '+',
        // isArrayOfValues: true,
        // keepOnRemoveWhenContainsKey: 'id',
        fields: [{
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
        }]
      },
      templateOptions: {
        label: 'Telefones:'
      }
    }];
    item;
    var originalModel = {
      name: 'teste nome',
      phone: '11933334444',
      arrayOfFields: [{
        id: 1,
        name: 'abc',
        cod: '4455'
      }, {
        id: 2,
        name: 'zxc',
        cod: '6677'
      }],
      addresses: [{
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
      }, {
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
      }]
    };
    $scope.xfilterModel = angular.copy(originalModel);
    $scope.xformlyFields = [{
      type: 'input',
      key: 'name',
      defaultValue: originalModel.name,
      elementAttributes: {
        'flex': '50'
      },
      templateOptions: {
        type: 'text'
      }
    }, {
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
    }, {
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
        fields: [{
          key: 'name',
          type: 'input',
          templateOptions: {
            placeholder: 'Nome'
          }
        }, {
          key: 'email',
          type: 'anaproEmail',
          templateOptions: {
            required: true,
            placeholder: 'Email'
          }
        }, {
          key: 'cod',
          type: 'maskedInput',
          templateOptions: {
            placeholder: 'Cod',
            mask: '9.99-9'
          }
        }]
      }
    }, {
      type: 'multiinput',
      key: 'addresses',
      defaultValue: angular.copy(originalModel.addresses),
      elementAttributes: {
        'flex': '50'
      },
      data: {
        keepOnRemoveWhenContainsKey: 'id',
        addLabel: '+',
        fields: [{
          //key: 'abc',
          type: 'address',
          templateOptions: {
            required: true
          }
        }]
      },
      templateOptions: {
        label: 'Endereços:'
      }
    }, {
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
    }];
    var API_FIELDS = [{
      type: 'boolean',
      field: 'inputCheckbox'
    }, {
      type: 'text',
      field: 'inputText'
    }, {
      type: 'text',
      field: 'inputTextMinMaxLength',
      templateOptions: {
        minLength: 3,
        maxLength: 10
      }
    }, {
      type: 'text',
      field: 'inputTextMasked',
      templateOptions: {
        mask: '(99) 9?9999-9999'
      }
    }, {
      type: 'integer',
      field: 'inputCPF',
      templateOptions: {
        cpf: true
      }
    }, {
      type: 'text',
      field: 'inputCNPJ',
      templateOptions: {
        cnpj: true
      }
    }, {
      type: 'text',
      field: 'inputCPFouCNPJ',
      templateOptions: {
        cpfCnpj: true
      }
    }, {
      type: 'integer',
      field: 'inputInteger',
      templateOptions: {
        minValue: 5,
        maxValue: 25
      }
    }, {
      type: 'decimals',
      field: 'inputDecimal',
      templateOptions: {
        decimals: 3,
        minValue: 1,
        maxValue: 2
      }
    }, {
      type: 'decimals',
      field: 'inputMoney',
      templateOptions: {
        money: 2,
        minValue: 0.10,
        maxValue: 10
      }
    }, {
      type: 'multiSelect',
      field: 'multiSelect',
      options: [{
        name: 'valor A',
        value: 1
      }, {
        name: 'valor B',
        value: 2
      }, {
        name: 'valor C',
        value: 3
      }]
    }, {
      type: 'select',
      field: 'selectRadio',
      options: [{
        name: 'Opção Z',
        value: 'Z'
      }, {
        name: 'Opção X',
        value: 'X'
      }, {
        name: 'Opção Y',
        value: 'Y'
      }]
    }, {
      type: 'select',
      field: 'select',
      options: [{
        name: 'Name A',
        value: 'A'
      }, {
        name: 'Name B',
        value: 'B'
      }, {
        name: 'Name C',
        value: 'C'
      }]
    }, {
      type: 'email',
      field: 'inputEmail'
    }, {
      type: 'date',
      field: 'inputDate'
    }, {
      type: 'time',
      field: 'inputTime'
    }, {
      type: 'datetime',
      field: 'inputDateTime'
    }];
    API_FIELDS;
    anaproFormlyFactory.createFormlyFieldsFromAPI(API_FIELDS, $scope.xformlyFields, {
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
              mask: function mask(newValue, oldValue, scope) {
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
    });
  }).directive('formlyExamples', function () {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'formly-examples/fields.html',
      controller: 'FormlyExamplesController'
    };
  });
})();

'use strict';

(function () {
  angular.module('services.firebase', []).factory('firebaseService', function ($rootScope, $timeout, $http, usersService, firebaseProvider, urls) {
    var listeners = [];

    var firebaseInitSuccess = function firebaseInitSuccess() {
      listeners.map(function (listenerProvider) {
        if (listenerProvider.start) {
          listenerProvider.start();
        }
      });
    };

    var addListener = function addListener(listenerProvider) {
      listeners.push(listenerProvider);
    };

    var getTokenFromUserProfile = function getTokenFromUserProfile(attrs) {
      usersService.getUserProfile({
        success: function success(response) {
          var embedResouceFirebase = (response.data.embed || {}).firebase;

          if (embedResouceFirebase) {
            if (attrs.success) {
              attrs.success(embedResouceFirebase);
            }
          } else if (attrs.error) {
            attrs.error();
          }
        }
      });
    };

    var getTokenFromService = function getTokenFromService(attrs) {
      $http({
        url: urls.apiHost + urls.apiPaths.firebaseToken,
        method: 'GET'
      }).then(function (response) {
        attrs.success(response);
      });
    };

    var getToken = function getToken(attrs) {
      if (attrs.fromUserProfile) {
        getTokenFromUserProfile({
          success: function success(embedResourceFirebase) {
            if (embedResourceFirebase) {
              attrs.success({
                data: embedResourceFirebase
              });
            } else {
              getTokenFromService({
                success: attrs.success
              });
            }
          },
          error: function error() {
            getTokenFromService({
              success: attrs.success
            });
          }
        });
      } else {
        getTokenFromService({
          success: attrs.success
        });
      }
    };

    var init = function init() {
      firebaseProvider.init({
        getToken: getToken,
        success: firebaseInitSuccess
      });
    };

    return {
      init: init,
      getToken: getToken,
      addListener: addListener
    };
  });
})();

'use strict';

(function () {
  angular.module('services.firebase').provider('firebaseProvider', function () {
    var self = this,
        firestoreDB,
        token;

    var signout = function signout(success) {
      firebase.auth().signOut().then(function () {
        console.log('firebase: sign out success');

        if (typeof success == 'function') {
          success();
        }
      }).catch(function (error) {
        console.log('firebase: sign out error', error);
      });
    };

    var signin = function signin(attrs) {
      console.log('signin()');
      signout(function () {
        firebase.auth().signInWithCustomToken(token).then(function () {
          console.log('firebase: sign in success', 'uid: ' + firebase.auth().currentUser.uid);

          if (attrs.success) {
            attrs.success();
          }
        }).catch(function (error) {
          console.log('sign in error', error);

          if (attrs.error) {
            attrs.error();
          }
        });
      });
    };

    self.setFirestoreDB = function () {
      firestoreDB = firebase.firestore();
    };

    self.getFirestoreDB = function () {
      return firestoreDB;
    };

    self.getCurrentUser = function () {
      return firebase.auth().currentUser;
    };

    var getTokenService;

    var getTokenServiceSuccess = function getTokenServiceSuccess(response) {
      token = response.data.fields.firebaseUserWebToken;
    };

    self.$get = function ($rootScope, $timeout) {
      var countErrorLimit = 4;

      var getToken = function getToken(attrs) {
        getTokenService({
          fromUserProfile: attrs.fromUserProfile,
          success: function success(response) {
            getTokenServiceSuccess(response);
            signin(attrs);
          }
        });
      };

      var init = function init(attrs) {
        if (attrs.getToken) {
          getTokenService = attrs.getToken;
        }

        var errorInitCallback = attrs.error;

        attrs.error = function () {
          countErrorLimit--;
          attrs.fromUserProfile = false;

          if (countErrorLimit >= 0) {
            $timeout(function () {
              getToken(attrs);
            }, 3000);
          }

          if (errorInitCallback) {
            errorInitCallback();
          }
        };

        if (token) {
          signin(attrs);
        } else {
          attrs.fromUserProfile = true;
          getToken(attrs);
        }
      };

      self.init = init;
      self.signout = signout;
      return self;
    };
  });
})();

'use strict';

(function () {
  angular.module('services.firebase').run(function (firebaseService, firebaseListenerChatLegacy) {
    firebaseService.addListener(firebaseListenerChatLegacy);
  }).provider('firebaseListenerChatLegacy', function () {
    var self = this;

    self.$get = function ($rootScope, firebaseProvider, firebaseBroadcastsNames, firebaseCollections, firebaseCollectionsItemId, notificationCenterFactory) {
      var onSnapshot = function onSnapshot(snapshot) {
        var chats = [];
        snapshot.forEach(function (doc) {
          var data = doc.data();
          data.id = data[firebaseCollectionsItemId.chat];
          chats.push(data);
        });
        notificationCenterFactory.dispatch(firebaseCollections.chat, chats);
        $rootScope.$digest();
      };

      var start = function start() {
        firebaseProvider.getFirestoreDB().collection(firebaseCollections.chat).where('UsuarioIdGuid', '==', firebaseProvider.getCurrentUser().uid).where('ChatStatus', '==', 'Criado').onSnapshot(onSnapshot);
      };

      self.start = start;
      return self;
    };
  });
})();

'use strict';

(function () {
  angular.module('services.firebase').run(function (firebaseService, firebaseListenerPendenciaProcessamento) {
    firebaseService.addListener(firebaseListenerPendenciaProcessamento);
  }).provider('firebaseListenerPendenciaProcessamento', function () {
    var self = this;

    self.$get = function ($rootScope, firebaseProvider, firebaseBroadcastsNames, firebaseCollections) {
      var start = function start() {
        firebaseProvider.getFirestoreDB().collection(firebaseCollections.pendingProcessing).doc(firebaseProvider.getCurrentUser().uid).onSnapshot(function (doc) {
          $rootScope.$broadcast(firebaseBroadcastsNames.pendenciaprocessamento, doc.data());
        });
      };

      self.start = start;
      return self;
    };
  });
})();

'use strict';

(function () {
  angular.module('services.firebase').run(function (firebaseService, firebaseListenerPositionInQueues) {
    firebaseService.addListener(firebaseListenerPositionInQueues);
  }).provider('firebaseListenerPositionInQueues', function () {
    var self = this;

    self.$get = function ($rootScope, notificationCenterFactory, firebaseProvider, firebaseBroadcastsNames, firebaseCollections, usersService) {
      var onSnapshot = function onSnapshot(doc) {
        notificationCenterFactory.dispatch(firebaseCollections.queuesChannelChatByUser, doc.data() || {});
      };

      var getUserProfile = function getUserProfile() {
        usersService.getUserProfile({
          success: function success(response) {
            startFirebaseCollectionSnapshot({
              usuarioIdGuid: response.data.fields.usuario.usuarioIdGuid,
              contaSistemaIdGuid: response.data.extraInfo.contaSistemaIdGuid
            });
          }
        });
      };

      var startFirebaseCollectionSnapshot = function startFirebaseCollectionSnapshot(attrs) {
        console.log(['firebaseListenerPositionInQueues.startFirebaseCollectionSnapshot', attrs, '/' + firebaseCollections.queuesChannelChatByUser + '/' + attrs.contaSistemaIdGuid + ':' + attrs.usuarioIdGuid]);
        firebaseProvider.getFirestoreDB().collection(firebaseCollections.queuesChannelChatByUser).doc(attrs.contaSistemaIdGuid + ':' + attrs.usuarioIdGuid).onSnapshot(onSnapshot);
      };

      var start = function start() {
        getUserProfile();
      };

      self.start = start;
      return self;
    };
  });
})();

'use strict';

(function () {
  angular.module('services.firebase').factory('firebaseListenerQueuesChannel', function ($rootScope, firebaseProvider, firebaseCollections) {
    var getListener = function getListener(attrs) {
      return firebaseProvider.getFirestoreDB().collection(firebaseCollections.queuesChannel[attrs.channel]).doc(attrs.id).onSnapshot(function (doc) {
        var data = doc.data();

        if (data) {
          console.log(['firebaseListenerQueuesChannel.getListenerOnSnapShort()', attrs, angular.copy(data)]);
          data.collection = firebaseCollections.queuesChannel[attrs.channel];
          data.channel = attrs.channel;

          if (typeof attrs.success == 'function') {
            attrs.success(data);
          }
        } else {
          if (typeof attrs.error == 'function') {
            attrs.error({});
          }
        }

        $rootScope.$digest();
      });
    };

    return {
      getListener: getListener
    };
  });
})();

'use strict';

(function () {
  angular.module('services.firebase').run(function (firebaseService, firebaseListenerSystemMessages) {
    firebaseService.addListener(firebaseListenerSystemMessages);
  }).provider('firebaseListenerSystemMessages', function () {
    var self = this;

    self.$get = function ($rootScope, firebaseProvider, firebaseBroadcastsNames, firebaseCollections, notificationCenterFactory, usersService) {
      var contaSistemaIdGuid;

      var getUserDocumentPath = function getUserDocumentPath() {
        return firebaseCollections.systemMessages + '/' + contaSistemaIdGuid + ':' + firebaseProvider.getCurrentUser().uid;
      };

      var setMessageRead = function setMessageRead(id) {
        firebaseProvider.getFirestoreDB().doc(getUserDocumentPath(contaSistemaIdGuid)).collection('messages').doc(id).set({
          unread: false
        }, {
          merge: true
        });
      };

      var startFirebaseCollection = function startFirebaseCollection() {
        if (contaSistemaIdGuid) {
          console.log(contaSistemaIdGuid + ':' + firebaseProvider.getCurrentUser().uid);
          firebaseProvider.getFirestoreDB().doc(getUserDocumentPath(contaSistemaIdGuid)).collection('messages').where('unread', '==', true).onSnapshot(function (snapshot) {
            var newMessages = [];
            snapshot.docChanges.forEach(function (change) {
              if (change.type == 'added') {
                var data = change.doc.data();

                if (!data.id) {
                  data.id = change.doc.id;
                }

                data.onTap = function () {
                  setMessageRead(data.id);
                };

                data.onHidden = function () {
                  setMessageRead(data.id);
                };

                newMessages.push(data);
              }
            });
            notificationCenterFactory.dispatch(firebaseCollections.systemMessages, {
              systemMessages: newMessages
            });
          });
        }
      };

      var start = function start() {
        usersService.getUserProfile({
          success: function success(response) {
            contaSistemaIdGuid = response.data.extraInfo.contaSistemaIdGuid;
            startFirebaseCollection();
          }
        });
      };

      self.start = start;
      return self;
    };
  });
})();

'use strict';

(function () {
  angular.module('views.auth', []).controller('ViewAuthController', function ($scope, $location, $timeout, path, authService) {
    path.setCurrent('auth');
    $scope.showForm = !!window.APIFAKE;
    $scope.loading = false;
    $scope.submitStatus = {
      success: false,
      error: false
    };
    $scope.forms = {
      auth: null
    };
    $scope.model = {};
    $scope.fields = [{
      type: 'input',
      key: 'username',
      templateOptions: {
        type: 'text',
        label: 'Usuário',
        required: true
      }
    }, {
      type: 'input',
      key: 'password',
      templateOptions: {
        type: 'password',
        label: 'Senha',
        required: true
      }
    }];

    var postExecute = function postExecute(response) {
      $timeout(function () {
        $scope.submitStatus.success = false;
        $scope.submitStatus.error = false;
        $scope.loading = false;

        if (response.data.token) {
          $location.path(path.getPath('home')).replace();
        }
      }, 500);
    };

    $scope.loginSubmit = function () {
      if ($scope.forms.auth.$valid && !$scope.loading) {
        $scope.loading = true;
        authService.post({
          data: $scope.model,
          success: function success(response) {
            $scope.submitStatus.success = true;
            postExecute(response);
          },
          error: function error(response) {
            $scope.submitStatus.error = true;
            postExecute(response);
          }
        });
      }
    };
  });
})();

'use strict';

(function () {
  angular.module('views.calendar', ['views.calendar.list', 'views.calendar.list-filter', 'views.calendar.link-integration']).controller('ViewCalendarController', function ($scope, $routeParams, $timeout, destroyFactory, path, calendarService, listFactory, cardActionFactory, linkIntegrationFactory) {
    path.setCurrent('calendar');
    $scope.loading = true;
    $scope.error = false;
    $scope.empty = false;
    $scope.breadcrumbs = [{
      labelx: path.getCurrent().label
    }];
    $scope.viewTitle = {
      title: 'Agenda',
      desc: ''
    };

    var gerFilterHashLink = function gerFilterHashLink(attrs) {
      return calendarService.gerFilterHashLink(path.getPath('calendar'), attrs, $routeParams);
    };

    $scope.listObj = {
      data: {},
      delegate: {
        get: function get(attrs) {
          var hashLink = gerFilterHashLink(attrs);
          $scope.mainController.go(hashLink);
        },
        gerFilterHashLink: gerFilterHashLink,
        cardActions: {
          postItem: function postItem(item) {
            isSameMonth(item);
          }
        },
        calendarListItem: {
          newAction: function newAction(attrs) {
            $scope.addNewAppointment(attrs);
          }
        },
        calendarListFilter: {
          newAction: function newAction(attrs) {
            $scope.addNewAppointment(attrs);
          }
        }
      }
    };

    $scope.showModalLinkIntegration = function () {
      linkIntegrationFactory.showModal();
    };

    var getMonthNameFilter = function getMonthNameFilter() {
      return $scope.listObj.data.filters[0].initialValue ? moment($scope.listObj.data.filters[0].initialValue).format('MMMM [de] YYYY') : null;
    };

    var success = function success(response) {
      $scope.listObj.data = response.data;
      $scope.empty = !response.data.data || !response.data.data.length;
      $scope.loading = false;
      setViewTitleDesc();
    };

    var isSameMonth = function isSameMonth(item) {
      var interactionObj = item.fields[Object.keys(item.fields)[0]];

      if (!interactionObj.tarefa || interactionObj.tarefa.tarefaRealizado) {
        return;
      }

      var currentMonth = $scope.listObj.data.filters[0].initialValue;
      var currentMonthYear;

      if (currentMonth) {
        currentMonth = new Date(currentMonth);
        currentMonthYear = currentMonth.getMonth() + '-' + currentMonth.getFullYear();
      }

      var itemDate = new Date(interactionObj.tarefa.tarefaDtTarefa);
      var itemMonthYear = itemDate.getMonth() + '-' + itemDate.getFullYear();

      if (currentMonth && currentMonthYear == itemMonthYear || !currentMonth) {
        if (!$scope.listObj.data.data) {
          $scope.listObj.data.data = [];
          $scope.empty = false;
        }

        $scope.listObj.data.data.push(item);
      }
    };

    $scope.addNewAppointment = function (attrs) {
      attrs = attrs || {};
      var resource = attrs.resource || {
        id: null,
        resource: 'transactions'
      };
      cardActionFactory.showModal({
        resource: resource,
        tabButtonActivated: attrs.resource ? null : 'activity',
        tabButtonAttrs: attrs.resource ? {} : {
          activity: {
            modelWhen: 'todo'
          }
        },
        delegate: $scope.listObj.delegate.cardActions
      });
    };

    var setViewTitleDesc = function setViewTitleDesc() {
      $scope.viewTitle.desc = getMonthNameFilter() || '';
    };

    var get = function get(attrs) {
      $scope.empty = false;
      $scope.error = false;
      $scope.loading = true;
      calendarService.get({
        link: attrs.link,
        params: attrs.params,
        success: success,
        toastrMessages: {
          serverError: {
            onlyErrorMessage: true,
            title: 'Momentaneamente nenhum agendamento foi localizado.',
            message: 'Realize sua busca novamente.'
          }
        },
        error: function error(response) {
          $scope.error = response.config.errorMessage;
        }
      });
    };

    $scope.$on('$viewContentLoaded', function () {
      $timeout(function () {
        var attrs = listFactory.getAttrsFromRouteParams($routeParams);
        get(attrs);
      }, 0);
    });
    destroyFactory({
      scope: $scope,
      objects: [$scope.listObj]
    });
  });
})();

'use strict';

(function () {
  angular.module('views.clients', []).controller('ViewClientsController', function ($scope, $timeout, path) {
    path.setCurrent('clients');
    $scope.breadcrumbs = [{
      label: path.getCurrent().label,
      path: false
    }];
    $scope.$on('$destroy', function () {
      $timeout(function () {
        false;
      }, 0);
    });
  });
})();

'use strict';

(function () {
  angular.module('views.home', []).controller('ViewHomeController', function ($scope, path, navigationBarFactory) {
    $scope;
    navigationBarFactory.backButton.hide();
    path.setCurrent('home');
    $scope.$on('$destroy', function () {
      navigationBarFactory.backButton.show();
    });
  });
})();

'use strict';

(function () {
  angular.module('views.queues-handler-position', []).controller('ViewQueuesHandlerPositionController', function ($scope, $routeParams, path, permission, usersService, userStatusFactory, userStatusLabels, userQueueStatusProperties, firebaseListenerQueuesChannel) {
    path.setCurrent('queues-handler-position');
    $scope.breadcrumbs = [{
      label: path.get('queues-handler-position').label,
      path: false
    }];
    $scope.viewTitle = {
      title: path.getCurrent().label,
      subtitle: '',
      desc: ''
    };
    var currentUserId;
    var data;
    $scope.channelProperties;
    $scope.dataQueue = {};
    $scope.users = [];
    $scope.error = false;
    $scope.loading = true;
    var listener;

    var setViewTitle = function setViewTitle() {
      $scope.viewTitle.subtitle = userStatusLabels[data.channel];
      $scope.viewTitle.desc = data.CampanhaNome + ' : ' + data.CanalNome;
    };

    var mergeUsersPosition = function mergeUsersPosition() {
      data.Posicoes.map(function (user) {
        var userPositionInView = $scope.users.filter(function (userInView) {
          return user.UsuarioContaSistemaIdGuid == userInView.UsuarioContaSistemaIdGuid;
        });

        if (userPositionInView && userPositionInView.length) {
          angular.merge(userPositionInView[0], user);
        } else {
          $scope.users.push(user);
        }
      });
    };

    var removeUsersPosition = function removeUsersPosition() {
      var removedUsers = [];
      removedUsers = $scope.users.filter(function (userInView) {
        var found = false;
        data.Posicoes.map(function (user) {
          if (user.UsuarioContaSistemaIdGuid == userInView.UsuarioContaSistemaIdGuid) {
            found = true;
          }
        });
        return !found;
      });
      removedUsers.map(function (item) {
        $scope.users.splice($scope.users.indexOf(item), 1);
      });
    };

    var normalizeUserNames = function normalizeUserNames() {
      data.Posicoes.map(function (item) {
        var splitedName = item.UsuarioContaSistemaNome.split(' ');
        item.UsuarioContaSistemaNome = (splitedName.shift() + ' ' + (splitedName.pop() || '')).trim();
      });
    };

    var getSuccess = function getSuccess(collectionDoc) {
      data = collectionDoc;
      $scope.dataQueue = data;
      $scope.channelProperties = userStatusFactory.getChannelProperties(data.channel);

      if (!$scope.channelProperties) {
        getError({
          title: 'Esse canal está indisponível',
          message: 'O canal da fila está indisponível no momento, tente novamente mais tarde. Obrigado.'
        });
        return;
      }

      setViewTitle();

      if (permission.checkPermissions($scope.channelProperties.permissionPositionInQueue) === false) {
        getError({
          title: 'Sem permissão',
          message: 'Você não tem permissão para ver essa fila.'
        });
      } else if (permission.checkPermissions($scope.channelProperties.permissionPositionInQueue) === 'disabled') {
        getError({
          title: 'Fila desativada',
          message: 'Essa fila está desativada temporariamente.'
        });
      } else {
        normalizeUserNames();
        mergeUsersPosition();
        removeUsersPosition();
        $scope.loading = false;
      }
    };

    var getError = function getError(error) {
      $scope.error = error;
    };

    var startListener = function startListener(contaSistemaIdGuid) {
      listener = firebaseListenerQueuesChannel.getListener({
        channel: 'chat',
        id: contaSistemaIdGuid + ':' + $routeParams.id,
        success: getSuccess,
        error: function error() {
          getError({
            title: 'Essa fila esta indisponível no momento',
            message: 'Tente novamente mais tarde'
          });
        }
      });
    };

    $scope.isSameUser = function (item) {
      return currentUserId == item.UsuarioContaSistemaIdGuid;
    };

    $scope.getStatusProperties = function (status) {
      return userQueueStatusProperties[status];
    };

    $scope.$on('$viewContentLoaded', function () {
      usersService.getUserProfile({
        success: function success(response) {
          currentUserId = response.data.id;
          startListener(response.data.extraInfo.contaSistemaIdGuid);
        }
      });
    });
    $scope.$on('$destroy', function () {
      listener();
      listener = null;
    });
  });
})();

'use strict';

(function () {
  angular.module('views.transaction', []).controller('ViewTransactionController', function ($rootScope, $scope, $timeout, $routeParams, $popover, $document, path, transactionsService, toastrFactory, transactionTransferFactory, transactionFinishFactory, usersService, notificationCenterFactory, destroyFactory, cardActionFactory) {
    path.setCurrent('transaction');
    var breadcrumbsClientName = {
      path: false
    };
    $scope.breadcrumbs = [{
      label: path.get('transactions').label,
      path: path.get('transactions').path
    }, breadcrumbsClientName];
    $scope.error = false;
    $scope.loading = true;
    $scope.transactionItem = {};
    $scope.clientItem = {};
    $scope.expiresProgressThreshold = transactionsService.getExpiresProgressThreshold();
    $scope.$watch('clientItem', function (newValue) {
      if (newValue.fields) {
        setCardActionsData();
        breadcrumbsClientName.label = $scope.clientItem.fields.prospect.prospectNome;
      }
    }, true);
    $scope.cardActionsResource = {
      id: null,
      resource: 'transactions'
    };
    $scope.quickActionsModel = {
      value: 'none'
    };

    var resetQuickActionsModel = function resetQuickActionsModel() {
      $scope.quickActionsModel.value = 'none';
    };

    var quickActions = {
      transfer: function transfer() {
        transactionTransferFactory.show({
          item: $scope.transactionItem,
          onHide: resetQuickActionsModel,
          delegate: {
            reset: resetQuickActionsModel,
            updateItem: function updateItem(transferredItem) {
              if ($scope.transactionItem.id != transferredItem.id) {
                $rootScope.mainController.go(path.get('transaction').withItem(transferredItem), true);
              } else {
                transactionsService.updateItem($scope.transactionItem, transferredItem);
                setViewTitle();
              }
            },
            removeItemFromUser: function removeItemFromUser() {
              $rootScope.mainController.go(path.getPath('transactions'), true);
            }
          }
        });
      },
      finish: function finish(action) {
        transactionFinishFactory.show({
          item: $scope.transactionItem,
          action: action,
          onHide: resetQuickActionsModel,
          delegate: {
            reset: resetQuickActionsModel,
            updateItem: function updateItem() {
              $rootScope.mainController.go(path.get('transactions'), false);
            }
          }
        });
      }
    };

    $scope.transfer = function () {
      quickActions.transfer();
    };

    $scope.finish = function (action) {
      quickActions.finish(action);
    };

    $scope.quickActionTransferLabel = function () {
      return transactionsService.isFinished($scope.transactionItem) ? 'Reabrir' : 'Transferir';
    };

    var setTransactionItem = function setTransactionItem(data) {
      $scope.transactionItem = data;
      $scope.clientItem = data.expand.clients;
      $scope.cardActionsResource.id = data.id;
    };

    $scope.viewTitleExtra = [];

    var setViewTitle = function setViewTitle() {
      $scope.viewTitleDesc = 'Código de negócio: ' + $scope.transactionItem.fields.atendimento.atendimentoCodigo;
      $scope.viewTitleExtra.splice(0, $scope.viewTitleExtra.length); // $scope.viewTitleExtra.push(
      // 	'Fase: ' + $scope.transactionItem.extraInfo.pipelineStageNome
      // 	'Status: ' + $scope.transactionItem.fields.atendimento.atendimentoStatus
      // );
      // if($scope.transactionItem.extraInfo.usuarioNome) {
      // 	$scope.viewTitleExtra.push(
      // 		'Corretor: ' + $scope.transactionItem.extraInfo.usuarioNome
      // 	);
      // }
    };

    $scope.cardActionsData = cardActionFactory.getNewCardActionsData();

    var setCardActionsData = function setCardActionsData() {
      if ($scope.clientItem.fields) {
        $scope.transactionItem.extraInfo.prospectNome = $scope.clientItem.fields.prospect.prospectNome;
        $scope.cardActionsData.update({
          title: $scope.transactionItem.extraInfo.produtoNome,
          emailFollowup: $scope.transactionItem.extraInfo.atendimentoFollowUpEmail,
          prospectNome: $scope.transactionItem.extraInfo.prospectNome,
          phones: $scope.clientItem.fields.prospectTelefones,
          emails: $scope.clientItem.fields.prospectEmails
        });
      }
    };

    var toastAttended;

    var setToastAttended = function setToastAttended() {
      toastAttended = function toastAttended() {
        $rootScope.mainController.go(path.get('transaction').withItem($scope.transactionItem));
      };
    };

    var attendBeforeDisplay = function attendBeforeDisplay(attrs) {
      var item = attrs.item;
      usersService.getUserProfile({
        success: function success(response) {
          var userProfile = response.data;

          if (transactionsService.isOnQueue(item)) {
            if (item.fields.atendimento.atendimentoUsuarioContaSistemaIdGuid == userProfile.id) {
              transactionsService.actions({
                item: item,
                action: 'attend',
                method: 'POST',
                toastrMessages: {
                  success: {
                    title: 'Parabéns!',
                    message: 'Você acaba de iniciar o atendimento com ' + item.expand.clients.fields.prospect.prospectNome + '. Nós do Anapro desejamos uma ótima venda.',
                    autoDismiss: false,
                    onTap: function onTap() {
                      if (toastAttended) {
                        toastAttended();
                      }
                    },
                    forbidden: {
                      title: 'Desculpe, aparentemente você não pode iniciar esse atendimento ou, ele já foi atendido por outra pessoa.',
                      message: 'Tente novamente mais tarde, obrigado.'
                    },
                    serverError: {
                      title: 'Desculpe, estamos com dificuldades para iniciar esse atendimento.',
                      message: 'Tente novamente mais tarde, obrigado.'
                    }
                  }
                },
                success: function success(response) {
                  transactionsService.updateItem(item, response.data);
                  notificationCenterFactory.removeNotificationByAttribute({
                    attribute: 'atendimentoIdGuid',
                    value: item.id
                  }, true);
                  attrs.callback(item);
                },
                error: function error() {
                  $scope.error = true;
                  $scope.loading = false;
                }
              });
              return;
            } else if (usersService.isAdm()) {
              toastrFactory.warn({
                title: 'Desculpe!',
                message: 'O cliente ' + item.expand.clients.fields.prospect.prospectNome + ' pertence a outro usuário. Para iniciar esse atendimento basta transferi-lo à você. ' + 'Clique aqui se deseja transferir agora.',
                onTap: quickActions.transfer
              });
            }
          }

          attrs.callback(item);
        }
      });
    };

    var getItem = function getItem(id) {
      transactionsService.getItem({
        params: {
          '_expand': ['clients']
        },
        id: id,
        toastrMessages: {
          payloadError: {
            onlyErrorMessage: true,
            title: 'Esse atendimento não existe.',
            message: ''
          },
          forbidden: {
            title: 'Esse cliente pertence a outro usuário.',
            message: 'Se ele estava aguardando atendimento, alguém o atendeu antes de você.'
          }
        },
        success: function success(response) {
          attendBeforeDisplay({
            item: response.data,
            callback: function callback(item) {
              setTransactionItem(item);
              setCardActionsData();
              setViewTitle();
              $scope.loading = false;
            }
          });
        },
        error: function error(response) {
          console.log(response);
          $scope.loading = false;
          $scope.error = response.config.errorMessage;
        }
      });
    };

    $scope.isOnQueue = function () {
      return transactionsService.isOnQueue($scope.transactionItem);
    };

    $scope.isFinished = function () {
      return transactionsService.isFinished($scope.transactionItem);
    };

    $scope.canEditWhenNotActive = function () {
      return transactionsService.canEditWhenNotActive($scope.transactionItem);
    };

    $scope.delegates = {
      cardActions: {
        postItem: function postItem(item) {
          $scope.delegates.cardFollowup.addItem(item);
        }
      },
      cardFollowup: {},
      stage: setViewTitle
    };
    $scope.delegates.cardClient = {
      cardActions: $scope.delegates.cardActions
    };

    $scope.showModal = function () {
      cardActionFactory.showModal({
        data: $scope.cardActionsData,
        resource: $scope.cardActionsResource,
        delegate: $scope.delegates.cardActions
      });
    };

    $scope.getStatusClassName = function () {
      return transactionsService.statusesByFieldValue[$scope.transactionItem.fields.atendimento.atendimentoStatus];
    };

    $scope.getDaysToExpires = function (item) {
      var days = transactionsService.getExpiresTimeInDays(item);
      return days > 99 ? '99+' : days;
    };

    $scope.getExpiresTooltip = function (item) {
      return transactionsService.getExpiresText(item);
    };

    $scope.$on('$viewContentLoaded', function () {
      $timeout(function () {
        if ($routeParams.id) {
          getItem($routeParams.id);
        }
      }, 0);
    });
    $scope.$on('$destroy', function () {
      setToastAttended();
    });
    destroyFactory({
      scope: $scope,
      objects: [$scope.delegates]
    });
  });
})();

'use strict';

(function () {
  angular.module('views.transactions', []).controller('ViewTransactionsController', function ($scope, $timeout, $routeParams, $location, path, transactionsService, pipelinesService, stageFormFactory, listFactory, navigationBarFactory, destroyFactory, notificationCenterTransactionsAwaiting, pendingProcessingService) {
    navigationBarFactory.backButton.hide();
    path.setCurrent('transactions');
    $scope.breadcrumbs = [{
      label: path.getCurrent().label,
      path: false
    }];
    $scope.loading = true;
    $scope.empty = false;
    $scope.error = false;

    var generateStageSelectOption = function generateStageSelectOption(response) {
      if (!$scope.listObj.stageSelectOptions.length) {
        $scope.listObj.stageSelectOptions = response.data.data;
        attachStagesToTransactions();
      }
    };

    var attachStagesToTransactions = function attachStagesToTransactions() {
      var stagesById = {};
      $scope.listObj.stageSelectOptions.map(function (item) {
        stagesById[item.id] = item;
      });
      $scope.listObj.data.data.map(function (item) {
        item.originalStageItem = item.stageItem = stagesById[item.fields.atendimento.atendimentoPipelineStageIdGuid];
      });
    };

    var viewStatuses = null;

    var setViewStatuses = function setViewStatuses(filters) {
      if (!viewStatuses) {
        viewStatuses = {};
        filters.map(function (item) {
          if (item.field == 'atendimentoStatus') {
            viewStatuses.defaultValue = item.defaultValue;
            item.options.map(function (status) {
              viewStatuses[status.value] = status.name;
            });
          }
        });
      }
    };

    $scope.viewTitle = {};

    var setViewTitle = function setViewTitle(attrs, filters) {
      setViewStatuses(filters);
      $scope.viewTitle.title = path.getCurrent().label;

      if (attrs.params && attrs.params.filters && attrs.params.filters.atendimentoStatus) {
        $scope.viewTitle.desc = viewStatuses[attrs.params.filters.atendimentoStatus];
      } else {
        $scope.viewTitle.desc = viewStatuses[viewStatuses.defaultValue];
      }
    };

    var fixWhenEmptyFilterByWaitingClients = function fixWhenEmptyFilterByWaitingClients(filter) {
      if ($scope.empty && filter && filter.filters && Object.keys(filter.filters)[0] == 'atendimentoStatus' && filter.filters.atendimentoStatus == transactionsService.statuses.queue && filter.removeFilterWhenEmpty && notificationCenterTransactionsAwaiting.getTotalNewClients() > 0) {
        pendingProcessingService.setEmptyTransactionsAwaiting();
        $scope.mainController.go(path.getPath('transactions'), true);
      }
    };

    var get = function get(attrs) {
      $scope.empty = false;
      $scope.loading = true;
      $scope.error = false;
      transactionsService.get({
        params: attrs.params,
        link: attrs.link,
        toastrMessages: {
          serverError: {
            title: 'Momentaneamente nenhum atendimento foi localizado.',
            message: 'Realize sua busca novamente.'
          }
        },
        success: function success(response) {
          $scope.listObj.data = response.data;
          $scope.loading = false;
          $scope.empty = !response.data.data || !response.data.data.length;
          fixWhenEmptyFilterByWaitingClients(attrs.params);

          if (!$scope.empty) {
            pipelinesService.get({
              success: generateStageSelectOption,
              toastrMessages: {
                serverError: {
                  onlyErrorMessage: true,
                  title: 'Desculpe, estamos momentaneamente com dificuldades para permitir a troca de fases dos atendimentos',
                  message: 'Por favor, tente novamente mais tarde, obrigado.'
                }
              }
            });
          }

          if (attrs.success) {
            attrs.success();
          }

          setViewTitle(attrs, response.data.filters);
        },
        error: function error(response) {
          $scope.error = response.config.errorMessage;
        }
      });
    };

    var gerFilterHashLink = function gerFilterHashLink(attrs) {
      return transactionsService.gerFilterHashLink(path.getPath('transactions'), attrs, $routeParams);
    };

    $scope.listObj = {
      data: {},
      stageSelectOptions: [],
      delegate: {
        get: function get(attrs) {
          var hashLink = gerFilterHashLink(attrs);
          $scope.mainController.go(hashLink);
        },
        gerFilterHashLink: gerFilterHashLink
      }
    };
    $scope.$on('$viewContentLoaded', function () {
      $timeout(function () {
        var attrs = listFactory.getAttrsFromRouteParams($routeParams);
        get(attrs);
      }, 0);
    });
    $scope.$on('$destroy', function () {
      navigationBarFactory.backButton.show();
    });
    destroyFactory({
      scope: $scope,
      objects: [$scope.listObj]
    });
  });
})();

'use strict';

(function () {
  angular.module('views.user-profile', []).controller('ViewUserProfileController', function ($scope, $filter, $timeout, path, usersService) {
    path.setCurrent('user-profile');
    $scope.breadcrumbs = [{
      label: path.get('user-profile').label,
      path: false
    }];
    $scope.viewTitle = {
      title: 'Dados',
      subtitle: 'pessoais'
    };
    var data = {};
    $scope.urlAvatar;
    $scope.formOptions = {};
    $scope.model = {};
    $scope.fields = [];
    $scope.error = false;
    $scope.loading = true;
    $scope.submitStatus = {
      success: false,
      error: false
    };

    var setFields = function setFields() {
      var fieldsLayout = 'column';
      $scope.fields = [{
        type: 'input',
        key: 'usuarioNome',
        defaultValue: data.fields.usuario.usuarioNome,
        elementAttributes: {
          'layout': fieldsLayout
        },
        templateOptions: {
          label: 'Nome completo:',
          type: 'text',
          required: true,
          minlength: 6,
          maxlength: 100
        }
      }, {
        type: 'input',
        key: 'usuarioApelido',
        defaultValue: data.fields.usuario.usuarioApelido,
        elementAttributes: {
          'layout': fieldsLayout
        },
        templateOptions: {
          label: 'Apelido:',
          type: 'text',
          maxlength: 100
        }
      }, {
        type: 'anaproEmail',
        key: 'usuarioEmail',
        defaultValue: data.fields.usuario.usuarioEmail,
        elementAttributes: {
          'layout': fieldsLayout
        },
        templateOptions: {
          label: 'Email:',
          placeholder: 'exemplo@exemplo.com',
          required: true
        }
      }, {
        type: 'anaproSelectButtons',
        key: 'usuarioSexo',
        defaultValue: data.fields.usuario.usuarioSexo,
        elementAttributes: {
          'layout': fieldsLayout
        },
        templateOptions: {
          label: 'Sexo:',
          options: [{
            value: 'M',
            name: 'Masculino'
          }, {
            value: 'F',
            name: 'Feminino'
          }]
        }
      }, {
        type: 'maskedInput',
        key: 'usuarioCPF',
        className: 'fieldCPF',
        defaultValue: data.fields.usuario.usuarioCPF,
        elementAttributes: {
          'layout': fieldsLayout
        },
        templateOptions: {
          label: 'CPF:',
          type: 'tel',
          required: true,
          cpf: true
        }
      }, {
        type: 'anaproDate',
        key: 'usuarioDtNascimento',
        defaultValue: data.fields.usuario.usuarioDtNascimento,
        className: 'input-nogrow',
        elementAttributes: {
          'layout': fieldsLayout
        },
        templateOptions: {
          required: true,
          label: 'Data de nascimento:',
          placeholder: 'dd/mm/aaaa',
          max: $filter('date')(new Date(), 'yyyy-MM-ddT00:00:00'),
          dateFormat: 'yyyy-MM-ddT00:00:00',
          icon: 'calendar'
        },
        validation: {
          messages: {
            max: function max() {
              return 'A data de nascimento precisa ser menor ou igual a hoje';
            }
          }
        }
      }, {
        type: 'multiinput',
        key: 'usuarioTelefones',
        className: 'user-profile-phones-field',
        defaultValue: data.fields.usuario.usuarioTelefones,
        elementAttributes: {
          'layout': fieldsLayout
        },
        data: {
          isArrayOfValues: true,
          addLabel: '+',
          fields: [{
            type: 'maskedInput',
            elementAttributes: {
              'flex': ''
            },
            templateOptions: {
              required: true,
              type: 'tel',
              mask: '(99) 9?9999-9999'
            }
          }]
        },
        templateOptions: {
          label: 'Telefones:'
        }
      }, {
        className: 'dividerPassword',
        template: '<hr/>'
      }, {
        type: 'input',
        key: 'usuarioSenhaAtual',
        className: 'fieldPassword',
        elementAttributes: {
          'layout': fieldsLayout
        },
        templateOptions: {
          type: 'password',
          label: 'Senha atual:',
          hint: 'Deixe em branco caso não queira alterar a senha'
        },
        expressionProperties: {
          'templateOptions.required': '!!model.usuarioSenhaNova'
        }
      }, {
        type: 'input',
        key: 'usuarioSenhaNova',
        className: 'fieldPassword',
        elementAttributes: {
          'layout': fieldsLayout
        },
        expressionProperties: {
          'templateOptions.required': '!!model.usuarioSenhaAtual'
        },
        templateOptions: {
          type: 'password',
          label: 'Nova senha:',
          minlength: 8,
          maxlength: 15,
          hint: 'A senha deve conter entre 8 e 15 caracteres.'
        },
        validators: {
          passwordConfirm: {
            expression: function expression(viewValue, modelValue) {
              if (!modelValue) {
                var passwordConfirmField = $scope.fields[$scope.fields.length - 1];
                passwordConfirmField.value('');
                passwordConfirmField.resetModel();
              }

              return true;
            }
          }
        }
      }, {
        type: 'input',
        key: 'usuarioSenhaNovaConfirmacao',
        className: 'fieldPassword',
        model: {},
        elementAttributes: {
          'layout': fieldsLayout
        },
        templateOptions: {
          type: 'password',
          label: 'Confirmar nova senha:',
          hint: 'Digite novamente sua nova senha'
        },
        expressionProperties: {
          'templateOptions.required': function templateOptionsRequired() {
            if ($scope.model.usuarioSenhaNova) {
              return true;
            } else {
              return false;
            }
          },
          'templateOptions.disabled': function templateOptionsDisabled() {
            if ($scope.model.usuarioSenhaNova) {
              return '';
            } else {
              return 'true';
            }
          }
        },
        validators: {
          passwordConfirm: {
            expression: function expression(viewValue, modelValue) {
              return modelValue == $scope.model.usuarioSenhaNova;
            },
            message: '"A confirmação de senha não confere."'
          }
        }
      }];
    };

    var postExecute = function postExecute() {
      $timeout(function () {
        $scope.submitStatus.success = false;
        $scope.submitStatus.error = false;
        $scope.loading = false;
      }, 500);
    };

    var submitError = function submitError() {
      $scope.submitStatus.error = true;
      postExecute();
    };

    var success = function success(response) {
      data = response.data;
      setFields();
      setUrlAvatar();
      $scope.loading = false;
    };

    var setUrlAvatar = function setUrlAvatar() {
      $scope.urlAvatar = data.fields.usuario.usuarioUrlImagem;
    };

    var submitSuccess = function submitSuccess(response) {
      $scope.submitStatus.success = true;
      data = response.data;
      usersService.updateCurrentProfile(data.fields.usuario);
      $scope.model = {};
      setFields();
      setUrlAvatar();
      postExecute();
    };

    $scope.submit = function (form) {
      if (form.$valid && !$scope.loading) {
        $scope.loading = true;
        usersService.patchMyUser({
          data: {
            fields: {
              usuario: $scope.model
            }
          },
          success: submitSuccess,
          error: submitError
        });
      }
    };

    $scope.cancel = function () {
      $scope.formOptions.resetModel();
    };

    var getUserProfileError = function getUserProfileError(response) {
      $scope.error = response.config.errorMessage;
    };

    $scope.$on('$viewContentLoaded', function () {
      usersService.getMyUser({
        success: success,
        error: getUserProfileError,
        toastrMessages: {
          serverError: {
            title: 'Os seus dados estão indisponíveis.',
            message: 'Por favor, tente novamente mais tarde.'
          }
        }
      });
    });
  });
})();

'use strict';

(function () {
  angular.module('directives.card-followup-item', ['directives.card-followup-email', 'directives.card-followup-email-modal', 'directives.card-followup-ligacao', 'directives.card-followup-chat']).controller('CardFollowupItemController', function ($scope, $timeout, $sce, path, followupService, originalEmailFactory, ligacaoFollowupFactory, chatFollowupFactory) {
    var type,
        cardContentSize = 200,
        typeSVGIcon = {
      interacaoNota: 'note',
      interacaoAtividade: 'appointment',
      call: 'phone',
      interacaoEmail: 'envelope',
      interacaoLog: 'gear',
      interacaoChat: 'chat3',
      interacaoLigacao: 'phone',
      done: 'checked'
    },
        contentByType = {
      interacaoAtividade: 'interacaoTexto',
      interacaoNota: 'interacaoTexto',
      interacaoChat: 'interacaoChatConversas',
      interacaoLog: 'interacaoTexto',
      interacaoLigacao: 'interacaoLigacaoDuracao',
      interacaoEmail: 'interacaoEmailAssunto'
    }; // to be used when set pill colors`

    $scope.clientName;
    var generateContentByType = {
      interacaoChat: function interacaoChat() {
        return chatFollowupFactory.generateChatContent({
          item: $scope.item.fields.interacaoChat
        });
      },
      interacaoLigacao: function interacaoLigacao() {
        return ligacaoFollowupFactory.generateLigacaoContent({
          item: $scope.item.fields.interacaoLigacao
        });
      }
    };

    var setContentHashTags = function setContentHashTags() {
      $scope.content = $sce.trustAsHtml($scope.content.replace(/(#.*?)(\s|\n|$)/g, function (arg1, arg2, arg3) {
        return '<a href="' + path.getPath('transactions') + encodeURIComponent(arg1) + '">' + arg2 + '</a>' + arg3;
      }));
    };

    var setContent = function setContent() {
      $scope.content = generateContentByType[type] ? generateContentByType[type]() : $scope.interaction[contentByType[type] || 'interacaoTexto'];
      setContentHashTags();
    };

    var setItem = function setItem() {
      type = followupService.getType($scope.item);
      $scope.interaction = followupService.getInteraction($scope.item);
    };

    $scope.getTypeInteraction = function () {
      var type = followupService.getType($scope.item);

      if (/interacaoNota|interacaoAtividade/.test(type) && $scope.interaction.interacaoTipoSub) {
        return true;
      }

      return false;
    };

    var getAlarmDate = function getAlarmDate() {
      if ($scope.interaction.tarefa && $scope.interaction.tarefa.alarme) {
        return $scope.interaction.tarefa.alarme.alarmeDtAlarme;
      }

      return false;
    };

    var setDateTemplate = function setDateTemplate() {
      $scope.dateTemplate = getAlarmDate() || $scope.interaction.interacaoDtConclusao || $scope.interaction.interacaoDtInclusao;
    };

    var setDropdownMenu = function setDropdownMenu() {
      if ($scope.interaction.interacaoRealizado) {
        $scope.hasTask = false;
        $scope.hasTaskToBeDone = false;
        $scope.hasAlarm = false;
      } else {
        $scope.hasTask = !!$scope.interaction.tarefa;
        $scope.hasTaskToBeDone = $scope.hasTask && !$scope.interaction.interacaoRealizado;
        $scope.hasAlarm = !$scope.interaction.interacaoRealizado && $scope.hasTask && !!$scope.interaction.tarefa.alarme;
      }
    };

    $scope.toggleDropdownMenu = function (event) {
      event.stopPropagation();
      $($(event.target).closest('.btn-group')).find('.dropdown-menu').dropdown('toggle');
    };

    $scope.getDescriptionBodyClass = function () {
      return {
        'hidden-content': $scope.showButtonMoreContent && $scope.isContentHidden,
        'display-content': $scope.showButtonMoreContent && !$scope.isContentHidden
      };
    };

    $scope.showButtonMoreContent = false;
    $scope.isContentHidden = true;

    $scope.toggleHiddenContent = function () {
      $scope.isContentHidden = !$scope.isContentHidden;
    };

    var setShowButtonMoreContent = function setShowButtonMoreContent() {
      var content = $scope.content;

      if (content.length > cardContentSize) {
        $scope.showButtonMoreContent = true;
      }
    };

    var processItem = function processItem() {
      setItem();
      setContent();
      setShowButtonMoreContent();
      setDateTemplate();
      setDropdownMenu();
      setAvatarItem();
    };

    $scope.loading = false;
    $scope.submitStatus = {
      success: false,
      error: false
    };
    $scope.resource = $scope.$parent.resource;
    $scope.modalDelegate = {
      hide: function hide() {
        $scope.edit = false;
      }
    };

    $scope.getSVGIcon = function () {
      var svgIcon = typeSVGIcon[type]; // if(/interacaoNota|interacaoAtividade/.test(type)
      // 	&& $scope.interaction.interacaoRealizado
      // 	&& $scope.interaction.tarefa
      // ){
      // 	svgIcon = typeSVGIcon['done'];
      // }

      return svgIcon;
    };

    $scope.edit = false;

    $scope.activeEdit = function () {
      $scope.edit = true;
    };

    $scope.done = function () {
      $scope.edit = false;
      $scope.loading = true;
      followupService.actions({
        item: $scope.item,
        action: 'taskDone',
        data: {
          fields: {
            tarefa: {
              tarefaRealizado: true
            }
          }
        },
        toastrMessages: getToastMessage('atualizar'),
        success: function success(response) {
          $scope.submitStatus.success = true;
          postExecute();
          $scope.itemDelegate.reschedule(response.data);
        },
        error: function error() {
          $scope.submitStatus.error = true;
          postExecute();
        }
      });
    }; // $scope.deleteItem = function(){
    // 	$scope.loading = true;
    // 	followupService.deleteItem({
    // 		item: $scope.item,
    // 		success: function(response){
    // 			$scope.submitStatus.success = true;
    // 			postExecute(function(){
    // 				$scope.delegate.deleteItem($scope.item);
    // 			});
    // 			showToast(response);
    // 		},
    // 		error: function(response){
    // 			$scope.submitStatus.error = true;
    // 			postExecute();
    // 			showToast(response);
    // 		}
    // 	});
    // };


    $scope.getOriginalEmail = function () {
      originalEmailFactory.show({
        item: $scope.item
      });
    };

    $scope.itemDelegate = {
      reschedule: function reschedule(item) {
        var oldItem = $scope.item;
        $scope.item = item;
        processItem();
        itemClass.overdue = false;

        if ($scope.interaction.tarefa) {
          if ($scope.interaction.tarefa.tarefaRealizado) {
            itemClass.due = false;
          } else {
            itemClass.due = true;
          }
        }

        $scope.delegate.patchItem(oldItem, item);
      }
    };

    $scope.getType = function () {
      return type;
    };

    $scope.isType = function (itemType) {
      return type == itemType;
    };

    var getToastMessage = function getToastMessage(action) {
      return {
        serverError: {
          title: 'Desculpe, estamos com dificuldades para ' + action + ' esse item',
          message: 'Tente novamente mais tarde, obrigado.'
        }
      };
    };

    var postExecute = function postExecute(callback) {
      $timeout(function () {
        $scope.submitStatus.success = false;
        $scope.submitStatus.error = false;
        $scope.loading = false;

        if (callback) {
          callback();
        }
      }, 500);
    };

    if ($scope.item.added) {
      $timeout(function () {
        delete $scope.item.added;
      }, 1000);
    }

    $scope.isOverdue = function () {
      return itemClass.overdue;
    };

    var itemClass = {
      overdue: $scope.overdue === 'true',
      due: $scope.due === 'true'
    };

    $scope.getItemClass = function () {
      return itemClass;
    };

    $scope.avatarItem = {};

    var setAvatarItem = function setAvatarItem() {
      $scope.avatarItem = angular.merge({}, $scope.interaction.interacaoAtorPartida.usuario, $scope.interaction.interacaoAtorPartida.prospect);
    };

    $scope.hasAvatar = function () {
      return $scope.avatarItem.usuarioUrlImagem || $scope.avatarItem.prospectUrlImagem;
    };

    processItem();
  }).directive('cardFollowupItem', function () {
    return {
      restrict: 'E',
      templateUrl: 'card-followup/item/item.html',
      controller: 'CardFollowupItemController',
      scope: {
        overdue: '@',
        due: '@',
        item: '=item',
        delegate: '=delegate'
      }
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.navigationBarActions', []).factory('navigationBarActionsFactory', function ($modal) {
    var showModal = function showModal() {
      $modal({
        templateUrl: 'navigation-bar/actions/modal.html',
        show: true,
        animation: 'am-fade-and-slide-top',
        controller: function controller($scope) {
          $scope.delegate = {};
        }
      });
    };

    return {
      showModal: showModal
    };
  }).controller('NavigationBarActionsController', function ($rootScope, $scope, path, automateNewLeadFactory, addClientFactory, cardActionFactory) {
    $scope.btnClass = {
      'btn-bigicon-text': $scope.modalDelegate
    };
    var addClientDelegate = {
      reset: function reset() {
        console.log('NavigationBarActionsController.addClientDelegate.reset()');
      },
      itemAddedCurrentUserHasNoAccess: function itemAddedCurrentUserHasNoAccess(item) {
        console.log('NavigationBarActionsController.addClientDelegate.', item);
      },
      itemAddedToCurrentUser: function itemAddedToCurrentUser(item) {
        console.log('NavigationBarActionsController.addClientDelegate.');
        $rootScope.mainController.go(path.get('transaction').withItem(item));
      },
      itemAddedToOtherUser: function itemAddedToOtherUser(item) {
        console.log('NavigationBarActionsController.addClientDelegate.itemAddedToOtherUser()', item);
      }
    };

    var hideModal = function hideModal() {
      if ($scope.modalDelegate) {
        $scope.modalDelegate.hide();
      }
    };

    $scope.showModalAddClient = function () {
      hideModal();
      addClientFactory.showModal({
        delegate: addClientDelegate
      });
    };

    $scope.showCardActionsModal = function (tabButtonActivated) {
      hideModal();
      cardActionFactory.showModal({
        resource: {
          id: null,
          resource: 'transactions'
        },
        tabButtonActivated: tabButtonActivated
      });
    };

    $scope.getNewLead = function () {
      hideModal();
      automateNewLeadFactory.get();
    };

    $scope.getNewLeadButtonClass = function () {
      return {
        'disabled-item': automateNewLeadFactory.isDisabled()
      };
    };

    $scope.isAutomateNewLeadDisabled = function () {
      return automateNewLeadFactory.isDisabled();
    };

    $scope.activeOfferMessage = function () {
      return automateNewLeadFactory.activeOfferMessage();
    };
  }).directive('navigationBarActions', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'navigation-bar/actions/actions.html',
      controller: 'NavigationBarActionsController',
      scope: {
        modalDelegate: '='
      }
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.navigationBarChat', []).controller('NavigationBarChatController', function ($scope, userStatusFactory, notificationCenterTransactionsAwaiting) {
    $scope.isEnabled = function () {
      return userStatusFactory.isEnabled('chat');
    };

    var bulletClass = {};

    $scope.getBulletClass = function () {
      angular.merge(bulletClass, {
        disabled: userStatusFactory.isDisabled('chat'),
        online: userStatusFactory.isOnline('chat'),
        offline: userStatusFactory.isOffline('chat'),
        paused: userStatusFactory.isPaused('chat')
      });
      return bulletClass;
    };

    $scope.getTotalChats = function () {
      return notificationCenterTransactionsAwaiting.getTotalChats() || '';
    };
  }).directive('navigationBarChat', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'navigation-bar/chat/navigation-bar-chat.html',
      controller: 'NavigationBarChatController as navigationBarChatController'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.navigationBarMobileUserStatus', []).controller('NavigationBarMobileUserStatusController', function ($scope, $element, $timeout, path, userStatusFactory, usersService) {
    $scope.userProfile = {};
    $scope.delegate = $scope.delegate || {};
    $scope.classToggle = {
      show: false
    };

    $scope.toggle = function () {
      $scope.classToggle.show = !$scope.classToggle.show;
      runDelegate();
    };

    $element.on('click', function (event) {
      if (!$(event.target).closest('[hide-mobile-menu-on-tap]').length) {
        event.stopPropagation();
      }
    });

    var runDelegate = function runDelegate() {
      if ($scope.classToggle.show && $scope.delegate.show) {
        $scope.delegate.show();
      } else if (!$scope.classToggle.show && $scope.delegate.hide) {
        $scope.delegate.hide();
      }
    };

    var getUserProfile = function getUserProfile(reload) {
      usersService.getUserProfile({
        reload: reload,
        success: function success(response) {
          $scope.userProfile = response.data;
        }
      });
    };

    runDelegate();
    getUserProfile();
  }).directive('navigationBarMobileUserStatus', function () {
    return {
      restrict: 'E',
      scope: {
        delegate: '='
      },
      templateUrl: 'navigation-bar/mobile-user-status/mobile-user-status.html',
      controller: 'NavigationBarMobileUserStatusController as navigationBarMobileUserStatusController'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.navigationBarWhatsnew', []).controller('NavigationBarWhatsnewController', function ($timeout, beamerFactory) {
    $timeout(beamerFactory.init);
  }).directive('navigationBarWhatsnew', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'navigation-bar/whatsnew/whatsnew.html',
      controller: 'NavigationBarWhatsnewController'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.notifications-container.dialog-container', ['directives.notifications-container.dialog']).provider('notificationsContainerDialogContainer', function () {
    var self = this;
    var element;
    var scope;

    self.setElement = function (scopeElement, directiveElement) {
      scope = scopeElement;
      element = directiveElement;
    };

    self.getNewScope = function () {
      return scope.$new();
    };

    self.$get = function ($timeout) {
      self.append = function (dialog) {
        $timeout(function () {
          element.append(dialog.element);
        });
      };

      return self;
    };
  }).controller('NotificationsContainerDialogContainerController', function ($scope) {
    $scope;
  }).directive('notificationsContainerDialogContainer', function (notificationsContainerDialogContainer) {
    return {
      restrict: 'E',
      templateUrl: 'notifications-container/dialog-container/dialog-container.html',
      controller: 'NotificationsContainerDialogContainerController',
      scope: {},
      compile: function compile() {
        return {
          pre: function pre(scope, element) {
            notificationsContainerDialogContainer.setElement(scope, element);
          }
        };
      }
    };
  });
})();

'use strict';

(function () {
  angular.module('views.queues-handler-position').controller('QueuesHandlerPositionInputController', function ($scope, $timeout, $element, permission, queuesService) {
    var currentPosition;
    $scope.loading = false;
    $scope.submitStatus = {
      success: false,
      error: false
    };

    var postExecute = function postExecute() {
      $timeout(function () {
        $scope.submitStatus.success = false;
        $scope.submitStatus.error = false;
        $scope.loading = false;
      }, 500);
    };

    $scope.reset = function () {
      $scope.edit = false;
      $scope.model = {};
    };

    $scope.setEdit = function () {
      if ($scope.hasHandlerPositionPermission() !== true) {
        return;
      }

      $scope.$parent.$parent.$broadcast('QueuesHandlerPositionEditing', $scope.item);
      currentPosition = $scope.item.Ordem;
      $scope.edit = true;
      $scope.fields = [{
        type: 'numberInput',
        key: 'position',
        defaultValue: currentPosition,
        className: 'input-position',
        templateOptions: {
          type: 'tel',
          required: true,
          decimals: 0,
          minValue: 1,
          noErrorSpace: true
        }
      }];
      $timeout(function () {
        $($element).find('input').focus();
      });
    };

    $scope.formOptions = {};
    $scope.model = {};

    $scope.submit = function (form) {
      if (form.$valid) {
        $scope.edit = false;
        $scope.loading = true;
        $scope.item.Ordem = $scope.model.position;

        if ($scope.item.Ordem > $scope.queue.Posicoes.length) {
          $scope.item.Ordem = $scope.queue.Posicoes.length;
        }

        queuesService.actions({
          action: 'position',
          data: {
            fields: {
              queue: {
                campanhaIdGuid: $scope.queue.CampanhaIdGuid,
                canalIdGuid: $scope.queue.CanalIdGuid,
                usuarioIdGuid: $scope.item.UsuarioContaSistemaIdGuid,
                queuePosition: $scope.item.Ordem
              }
            }
          },
          success: function success() {
            $scope.submitStatus.success = true;
            currentPosition = $scope.item.Ordem;
            postExecute();
          },
          error: function error() {
            $scope.submitStatus.error = true;
            $scope.item.Ordem = currentPosition;
            postExecute();
          }
        });
      }
    };

    $scope.hasHandlerPositionPermission = function () {
      if ($scope.channelProperties.permissionHandlerPositionInQueue) {
        return permission.checkPermissions($scope.channelProperties.permissionHandlerPositionInQueue);
      }

      return true;
    };

    var bsTooltip = {
      type: '',
      title: ''
    };

    $scope.getBsTooltip = function () {
      var permisionStatus = $scope.hasHandlerPositionPermission();

      if (permisionStatus === true) {
        angular.merge(bsTooltip, {
          type: 'info',
          title: 'Alterar posição'
        });
      } else if (permisionStatus === false) {
        angular.merge(bsTooltip, {
          type: 'warn',
          title: 'Você não tem permissão para alterar a ordem da fila'
        });
      } else if (permisionStatus === 'disabled') {
        angular.merge(bsTooltip, {
          type: 'error',
          title: 'Alterar ordem da fila foi desligado temporariamente'
        });
      }

      return bsTooltip;
    };

    $scope.$on('QueuesHandlerPositionEditing', function (item) {
      if (item != $scope.item) {
        $scope.reset();
      }
    });
  }).directive('queuesHandlerPositionInput', function () {
    return {
      restrict: 'E',
      templateUrl: 'queues-handler-position/directives/queues-handler-position-input.html',
      controller: 'QueuesHandlerPositionInputController',
      scope: {
        queue: '=',
        item: '=',
        channelProperties: '='
      }
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.card-actions-email-select', []).controller('CardActionsEmailSelect', function ($scope) {
    $scope.delegate = $scope.delegate || {};

    $scope.emailSelect = function (email) {
      if (typeof $scope.delegate.emailSelected == 'function') {
        $scope.delegate.emailSelected(email);
      }
    };
  }).directive('cardActionsEmailSelect', function () {
    return {
      restrict: 'E',
      templateUrl: 'card-actions/directives/email-select/email-select.html',
      controller: 'CardActionsEmailSelect',
      scope: {
        item: '=?',
        delegate: '=?'
      }
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.card-actions-phone-select', []).controller('CardActionsPhoneSelect', function ($scope) {
    $scope.delegate = $scope.delegate || {};

    $scope.phoneSelect = function (phoneNumber) {
      if (typeof $scope.delegate.phoneSelected == 'function') {
        $scope.delegate.phoneSelected(phoneNumber);
      }
    };
  }).directive('cardActionsPhoneSelect', function () {
    return {
      restrict: 'E',
      templateUrl: 'card-actions/directives/phone-select/card-actions-phone-select.html',
      controller: 'CardActionsPhoneSelect',
      scope: {
        item: '=?',
        delegate: '=?'
      }
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.card-actions-select-client', []).controller('CardActionsSelectClient', function ($scope, $element, $timeout, transactionsService, cardActionFactory) {
    $scope.item;
    $scope.model = {
      q: ''
    };
    $scope.empty = false;
    $scope.error = false;
    $scope.loading = false; //Digite o nome do cliente antes de inserir uma atividade.

    var labelTextsByTabName = {
      activity: 'inserir uma ',
      note: 'inserir uma ',
      'call-activity': 'realizar uma ',
      email: 'enviar um ',
      whatsapp: 'enviar um '
    };

    var setLabel = function setLabel() {
      $scope.label = 'Digite o nome do cliente antes de ';

      if ($scope.tabButtonActivated) {
        $scope.label += labelTextsByTabName[$scope.tabButtonActivated];
        $scope.labelTabName = cardActionFactory.modalTitlesByTabName[$scope.tabButtonActivated].toLowerCase();
      } else {
        $scope.label += ' inserir ';
        $scope.labelTabName = cardActionFactory.modalTitlesByTabName['default'].toLowerCase();
      }
    };

    var setInputFocus = function setInputFocus() {
      $timeout(function () {
        $element[0].querySelector('input[type=text]').focus();
      });
    };

    $scope.fields = [{
      type: 'input',
      key: 'q',
      className: 'icon-right',
      templateOptions: {
        placeholder: 'Busca por cliente, email, código, telefone ou #hashtag',
        type: 'text',
        required: true,
        minlength: 3
      },
      templateManipulators: {
        postWrapper: [function (template) {
          var tmp = $('<div></div>').html(template);
          tmp.find('.form-input-extras').append('<button class="btn-lupa" type="submit"><icon-svg name="search"></icon-svg></button>');
          return tmp.html();
        }]
      }
    }];

    $scope.setClientId = function (item) {
      $scope.delegate.setClientId(item);
    };

    $scope.submit = function () {
      if ($scope.form.$valid && !$scope.loading) {
        $scope.empty = false;
        $scope.error = false;
        $scope.loading = true;
        transactionsService.get({
          params: $scope.model,
          success: function success(response) {
            $scope.item = response.data.data;
            $scope.loading = false;
            $scope.empty = !response.data.data || !response.data.data.length;
          },
          error: function error(response) {
            $scope.error = response.config.errorMessage;
          }
        });
      }
    };

    setLabel();
    setInputFocus();
  }).directive('cardActionsSelectClient', function () {
    return {
      restrict: 'E',
      templateUrl: 'card-actions/directives/select-client/card-actions-select-client.html',
      controller: 'CardActionsSelectClient',
      scope: {
        delegate: '=?',
        tabButtonActivated: '='
      }
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.card-followup-chat', []).controller('CardFollowupChat', function ($scope, chatFollowupFactory) {
    $scope.item;
    $scope.clientName = chatFollowupFactory.getName($scope.item);
  }).directive('chatFollowupItem', function () {
    return {
      'restrict': 'E',
      templateUrl: 'card-followup/item/chat/chat.html',
      controller: 'CardFollowupChat',
      scope: {
        item: '='
      }
    };
  }).factory('chatFollowupFactory', function () {
    var getName = function getName(item) {
      var name;
      item.interacaoChatParticipantes.map(function (itemChat) {
        if (itemChat.interacaoChatParticipantePerfil == 'Solicitante') {
          name = itemChat.interacaoChatParticipanteNome;
        }
      });
      return name;
    };

    var generateChatContent = function generateChatContent(attrs) {
      var content = 'Conversa entre os participantes: ';
      attrs.item.interacaoChatParticipantes.map(function (item, index) {
        content += (index ? ', ' : '') + item.interacaoChatParticipanteNome;
      });
      return content;
    };

    return {
      generateChatContent: generateChatContent,
      getName: getName
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.card-followup-email', []).controller('CardFollowupEmail', function ($scope) {
    $scope.getEmailTo = function () {
      return $scope.item.interacaoEmailDestinatario.replace(/,.+@email.anapro.com.br/, '');
    };

    $scope.emailContent = $scope.item.interacaoEmailConteudoTexto.replace(/\s+\r/g, '\n').replace(/\n\s+/g, '\n\n');
  }).directive('emailFollowupItem', function () {
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

'use strict';

(function () {
  angular.module('directives.card-followup-email-modal', []).factory('originalEmailFactory', function ($modal) {
    var show = function show(attrs) {
      attrs = attrs || {};
      var emailModal = $modal({
        templateUrl: 'card-followup/item/email-modal/email-modal.html',
        show: true,
        animation: 'am-fade-and-slide-top',
        controller: function controller($scope) {
          $scope.emailSubject = attrs.item.fields.interacaoEmail.interacaoEmailAssunto || 'Email original';
          $scope.emailProspect = attrs.item.fields.interacaoEmail.interacaoEmailDestinatario;
        },
        onShow: function onShow() {
          var emailBody = emailModal.$element[0].querySelector('modal-body .box-content');

          if (emailBody.attachShadow) {
            emailBody = emailBody.attachShadow({
              mode: 'open'
            });
          }

          angular.element(emailBody).html(attrs.item.fields.interacaoEmail.interacaoEmailConteudoHtml);
        }
      });
    };

    return {
      show: show
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.card-followup-ligacao', []).controller('CardFollowupLigacaoController', function ($scope, ligacaoFollowupFactory) {
    $scope.ligacaoOrigem = {
      status: $scope.item.interacaoLigacaoOrigemStatus,
      className: ligacaoFollowupFactory.pillColorClassName[$scope.item.interacaoLigacaoOrigemStatus] || ''
    };
    $scope.ligacaoDestino = {
      status: $scope.item.interacaoLigacaoDestinoStatus,
      className: ligacaoFollowupFactory.pillColorClassName[$scope.item.interacaoLigacaoDestinoStatus] || ''
    };
  }).directive('ligacaoFollowupItem', function () {
    return {
      restrict: 'E',
      templateUrl: 'card-followup/item/ligacao/ligacao.html',
      controller: 'CardFollowupLigacaoController',
      scope: {
        item: '=item'
      }
    };
  }).factory('ligacaoFollowupFactory', function () {
    var generateLigacaoContent = function generateLigacaoContent(attrs) {
      var telefoneDestino = '(' + attrs.item.interacaoLigacaoDestinoDDD + ') ' + attrs.item.interacaoLigacaoDestinoNumero;
      var telefoneOrigem = '(' + attrs.item.interacaoLigacaoOrigemDDD + ') ' + attrs.item.interacaoLigacaoOrigemNumero;
      var content = 'Ligação realizada a partir do telefone ' + telefoneOrigem + ' para o telefone ' + telefoneDestino + ' com duração de ' + attrs.item.interacaoLigacaoDuracao;
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
  });
})();

'use strict';

(function () {
  angular.module('directives.notifications-container.dialog', ['directives.notifications-container.dialog.provider', 'directives.notifications-container.dialog.new-lead', 'directives.notifications-container.dialog.new-chat']).controller('NotificationsContainerDialogController', function ($scope, audioFactory, desktopNotificationsFactory) {
    var dialogType = $scope.dialog.getType(),
        sound,
        soundResume = true;

    var playSound = function playSound() {
      if (dialogType.sound && soundResume) {
        sound = audioFactory.play(dialogType.sound, playSound);
      }
    };

    playSound();

    $scope.stopSound = function () {
      if (sound) {
        sound.pause();
        sound.src = '';
        sound = null;
      }

      soundResume = false;
    };

    $scope.dialogClick = function () {
      if ($scope.dialog.data.minimized && $scope.open) {
        $scope.open();
      }
    };

    var closeDesktopNotification = function closeDesktopNotification() {
      if ($scope.dialog.data.id) {
        desktopNotificationsFactory.closeById($scope.dialog.data.id);
      }
    };

    $scope.remove = function (event, attrs) {
      closeDesktopNotification();

      if (event) {
        event.stopPropagation();
      }

      $scope.dialog.remove(attrs);
    };

    $scope.onRemove = function () {
      $scope.stopSound();

      if ($scope.onRemoveDialogType) {
        $scope.onRemoveDialogType();
      }
    };
  }).directive('notificationsContainerDialog', function ($compile) {
    var compile = function compile() {
      return {
        pre: function pre(scope, iElement) {
          var type = scope.dialog.getType();
          var dialogTypeElement = $compile('<dialog-' + type.directive + ' layout="row" ' + ' layout-fill ' + ' layout-align="start center" ' + '></' + type.directive + '>')(scope);
          iElement.append(dialogTypeElement);
        },
        post: function post(scope, iElement) {
          iElement.on('$destroy', function () {
            scope.$destroy();
            delete scope.dialog;
          });
          scope.$on('$destroy', function () {
            scope.onRemove();
            scope.$destroy();
            delete scope.dialog;
          });
        }
      };
    };

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'notifications-container/dialog-container/dialog/dialog.html',
      controller: 'NotificationsContainerDialogController',
      scope: {
        dialog: '='
      },
      compile: compile
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.notifications-container.dialog.provider', []).provider('notificationsContainerDialog', function () {
    console.log('notificationsContainerDialog.provider');
    var self = this,
        baseAnimationDuration = 400,
        dialogTypes = {},
        dialogTypesByPriority = [],
        dialogs = [];

    self.getDialogType = function (type) {
      return dialogTypes[type];
    };

    self.putDialogType = function (type, obj) {
      obj.type = type;
      dialogTypes[type] = obj;
      dialogTypesByPriority.push(obj);
      dialogTypesByPriority.sort(function (a, b) {
        return a.priority - b.priority;
      });
      return obj;
    };

    self.getDialogTypesByPriority = function () {
      return dialogTypesByPriority;
    };

    var getType = function getType() {
      var dialog = this;
      return dialogTypes[dialog.data.type];
    };

    var isValidDialog = function isValidDialog(newDialog) {
      if (!newDialog.type || !dialogTypes[newDialog.type]) {
        console.warn('Sorry, this dialog type has been not register yet. type = `', newDialog.type, '`, ', newDialog);
        return false;
      }

      return true;
    };

    var minimizeAllCurrentDialogs = function minimizeAllCurrentDialogs(newDialogObj) {
      if (!newDialogObj.data.minimized) {
        dialogs.map(function (dialog) {
          if (dialog.minimize) {
            dialog.minimize();
          }
        });
      }
    };

    var setMinimizedWhenLessPriority = function setMinimizedWhenLessPriority(newDialogObj) {
      var currentMaxmizedDialog = self.getCurrentMaxmized();

      if (currentMaxmizedDialog && currentMaxmizedDialog.getType().priority < newDialogObj.getType().priority) {
        newDialogObj.data.minimized = true;
      }
    };

    var noop = function noop() {
      return;
    };

    self.$get = function ($timeout, $compile, mainController, notificationsContainerDialogContainer, CacheFactory) {
      var cache = CacheFactory('dialog.provider', {
        storagePrefix: 'AnaproAPP-Caches.',
        storageMode: 'localStorage'
      });

      var setDialogAttrsWhenDeviceMobile = function setDialogAttrsWhenDeviceMobile(attrs) {
        // init dialog always minimized when running on mobile
        if (mainController.getDevice() == 'mobile') {
          angular.merge(attrs, {
            minimized: true
          });
        }
      };

      var getNewDialogObj = function getNewDialogObj(attrs) {
        setDialogAttrsWhenDeviceMobile(attrs);

        if (isMinimizedIdCache(attrs.id) >= 0) {
          attrs.minimized = true;
        }

        return {
          data: attrs,
          remove: remove,
          minimize: minimize,
          getType: getType
        };
      };

      self.getDialogs = function () {
        return dialogs;
      };

      self.getCurrentMaxmized = function () {
        var dialog;
        dialogs.map(function (item) {
          if (item && item.data && !item.data.minimized) {
            dialog = item;
          }
        });
        return dialog;
      };

      self.put = function (attrs) {
        if (!isValidDialog(attrs)) {
          return;
        }

        var newDialogObj = getNewDialogObj(attrs);
        setMinimizedWhenLessPriority(newDialogObj);
        minimizeAllCurrentDialogs(newDialogObj);
        dialogs.push(newDialogObj);
        compile(newDialogObj);
        append(newDialogObj); // setContainerHeight();

        window.dialog = newDialogObj;
        return newDialogObj;
      }; // [todo] animation container height resize
      // var setContainerHeight = function(){
      // 	var height = 0;
      // 	dialogs.map(function(item){
      // 		if(item.data.minimized){
      // 			height += 60;
      // 		}
      // 	});
      // 	containerElement.css({
      // 		height: height + 'px'
      // 	});
      // };


      var compile = function compile(dialog) {
        var scope = notificationsContainerDialogContainer.getNewScope();
        scope.dialog = dialog;
        scope.dialog.element = $compile('<notifications-container-dialog dialog="dialog">' + '</notifications-container-dialog>')(scope);
      };

      var append = function append(dialog) {
        notificationsContainerDialogContainer.append(dialog);
      };

      var isMinimizedIdCache = function isMinimizedIdCache(id) {
        var cacheIds = cache.get('minimizedIds') || [];
        return cacheIds.indexOf(id);
      };

      var addMinimizedCache = function addMinimizedCache(dialog) {
        if (dialog.data && dialog.data.id) {
          var id = dialog.data.id;
          var cacheIds = cache.get('minimizedIds') || [];

          if (isMinimizedIdCache(id) < 0) {
            cacheIds.push(id);
            cache.put('minimizedIds', cacheIds);
          }
        }
      };

      var removeMinimizedCache = function removeMinimizedCache(dialog) {
        if (dialog.data && dialog.data.id) {
          var id = dialog.data.id;
          var cacheIds = cache.get('minimizedIds') || [];
          var index = isMinimizedIdCache(id);

          if (index >= 0) {
            cacheIds.splice(index, 1);
            cache.put('minimizedIds', cacheIds);
          }
        }
      };

      var remove = function remove(attrs) {
        attrs = attrs || {};
        var dialog = this,
            index = dialogs.indexOf(dialog);

        if (attrs.actionOrigin == 'open') {
          removeMinimizedCache(dialog);
        }

        dialog.element.addClass('removing');
        $timeout(function () {
          dialog.element.remove(); // delete scope.dialog;
          // scope.$destroy();

          if (index >= 0) {
            dialogs.splice(index, 1);
          } else {
            console.warn('Sorry, this dialog do not exist!', dialog);
          }

          Object.keys(dialog).map(function (key) {
            delete dialog[key];
          }); // setContainerHeight();
        }, baseAnimationDuration); // replace remove by noop in order to prevent double remove invokes

        dialog.remove = noop;
      };

      var minimize = function minimize() {
        var dialog = this;
        addMinimizedCache(dialog);

        if (!dialog.data.minimized) {
          dialog.element.addClass('minimizing');
          $timeout(function () {
            if (dialog.data) {
              dialog.data.minimized = true;
            }
          }, baseAnimationDuration); // setContainerHeight();
        }
      };

      return self;
    };
  });
})();

'use strict';

(function () {
  angular.module('views.calendar.link-integration-factory', []).factory('linkIntegrationFactory', function ($modal) {
    var showModal = function showModal() {
      $modal({
        templateUrl: 'calendar/directives/link-integration/link-integration-modal.html',
        show: true,
        animation: 'am-fade-and-slide-top',
        controller: function controller($scope) {
          $scope;
        },
        onHide: function onHide() {
          console.log('modalAddClient hide');
        }
      });
    };

    var factory = {
      showModal: showModal
    };
    return factory;
  });
})();

'use strict';

(function () {
  angular.module('views.calendar.link-integration', ['views.calendar.link-integration-factory']).controller('linkIntegrationController', function ($scope, schedulesService) {
    var item;
    $scope.schedulesManual = false;
    $scope.loading = false;

    $scope.integrationManual = function () {
      $scope.schedulesManual = true;
    };

    var buttons = {
      default: {
        icon: 'calendar'
      },
      integrationSchedulesApple: {
        label: 'Apple',
        icon: 'apple'
      },
      integrationSchedulesGoogleOnline: {
        label: 'Google',
        icon: 'google'
      },
      integrationSchedulesManual: {
        label: 'Manualmente',
        icon: 'calendar-download'
      },
      integrationSchedulesOutlook: {
        label: 'Outlook',
        icon: 'outlook'
      },
      integrationSchedulesOutlookOnline: {
        label: 'Outlook',
        small: '(online)',
        icon: 'outlook'
      }
    };

    $scope.getButtons = function (key) {
      return buttons[key] || buttons.default;
    };

    var get = function get() {
      $scope.loading = true;
      schedulesService.get({
        success: success,
        error: error
      });
    };

    $scope.list;
    $scope.listKeys;

    var setList = function setList() {
      $scope.listKeys = Object.keys(item.data[0].fields.integrationSchedules);
      $scope.list = item.data[0].fields.integrationSchedules;
    };

    var success = function success(response) {
      item = response.data;
      setList();
      $scope.loading = false;
    };

    var error = function error(response) {
      $scope.error = response.config.errorMessage;
    };

    get();
  }).directive('linkIntegration', function () {
    return {
      restrict: 'E',
      scope: {},
      controller: 'linkIntegrationController',
      templateUrl: 'calendar/directives/link-integration/link-integration.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('views.calendar.list', ['views.calendar.list-item']).controller('viewCalendarListController', function ($scope, $window, $rootScope, path) {
    $scope.list = [];
    $scope.listFilter = $scope.$parent.$parent.listFilter;
    $scope.listObj = $scope.$parent.listObj;

    var setList = function setList() {
      $scope.list = $scope.listObj.data.data;
    };

    var redirToPathItem = function redirToPathItem(item) {
      $rootScope.mainController.go(path.get('transaction').withItem(item));
    };

    var goToItem = function goToItem(item, event) {
      console.log(item);
      var pathItem = path.get('transaction').withItem(item.parentResources.transactions);

      if (event.ctrlKey || event.which === 2) {
        $window.open(pathItem);
      } else if (event.which === 1) {
        redirToPathItem(item.parentResources.transactions);
      }
    };

    $scope.clickItem = function (item, $event) {
      if ($($event.target).closest('[preventClickItem]').length || $($event.target).closest('.expanded').length || angular.element($event.target).hasClass('dropdown-backdrop')) {
        return;
      }

      $event.preventDefault();
      goToItem(item, $event);
    };

    var patchItem = function patchItem(oldItem, newItem) {
      var index = $scope.list.indexOf(oldItem);
      $scope.list[index].fields = newItem.fields;
    };

    $scope.delegate = {
      patchItem: patchItem,
      calendarListItem: $scope.listObj.delegate.calendarListItem
    };
    setList();
  }).directive('viewCalendarList', function () {
    return {
      restrict: 'E',
      scope: {},
      controller: 'viewCalendarListController',
      templateUrl: 'calendar/directives/list/list.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('views.calendar.list-filter', []).controller('viewCalendarListFilterController', function ($scope, anaproFormlyFactory, linkIntegrationFactory, mainController) {
    $scope.listFilter = $scope.$parent.$parent.listFilter;
    $scope.listObj = $scope.$parent.listObj;
    $scope.fields = [];

    var filterList = function filterList() {
      return $scope.listObj.data.filters.filter(function (item) {
        return !/dateEnd/.test(item.field);
      });
    };

    anaproFormlyFactory.createFormlyFieldsFromAPI(filterList(), $scope.fields, {
      merge: {
        dateStart: {
          className: 'field-month layout-reverse',
          type: 'anaproDate',
          templateOptions: {
            label: 'Escolha o mês',
            dateFormat: 'yyyy-MM-01T00:00:00',
            placeholder: 'mm/aaaa',
            icon: 'calendar',
            type: 'month',
            noErrorSpace: true,
            datePickerOnHide: 'to.onHide',
            onHide: function onHide() {
              setFilters();
            }
          },
          elementAttributes: {
            layout: 'row'
          }
        },
        followupScheduleOpcao: {
          className: 'followup-schedule-opcao',
          type: 'anaproSelectButtons',
          templateOptions: {
            noErrorSpace: true
          },
          data: {
            onChange: function onChange() {
              setFilters();
            }
          }
        },
        followupScheduleStatus: {
          className: 'followup-schedule-status',
          type: 'anaproSelectButtons',
          templateOptions: {
            noErrorSpace: true
          },
          data: {
            onChange: function onChange() {
              setFilters();
            }
          }
        }
      }
    });

    var setFilters = function setFilters() {
      if (mainController.getDevice() == 'desktop') {
        $scope.setFilters();
      }
    };

    $scope.setFilters = function () {
      if ($scope.listFilter.model.filters.dateStart) {
        $scope.listFilter.model.filters.dateEnd = moment($scope.listFilter.model.filters.dateStart).add(1, 'month').subtract(1, 'day').format('YYYY-MM-DDT23:59:59');
      }

      $scope.listFilter.setFilters();
    };

    $scope.resetFilters = function () {
      $scope.listFilter.model.filters = {};
      $scope.listFilter.setFilters();
    };

    $scope.addNewAppointment = function () {
      $scope.listObj.delegate.calendarListFilter.newAction();
    };

    $scope.showModalLinkIntegration = function () {
      linkIntegrationFactory.showModal();
    };
  }).directive('viewCalendarListFilter', function () {
    return {
      restrict: 'E',
      scope: {},
      controller: 'viewCalendarListFilterController',
      templateUrl: 'calendar/directives/list-filter/list-filter.html'
    };
  }).directive('calendarListFilterForm', function () {
    return {
      restrict: 'E',
      templateUrl: 'calendar/directives/list-filter/list-filter-form.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('views.calendar.list-item', []).controller('ViewCalendarListItemController', function ($scope, $element, $popover, $timeout, $rootScope, $modal, $sce, followupService, usersService) {
    $scope.hasAlarm;
    $scope.hasTaskToBeDone;
    $scope.loading = false;
    $scope.showItemUser = false;
    $scope.descriptionItem;

    var showModalReschedule = function showModalReschedule() {
      var cardActionsNoteDelegate = $scope.cardActionsNoteDelegate;
      var item = $scope.item;
      $modal({
        templateUrl: 'calendar/directives/list-item/list-item-note-modal.html',
        show: true,
        animation: 'am-fade-and-slide-top',
        controller: function controller($scope) {
          $scope.cardActionsNoteDelegate = cardActionsNoteDelegate;
          $scope.item = item;
          $scope.modalDelegate = {
            hide: function hide() {
              $scope.cardActionsNoteDelegate.hide();
            }
          };
        },
        onHide: function onHide() {
          console.log('modalAddClient hide');
        }
      });
    };

    $scope.addNewAppointment = function () {
      if ($scope.delegate.calendarListItem.newAction) {
        $scope.delegate.calendarListItem.newAction({
          resource: $scope.clientContactsResource
        });
      }
    };

    $scope.cardActionsNoteDelegate = {
      reschedule: function reschedule(item) {
        var oldItem = $scope.item;
        $scope.delegate.patchItem(oldItem, item);
        processItem();
        $scope.modalDelegate.hide();
        console.log('itemreschedule', $scope.item);
      }
    };
    $scope.canExpandDescription = false;
    $scope.expandedDescription = false;

    $scope.expandDescription = function (event) {
      if ($scope.expandedDescription && $(event.target).closest('.description-task').length) {
        event.stopPropagation();
      }

      $scope.expandedDescription = !$scope.expandedDescription;
      setDescription();
    };

    var setDescription = function setDescription() {
      var desc = $scope.interaction.interacaoTexto || '';

      if (desc.length > 100 && !$scope.expandedDescription) {
        $scope.canExpandDescription = true;
        desc = desc.substring(0, 100) + '...';
      }

      $scope.descriptionItem = $sce.trustAsHtml(desc.replace(/\n/g, '<br />'));
    };

    $scope.submitStatus = {
      success: false,
      error: false
    };

    var getToastMessage = function getToastMessage(action) {
      return {
        serverError: {
          title: 'Desculpe, estamos com dificuldades para ' + action + ' esse item',
          message: 'Tente novamente mais tarde, obrigado.'
        }
      };
    };

    var postExecute = function postExecute(callback) {
      $timeout(function () {
        $scope.submitStatus.success = false;
        $scope.submitStatus.error = false;
        $scope.loading = false;

        if (callback) {
          callback();
        }
      }, 500);
    };

    $scope.done = function () {
      $scope.loading = true;
      followupService.actions({
        item: $scope.item,
        action: 'taskDone',
        data: {
          fields: {
            tarefa: {
              tarefaRealizado: true
            }
          }
        },
        toastrMessage: getToastMessage('atualizar'),
        success: function success(response) {
          $scope.submitStatus.success = true; // $scope.overdue = false;

          postExecute();
          $scope.cardActionsNoteDelegate.reschedule(response.data);
        },
        error: function error() {
          $scope.submitStatus.error = true;
          postExecute();
        }
      });
    };

    $scope.modalDelegate = {
      hide: function hide() {
        if (reschedulePopover) {
          reschedulePopover.hide();
        }
      }
    };

    var setItem = function setItem() {
      $scope.interaction = followupService.getInteraction($scope.item);
    };

    $scope.getType = function () {
      var type = followupService.getType($scope.item);

      if (/interacaoNota|interacaoAtividade/.test(type) && $scope.interaction.interacaoTipoSub) {
        return true;
      }

      return false;
    };

    var setActionsButtons = function setActionsButtons() {
      if ($scope.interaction.interacaoRealizado) {
        $scope.hasTask = false;
        $scope.hasTaskToBeDone = false;
        $scope.hasAlarm = false;
      } else {
        $scope.hasTask = !!$scope.interaction.tarefa;
        $scope.hasTaskToBeDone = $scope.hasTask && !$scope.interaction.interacaoRealizado;
        $scope.hasAlarm = !$scope.interaction.interacaoRealizado && $scope.hasTask && !!$scope.interaction.tarefa.alarme;
      }
    };

    var processItem = function processItem() {
      setItem();
      setActionsButtons();
      setDescription();
      setReschedulePopover();
    };

    var reschedulePopover;

    var setReschedulePopover = function setReschedulePopover() {
      if ($scope.hasAlarm && $rootScope.mainController.device == 'desktop') {
        $timeout(function () {
          reschedulePopover = $popover(angular.element($element[0].querySelector('.dropdown-toggle')), {
            scope: $scope,
            title: 'Reagendar',
            //[todo] remove
            contentTemplate: 'calendar/directives/list-item/list-item-note-popover.html',
            trigger: 'manual',
            autoClose: true,
            animation: 'am-flip-x',
            placement: 'bottom-left'
          });
        });
      }
    };

    $scope.reschedule = function () {
      if ($rootScope.mainController.device == 'desktop') {
        reschedulePopover.show();
      } else {
        showModalReschedule();
      }
    };

    $scope.clientContactsResource = {
      id: $scope.item.parentResources.transactions.id,
      resource: 'transactions'
    };

    var setUser = function setUser() {
      usersService.getUserProfile({
        success: function success(response) {
          if (response.data.id != $scope.interaction.interacaoAtorPartida.usuario.usuarioIdGuid) {
            $scope.showItemUser = true;
          }
        }
      });
    };

    processItem();
    setUser();
  }).directive('calendarListItem', function () {
    return {
      restrict: 'E',
      scope: {
        item: '=',
        delegate: '=delegate'
      },
      controller: 'ViewCalendarListItemController',
      templateUrl: 'calendar/directives/list-item/list-item.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('views.transaction') // .controller(
  // 	'viewTransactionAgentController',
  // 	function(){
  // 		// var getFirstAndLastName = function(){
  // 		// 	var tempName = $scope.item.extraInfo.usuarioNome.match(/^\w+|\w+$/g, '');
  // 		// 	var name = tempName[0];
  // 		// 	var lastName = tempName[1] || '';
  // 		// 	$scope.agentName = name + ' ' + lastName;
  // 		// };
  // 		// getFirstAndLastName();
  // 	}
  // )
  .directive('viewTransactionAgent', function () {
    return {
      restrict: 'E',
      scope: {
        item: '='
      },
      transclude: true,
      // controller: 'viewTransactionAgentController',
      templateUrl: 'transaction/directives/agent/agent.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('views.transaction').controller('viewTransactionAmountsController', function ($rootScope, $scope, $element, $timeout, $popover, $tooltip, transactionsService) {
    $scope.mainController = $rootScope.mainController;

    $scope.isFinished = function () {
      return transactionsService.isFinished($scope.transactionItem);
    };

    var amountPopover;
    $timeout(function () {
      amountPopover = $popover(angular.element($element[0]), {
        scope: $scope,
        title: 'Alterar valor e comissão',
        contentTemplate: 'transaction/directives/edit-amounts/popover-content.html',
        trigger: 'manual',
        autoClose: true,
        animation: 'am-flip-x',
        placement: 'bottom'
      });
    });

    $scope.setAmount = function () {
      if ($scope.canEditWhenNotActive() && $rootScope.mainController.device == 'desktop') {
        amountPopover.show();
      }
    };

    $scope.canEditWhenNotActive = function () {
      return transactionsService.canEditWhenNotActive($scope.transactionItem);
    };

    if (!$scope.canEditWhenNotActive()) {
      $timeout(function () {
        $tooltip($element, {
          title: 'Você não pode editar o valor de negócio<br />do cliente que não esta em atendimento',
          type: 'warn',
          trigger: 'click'
        });
      });
    }
  }).directive('viewTransactionAmounts', function () {
    return {
      restrict: 'E',
      scope: {
        transactionItem: '='
      },
      controller: 'viewTransactionAmountsController',
      templateUrl: 'transaction/directives/amounts/amounts.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('views.transaction').controller('viewTransactionClientController', function ($scope, transactionsService) {
    console.log('client controller');
    $scope.clientPath = '/client-path/' + $scope.transactionItem.id;

    $scope.editData = function (content) {
      if (!content) {
        $('#external-info').collapse('hide');
        $('#bloco-clientes-informacoespessoais').collapse('show');
        $('#bloco-clientes-contato').collapse('show');
      } else {
        $('.client-tab-button').removeClass('active');
        var tabButton = $('.client-tab-button.' + content);
        tabButton.addClass('active');
        tabButton.tab('show');
        window.scrollTo(0, $('card-client-profile[blocks=' + content + ']').offset().top - $('navigation-bar .navbar').outerHeight() - 20);
      }
    };

    $scope.canEditWhenNotActive = function () {
      return transactionsService.canEditWhenNotActive($scope.transactionItem);
    };

    $scope.clientContactsResource = {
      id: $scope.transactionItem.id,
      resource: 'transactions'
    };
  }).directive('viewTransactionClient', function () {
    return {
      restrict: 'E',
      scope: {
        transactionItem: '=',
        delegate: '='
      },
      controller: 'viewTransactionClientController',
      templateUrl: 'transaction/directives/client/client.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('views.transaction').controller('viewTransactionDetailsController', function ($scope, $modal, $timeout, productsService, transactionsService, utilsStatesService) {
    $scope.loading = true;
    $scope.submitStatus = {
      success: false,
      error: false
    };
    $scope.item;
    $scope.total = 0;
    var data;

    var productsServiceGetSuccess = function productsServiceGetSuccess(response) {
      response.data.data = response.data.data || [];
      data = response.data.data;
      setProduct();
      $scope.total = data.length;
      $scope.loading = false;
    };

    var setProduct = function setProduct() {
      $scope.item = {
        fields: {
          produto: {
            produtoNome: 'Sem produto de interesse',
            produtoValorMedio: 0,
            produtoComissaoMedio: 0
          }
        }
      };
      data.map(function (item) {
        if (item.id == $scope.transactionItem.fields.atendimento.atendimentoProdutoIdGuid) {
          $scope.item = item;
        }
      });
    };

    var patchProductSuccess = function patchProductSuccess(response) {
      $scope.submitStatus.success = true;
      transactionsService.updateItem($scope.transactionItem, response.data);
      setProduct();
      postExecute();
    };

    $scope.getStateName = function (state) {
      return utilsStatesService[state];
    };

    $scope.getComissao = function (item) {
      return item.fields.produto.produtoValorMedio / 100 * item.fields.produto.produtoComissaoMedio;
    };

    $scope.canEditWhenNotActive = function () {
      return transactionsService.canEditWhenNotActive($scope.transactionItem);
    };

    var postExecute = function postExecute() {
      $timeout(function () {
        $scope.submitStatus.success = false;
        $scope.submitStatus.error = false;
        $scope.loading = false;
      }, 500);
    };

    var _patchProduct = function patchProduct(item) {
      $scope.submitStatus.success = false;
      $scope.submitStatus.error = false;
      $scope.loading = true;
      transactionsService.patchItem({
        item: $scope.transactionItem,
        data: {
          fields: {
            atendimento: {
              atendimentoProdutoIdGuid: item.id
            }
          }
        },
        success: patchProductSuccess,
        error: function error() {
          $scope.submitStatus.error = true;
          postExecute();
        }
      });
    };

    var modalDelegate = {
      patchProduct: function patchProduct(item) {
        _patchProduct(item);

        modalDelegate.hide();
      }
    };

    $scope.showProducts = function () {
      var item = $scope.item;

      var getStateName = function getStateName(state) {
        return utilsStatesService[state];
      };

      var getComissao = function getComissao(item) {
        return item.fields.produto.produtoValorMedio / 100 * item.fields.produto.produtoComissaoMedio;
      };

      $modal({
        templateUrl: 'transaction/directives/details/details-modal.html',
        show: true,
        animation: 'am-fade-and-slide-top',
        controller: function controller($scope) {
          $scope.data = data;
          $scope.patchProduct = modalDelegate.patchProduct;
          $scope.delegate = modalDelegate;
          $scope.getStateName = getStateName;
          $scope.getComissao = getComissao;
          $scope.showFilter = data.length > 20;
          $scope.model = {};

          $scope.getClassButton = function (itemProduct) {
            return itemProduct == item ? 'selected' : '';
          };

          $scope.getData = function () {
            var regExp = new RegExp(($scope.model.filter || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/([*()\u005B\u005D{}.?^$])/g, '\\$1'), 'i');

            if ($scope.showFilter && $scope.model.filter) {
              return data.filter(function (item) {
                return regExp.test(item.fields.produto.produtoNome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
              });
            } else {
              return data;
            }
          };
        }
      });
    };

    productsService.get({
      item: $scope.transactionItem,
      success: productsServiceGetSuccess
    });
  }).directive('viewTransactionDetails', function () {
    return {
      restrict: 'E',
      scope: {
        transactionItem: '='
      },
      controller: 'viewTransactionDetailsController',
      templateUrl: 'transaction/directives/details/details.html'
    };
  }).directive('viewTransactionDetailsProduct', function () {
    return {
      restrict: 'E',
      templateUrl: 'transaction/directives/details/details-product.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('views.transaction').controller('viewTransactionEditAmountsController', function ($scope, $timeout, transactionsService, anaproFormlyFactory, permission) {
    $scope.getHide = function () {
      return $scope.$parent.$hide || $scope.modalDelegate.hide || null;
    };

    $scope.loading = false;
    $scope.submitStatus = {
      success: false,
      error: false
    };
    $scope.form = {};
    $scope.formOptions = {};
    var readOnlyValue = !permission.permissionStatus('resfim_editar_atd_valor');
    var readOnlyCommission = !permission.permissionStatus('resfim_editar_atd_comissao');
    $scope.model = {
      fields: {
        atendimento: {}
      }
    };

    var resetModel = function resetModel() {
      $scope.formOptions.resetModel();
    };

    $scope.fields = [];

    if (permission.permissionStatus('resfim_mostrar_atd_valor') === true) {
      $scope.fields.push({
        type: 'numberInput',
        key: 'atendimentoNegocioValor',
        defaultValue: $scope.transactionItem.fields.atendimento.atendimentoNegocioValor,
        model: readOnlyValue ? {} : $scope.model.fields.atendimento,
        ngModelElAttrs: readOnlyValue ? {
          disabled: 'true'
        } : {},
        templateOptions: {
          type: 'tel',
          label: 'Valor:',
          icon: 'currency',
          required: true,
          money: 2,
          minValue: 1,
          hint: readOnlyValue ? 'Você não tem permissão para alterar o valor.' : 'Valor aproximado do imóvel que está sendo negociado.'
        },
        ngModelAttrs: {
          off: {
            value: 'autocomplete'
          }
        },
        elementAttributes: {
          layout: 'row'
        }
      });
    }

    if (permission.permissionStatus('resfim_mostrar_atd_comissao') === true) {
      $scope.fields.push({
        type: 'numberInput',
        key: 'atendimentoNegocioComissao',
        defaultValue: $scope.transactionItem.fields.atendimento.atendimentoNegocioComissao,
        model: readOnlyCommission ? {} : $scope.model.fields.atendimento,
        className: 'input-nogrow atendimentoNegocioComissao align-right',
        ngModelElAttrs: readOnlyCommission ? {
          disabled: 'true'
        } : {},
        templateOptions: {
          type: 'tel',
          icon: 'percentage',
          label: 'Comissão:',
          required: true,
          decimals: 2,
          minValue: 0.01,
          maxValue: 99.99,
          hint: readOnlyCommission ? 'Você não tem permissão para alterar a comissão.' : 'Percentual aproximado da comissão na venda do imóvel negociado.'
        },
        ngModelAttrs: {
          off: {
            value: 'autocomplete'
          }
        },
        elementAttributes: {
          layout: 'row'
        }
      });
    }

    var updateTransactionItem = function updateTransactionItem(data) {
      $scope.transactionItem.fields.atendimento.atendimentoNegocioValor = data.fields.atendimento.atendimentoNegocioValor;
      $scope.transactionItem.fields.atendimento.atendimentoNegocioComissao = data.fields.atendimento.atendimentoNegocioComissao;
      $scope.transactionItem.extraInfo.atendimentoNegocioComissaoValor = data.extraInfo.atendimentoNegocioComissaoValor;
    };

    var postExecute = function postExecute(callback) {
      $timeout(function () {
        $scope.submitStatus.success = false;
        $scope.submitStatus.error = false;
        $scope.loading = false;
      }, 500);

      if (callback) {
        $timeout(function () {
          callback();
        }, 700);
      }
    };

    $scope.submit = function (callback) {
      if ($scope.form.$valid && !$scope.loading) {
        $scope.loading = true;
        transactionsService.actions({
          item: $scope.transactionItem,
          action: 'amounts',
          data: $scope.model,
          toastrMessages: {
            serverError: {
              title: 'Desculpe, estamos com dificuldades para atualizar o valor e comissão do negócio.',
              message: 'Tente novamente mais tarde, obrigado.'
            }
          },
          success: function success(response) {
            $scope.submitStatus.success = true;
            updateTransactionItem(response.data);
            postExecute(callback);
          },
          error: function error() {
            $scope.submitStatus.error = true;
            postExecute(callback);
          }
        });
      }
    };

    $scope.cancel = function (callback) {
      resetModel();

      if (callback) {
        callback();
      }
    };
  }).directive('viewTransactionEditAmounts', function () {
    return {
      restrict: 'E',
      scope: {
        transactionItem: '=',
        modalDelegate: '='
      },
      controller: 'viewTransactionEditAmountsController',
      templateUrl: 'transaction/directives/edit-amounts/edit-amounts.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('views.transaction').controller('viewTransactionFollowersController', function ($scope, $modal, usersService, transactionsService) {
    angular.merge($scope.transactionItem.extraInfo, {
      usuarioSeguidores: []
    });
    var currentUser;
    var followersList = $scope.transactionItem.extraInfo.usuarioSeguidores;
    usersService.getUserProfile({
      success: function success(response) {
        currentUser = response.data;
      }
    });
    $scope.summary = {};
    $scope.btnLikeClassName = {
      active: false
    };

    $scope.canEditWhenNotActive = function () {
      return transactionsService.canEditWhenNotActive($scope.transactionItem);
    };

    var setSummary = function setSummary() {
      $scope.summary = {
        names: '',
        total: 0
      };
      $scope.btnLikeClassName = {
        active: !!followersList.filter(function (item) {
          return item.usuarioIdGuid == currentUser.id;
        }).length
      };
      var limit = 2;
      var count = followersList.length;

      if (count) {
        var names = '';

        for (var i = 0; i < followersList.length; i++) {
          var item = followersList[i];
          names += names ? ' e ' : '';
          names += item.usuarioApelido || item.usuarioNome;

          if (i == limit - 1) {
            break;
          }
        }

        $scope.summary.names = names;
        $scope.summary.total = count;
      }
    };

    var followersListDelegate = {
      updateTransactionItemFollowers: function updateTransactionItemFollowers(newFollowersList) {
        followersList.splice(0);
        angular.extend(followersList, newFollowersList);
        setSummary();
      }
    };

    var success = function success(response) {
      followersList.splice(0);
      angular.extend(followersList, response.data.extraInfo.usuarioSeguidores);
      setSummary();
    };

    var error = function error() {
      toggleLike();
      setFollowersList();
      setSummary();
    };

    var toggleLike = function toggleLike() {
      $scope.btnLikeClassName.active = !$scope.btnLikeClassName.active;
    };

    var setFollowersList = function setFollowersList() {
      if ($scope.btnLikeClassName.active) {
        followersList.push({
          usuarioIdGuid: currentUser.id,
          usuarioNome: currentUser.fields.usuario.usuarioNome,
          usuarioApelido: currentUser.fields.usuario.usuarioApelido
        });
      } else {
        var listRemovedCurrentUser = followersList.filter(function (item) {
          return item.usuarioIdGuid != currentUser.id;
        });
        followersList.splice(0);
        angular.extend(followersList, listRemovedCurrentUser);
      }
    };

    $scope.toggleFollowing = function () {
      toggleLike();
      setFollowersList();
      var list = followersList.map(function (item) {
        return item.usuarioIdGuid;
      });
      transactionsService.actions({
        action: 'followers',
        method: 'POST',
        item: $scope.transactionItem,
        data: {
          fields: {
            usuarioSeguidoresIdGuids: list
          }
        },
        success: success,
        error: error
      });
    };

    $scope.showListModal = function () {
      if (!$scope.canEditWhenNotActive() && !$scope.summary.total) {
        return;
      }

      var transactionItem = $scope.transactionItem;
      $modal({
        templateUrl: 'transaction/directives/followers/modal.html',
        show: true,
        animation: 'am-fade-and-slide-top',
        controller: function controller($scope) {
          $scope.delegate = followersListDelegate;
          $scope.transactionItem = transactionItem;
        }
      });
    };

    setSummary();
  }).directive('viewTransactionFollowers', function () {
    return {
      restrict: 'E',
      scope: {
        transactionItem: '='
      },
      controller: 'viewTransactionFollowersController',
      templateUrl: 'transaction/directives/followers/followers.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('views.transaction').controller('viewTransactionFollowersListController', function ($scope, transactionsService) {
    var followersObject;
    var listFollowers = [];
    var followersObjectList;
    var initEmptyFollowers = true;
    $scope.delegate = $scope.delegate || {};
    $scope.empty = false;
    $scope.loading = true;
    $scope.model = {};
    $scope.fields = [{
      type: 'input',
      key: 'filter',
      model: $scope.model,
      modelOptions: {
        debounce: {
          default: 200
        }
      },
      templateOptions: {
        placeholder: 'Busque pelo nome ou apelido',
        hint: 'Se o usuário não estiver na lista, é porque ele não pertence à campanha e canal deste atendimento.',
        minlength: 2,
        noErrorSpace: true
      }
    }];

    var setFollowersObject = function setFollowersObject(filters) {
      filters.map(function (item) {
        if (item.field == 'usuarioSeguidoresIdGuids') {
          followersObject = item;
        }
      });
      followersObjectList = followersObject.defaultValue || [];
    };

    var setListFollowers = function setListFollowers() {
      if (!followersObject.options || !followersObject.options.length) {
        $scope.empty = true;
        return;
      }

      listFollowers = followersObject.options.filter(function (followersObjectItem) {
        return followersObjectList.indexOf(followersObjectItem.value) >= 0;
      });
      initEmptyFollowers = !listFollowers.length;
    };

    var getFollowersSuccess = function getFollowersSuccess(response) {
      setFollowersObject(response.data.filters);
      setListFollowers();
      $scope.loading = false;
    };

    var getFollowersError = function getFollowersError() {
      if ($scope.delegate.hide) {
        $scope.delegate.hide();
      }
    };

    $scope.getLimitTo = function () {
      return listFollowers.length ? null : 100;
    };

    $scope.isFollowing = function (item) {
      return listFollowers.indexOf(item) >= 0;
    };

    $scope.getList = function () {
      if (!followersObject) {
        return [];
      }

      var regExp = new RegExp(($scope.model.filter || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/([*()\u005B\u005D{}.?^$])/g, '\\$1'), 'i');

      if ($scope.model.filter) {
        return followersObject.options.filter(function (item) {
          return regExp.test((item.name + ' ' + (item.properties.usuarioEmail || '') + ' ' + (item.properties.usuarioApelido || '')).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
        });
      }

      if (listFollowers.length && !initEmptyFollowers) {
        return listFollowers;
      }

      return followersObject.options;
    };

    $scope.add = function (item) {
      listFollowers.push(item);
      postAction();
    };

    $scope.remove = function (item) {
      listFollowers.splice(listFollowers.indexOf(item), 1);
      postAction();
    };

    $scope.canEditWhenNotActive = function () {
      return transactionsService.canEditWhenNotActive($scope.transactionItem);
    };

    var runDelegates = function runDelegates(transactionItemFollowers) {
      if ($scope.delegate.updateTransactionItemFollowers) {
        $scope.delegate.updateTransactionItemFollowers(transactionItemFollowers);
      }
    };

    var postActionSuccess = function postActionSuccess(response) {
      runDelegates(response.data.extraInfo.usuarioSeguidores || []);
    };

    var postActionError = function postActionError() {
      setListFollowers();
    };

    var postAction = function postAction() {
      var ids = listFollowers.map(function (item) {
        return item.value;
      });
      transactionsService.actions({
        action: 'followers',
        method: 'POST',
        item: $scope.transactionItem,
        data: {
          fields: {
            usuarioSeguidoresIdGuids: ids
          }
        },
        success: postActionSuccess,
        error: postActionError
      });
    };

    transactionsService.actions({
      action: 'followers',
      method: 'GET',
      item: $scope.transactionItem,
      success: getFollowersSuccess,
      error: getFollowersError
    });
  }).directive('viewTransactionFollowersList', function () {
    return {
      restrict: 'E',
      scope: {
        transactionItem: '=',
        delegate: '='
      },
      controller: 'viewTransactionFollowersListController',
      templateUrl: 'transaction/directives/followers/list.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('views.transaction').controller('viewTransactionHashtagController', function ($scope, $timeout, $element, clientsService, path) {
    angular.merge($scope.transactionItem.expand.clients.fields, {
      prospectHashTags: []
    });
    var prospectHashTagsOriginal = [];

    var setProspectHashTagsOriginal = function setProspectHashTagsOriginal() {
      prospectHashTagsOriginal = angular.copy($scope.transactionItem.expand.clients.fields.prospectHashTags);
    };

    var resetProspectHashTags = function resetProspectHashTags() {
      var hashtags = $scope.transactionItem.expand.clients.fields.prospectHashTags;
      hashtags.splice(0, hashtags.length);
      angular.extend(hashtags, prospectHashTagsOriginal);
    };

    $scope.model = {};
    $scope.edit = false;
    $scope.loading = false;
    $scope.submitStatus = {
      success: false,
      error: false
    };

    $scope.editHashtag = function () {
      setTextArea();
      $scope.edit = true;
      $timeout(function () {
        $($element).find('textarea').focus();
      });
    };

    var setTextArea = function setTextArea() {
      $scope.model.textArea = $scope.transactionItem.expand.clients.fields.prospectHashTags.join(' #');

      if ($scope.model.textArea) {
        $scope.model.textArea = '#' + $scope.model.textArea;
      }
    };

    var getToastrMessages = function getToastrMessages() {
      return {
        serverError: {
          title: 'Desculpe, estamos com dificuldades para atualizar os dados do cliente.',
          message: 'Tente novamente mais tarde, obrigado.'
        }
      };
    };

    $scope.getPath = function (hashtag) {
      return path.getPath('transactions') + encodeURIComponent('#' + hashtag.toLowerCase());
    };

    $scope.patchHashtag = function (attrs) {
      console.log(attrs);
      attrs = attrs || {};

      if ($scope.edit) {
        attrs.hashtags = $scope.model.textArea ? $scope.model.textArea.replace(/#/g, '').replace(/\s+/g, ' ').split(' ') : [];
      }

      $scope.loading = true;
      clientsService.patchItem({
        item: $scope.transactionItem.expand.clients,
        data: {
          fields: {
            prospectHashTags: attrs.hashtags
          }
        },
        toastrMessages: getToastrMessages(),
        success: success,
        error: function error() {
          if (!$scope.edit) {
            resetProspectHashTags();
          }

          $scope.submitStatus.error = true;
          postExecute();
        }
      });
      return false;
    };

    $scope.removeHashtag = function (index) {
      $scope.transactionItem.expand.clients.fields.prospectHashTags.splice(index, 1);
      $scope.patchHashtag({
        hashtags: $scope.transactionItem.expand.clients.fields.prospectHashTags
      });
      $scope.loading = false;
      $scope.submitStatus.success = false;
      $scope.submitStatus.error = false;
    };

    $scope.cancel = function () {
      setTextArea();
      $scope.edit = false;
    };

    var success = function success(response) {
      var hashtags = $scope.transactionItem.expand.clients.fields.prospectHashTags;
      hashtags.splice(0, hashtags.length);
      angular.extend(hashtags, response.data.fields.prospectHashTags);
      setProspectHashTagsOriginal();
      $scope.submitStatus.success = true;
      $scope.edit = false;
      postExecute();
    };

    var postExecute = function postExecute() {
      $timeout(function () {
        $scope.loading = false;
        $scope.submitStatus.success = false;
        $scope.submitStatus.error = false;
      }, 500);
    };

    setProspectHashTagsOriginal();
  }).directive('hashtag', function () {
    return {
      restrict: 'E',
      scope: {
        transactionItem: '='
      },
      controller: 'viewTransactionHashtagController',
      templateUrl: 'transaction/directives/hashtag/hashtag.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('views.transaction').controller('viewTransactionInfoController', function ($scope) {
    $scope.copy = function () {
      var input = document.createElement('input');
      document.body.appendChild(input);
      input.className = 'input-copy-hidden';
      input.value = $scope.transactionItem.extraInfo.atendimentoFollowUpEmail;
      input.select();
      document.execCommand('copy', false);
      input.remove();
    };
  }).directive('viewTransactionInfo', function () {
    return {
      restrict: 'E',
      scope: {
        transactionItem: '='
      },
      controller: 'viewTransactionInfoController',
      templateUrl: 'transaction/directives/info/info.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('views.transaction').controller('viewTransactionInstructions', function ($scope, transactionsService, usersService) {
    $scope.userWillSoonLooseIt = false;
    $scope.companyName;
    usersService.getUserProfile({
      success: function success(response) {
        $scope.companyName = response.data.extraInfo.contaSistemaNome;
      }
    });

    var setUserWillSoonLooseIt = function setUserWillSoonLooseIt() {
      $scope.userWillSoonLooseIt = !!$scope.transactionItem.extraInfo.atendimentoExpiracaoAutomaticaQtdMinutosConf && $scope.getExpiresTimeInDays($scope.transactionItem) <= 2;
    };

    $scope.getExpiresTimeInDays = function () {
      return transactionsService.getExpiresTimeInDays($scope.transactionItem);
    };

    $scope.getExpiresTimeConfInDays = function () {
      return transactionsService.getExpiresTimeConfInDays($scope.transactionItem);
    };

    $scope.showInstructions = function () {
      return !$scope.transactionItem.extraInfo.alarmeProximoDtAlarme || $scope.transactionItem.extraInfo.alarmeProximoInteracaoQtdMinutosRestantesMax < 0 || $scope.userWillSoonLooseIt;
    };

    setUserWillSoonLooseIt();
  }).directive('viewTransactionInstructions', function () {
    return {
      restrict: 'E',
      scope: {
        transactionItem: '='
      },
      transclude: true,
      controller: 'viewTransactionInstructions',
      templateUrl: 'transaction/directives/instructions/instructions.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('views.transaction').factory('stageFormFactory', function ($compile, permission, toastrFactory) {
    return {
      setTransactionStage: function setTransactionStage(attrs) {
        var scope = attrs.scope.$new();
        var element = $(attrs.element).closest('[stage-form]');
        scope.stageFormScope = attrs;
        angular.element(element).append($compile('<view-transaction-stage-form stage-form-scope="stageFormScope">' + '</view-transaction-stage-form>')(scope));
      },
      checkPermissionsToastr: function checkPermissionsToastr() {
        var permissionSetStage = permission.checkPermissions('atd_expectativa');

        if (permissionSetStage === true) {
          return true;
        }

        if (permissionSetStage === false) {
          toastrFactory.warn({
            message: 'Você não tem permissão para alterar a fase do cliente'
          });
        } else if (permissionSetStage == 'disabled') {
          toastrFactory.error({
            message: 'Desculpe, alterar a fase do cliente está temporariamente desabilitado.'
          });
        }

        return false;
      }
    };
  }).controller('viewTransactionStageFormController', function ($scope, $timeout, $element, transactionsService, anaproFormlyFactory) {
    var stageItem = {};
    var delegate = $scope.stageFormScope.delegate;
    $scope.submitStatus = {
      success: false,
      error: false
    };
    $scope.formFields = {
      fields: [],
      model: {},
      form: {},
      options: {}
    };

    $scope.cancel = function () {
      $scope.$destroy();
      $element.remove();

      if ($scope.formFields.options.resetModel) {
        $scope.formFields.options.resetModel();
      }

      if (delegate.onFormDestroy) {
        delegate.onFormDestroy();
      }
    };

    var showStageFields = function showStageFields(stage) {
      if (delegate.onFormShowUp) {
        delegate.onFormShowUp();
      }

      anaproFormlyFactory.createFormlyFieldsFromAPI(angular.copy(stage.fields.pipelineStage.pipelineStageFields), $scope.formFields.fields);
    };

    var forceDownloadStage = function forceDownloadStage() {
      transactionsService.getPipelines({
        id: $scope.stageFormScope.transactionItem.id,
        stageId: $scope.stageFormScope.stageItem.id,
        success: function success(response) {
          $scope.stageFormScope.stageItem = response.data;
          $scope.stageFormScope.forceDownloadStage = false;
          setTransactionStage();
        }
      });
    };

    var setTransactionStage = function setTransactionStage() {
      stageItem = $scope.stageFormScope.stageItem; // workaround

      if (!stageItem.id) {
        stageItem.id = stageItem.fields.pipelineStage.pipelineStageIdGuid;
      }

      if ($scope.stageFormScope.forceDownloadStage) {
        forceDownloadStage();
      } else if (stageItem.fields.pipelineStage.pipelineStageFields) {
        showStageFields(stageItem);
      } else {
        postActionPipelineStage();
      }
    };

    $scope.submit = function () {
      if ($scope.formFields.form.$valid && !$scope.loading) {
        postActionPipelineStage();
      }
    };

    var postActionPipelineStage = function postActionPipelineStage() {
      if (delegate.onInitSetStage) {
        delegate.onInitSetStage();
      }

      $scope.loading = true;
      var data = {
        fields: {
          pipelineStage: {
            pipelineStageIdGuid: stageItem.id,
            pipelineStageFields: $scope.formFields.model
          }
        }
      };
      transactionsService.actions({
        item: $scope.stageFormScope.transactionItem,
        action: 'pipelineStage',
        data: data,
        toastrMessages: {
          success: {
            title: 'Fase alterada com sucesso.'
          },
          serverError: {
            title: 'Desculpe, estamos com dificuldades para atualizar a fase do negócio.',
            message: 'Tente novamente mais tarde, obrigado.'
          }
        },
        success: function success(response) {
          if (delegate.success) {
            delegate.success(response);
          }

          $scope.cancel();
        },
        error: function error(response) {
          if (delegate.error) {
            delegate.error(response);
          }

          $scope.cancel();
        }
      });
    };

    setTransactionStage();
  }).directive('viewTransactionStageForm', function () {
    return {
      restrict: 'E',
      scope: {
        stageFormScope: '='
      },
      controller: 'viewTransactionStageFormController',
      templateUrl: 'transaction/directives/stage/stage-form.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('views.transaction').controller('viewTransactionStageController', function ($rootScope, $scope, $timeout, transactionsService, stageFormFactory, momentFactory, permission) {
    $scope.stages = [];
    var stageField = 'atendimentoPipelineStageIdGuid';
    var fields = $scope.transactionItem.fields.atendimento;
    $scope.loading = false;
    $scope.hideOverlay = false;
    $scope.hasPermissionToBackwardsPipeline = permission.checkPermissions('atd_voltar_fase');
    $scope.submitStatus = {
      success: false,
      error: false
    };

    var setStagesDone = function setStagesDone(reset) {
      if (reset) {
        $scope.stages.map(function (stage) {
          stage.done = false;
        });
      }

      for (var i = 0; i < $scope.stages.length; i++) {
        var stage = $scope.stages[i];
        stage.done = true;

        if (stage.id === fields[stageField]) {
          break;
        }
      }
    };

    var postExecute = function postExecute() {
      $timeout(function () {
        setStagesDone(true);
        $scope.submitStatus.success = false;
        $scope.submitStatus.error = false;
        $scope.loading = false;

        if ($scope.modalSetStageDelegate.hide) {
          $scope.modalSetStageDelegate.hide();
        }
      }, 500);
    };

    var updatePipelines = function updatePipelines(data) {
      if (data.embed && data.embed.pipelines) {
        getPipelinesSuccess({
          data: data.embed.pipelines
        });
      }
    };

    var setTransactionItem = function setTransactionItem(item) {
      angular.extend($scope.transactionItem, item);
      fields = $scope.transactionItem.fields.atendimento;
    };

    var callDelegate = function callDelegate(response) {
      if ($scope.delegate) {
        $scope.delegate(response);
      }
    };

    $scope.modal = {};

    $scope.setModal = function (group, index) {
      $scope.modal = {
        group: group,
        index: index
      };
    };

    $scope.modalSetStageDelegate = {};
    var stageFormDelegate = {
      onFormShowUp: function onFormShowUp() {
        $scope.hideOverlay = true;
      },
      onFormDestroy: function onFormDestroy() {
        $scope.hideOverlay = false;
      },
      onInitSetStage: function onInitSetStage() {
        $scope.loading = true;
      },
      success: function success(response) {
        $scope.submitStatus.success = true;
        setTransactionItem(response.data);
        updatePipelines(response.data);
        postExecute();
        callDelegate(response);
      },
      error: function error() {
        $scope.submitStatus.error = true;
        postExecute();
      }
    };
    $scope.durationsByGroup = {};

    var setDurations = function setDurations() {
      var durations = {};
      $scope.stages.map(function (item) {
        var group = item.fields.pipelineStage.pipelineStageGrupo;
        durations[group] = durations[group] || {
          total: 0
        };
        durations[group].total += item.fields.pipelineStage.pipelineStagePermanencia || 0;
      });
      Object.keys(durations).map(function (group) {
        durations[group].moment = momentFactory.getDuration(durations[group].total > 0 && durations[group].total < 60 ? 60 : durations[group].total, 'seconds');
      });
      $scope.durationsByGroup = durations;
    };

    var getPipelinesSuccess = function getPipelinesSuccess(response) {
      // response.data.data.map(function(item){
      // 	var stage = item.fields.pipelineStage;
      // 	$scope.stages.push({
      // 		index: stage.pipelineStageOrdem + 1,
      // 		id: stage.pipelineStageIdGuid,
      // 		name: stage.pipelineStageNome,
      // 		group: stage.pipelineStageGrupo,
      // 		fields: stage.pipelineStageFields
      // 	});
      // 	initSwiper();
      // });
      initSwiper();
      $scope.stages = response.data.data;
      setDurations();
      setStagesDone();
    };

    $scope.getCurrentPipelineStage = function () {
      return $scope.transactionItem.extraInfo.pipelineStageNome.replace(/.*?\/\W/, '');
    };

    $scope.setTransactionStage = function (event, item) {
      if (!stageFormFactory.checkPermissionsToastr()) {
        return;
      } else if ($scope.hasPermissionToBackwardsPipeline || !item.fields.pipelineStage.pipelineStageFulFilled) {
        stageFormFactory.setTransactionStage({
          element: event.target,
          scope: $scope,
          delegate: stageFormDelegate,
          transactionItem: $scope.transactionItem,
          stageItem: item
        });
      }
    };

    $scope.swiperLoaded = true;

    var initSwiper = function initSwiper() {
      if ($rootScope.mainController.device == 'mobile') {
        $scope.swiperLoaded = false;
        $timeout(function () {
          new Swiper('view-transaction-stage .swiper', {
            pagination: '.swiper-pagination',
            slidesPerView: 1,
            slidesPerGroup: 1,
            paginationClickable: true,
            spaceBetween: 0,
            initialSlide: Object.keys($scope.durationsByGroup).indexOf($scope.transactionItem.extraInfo.pipelineStageGrupo)
          });
          $scope.swiperLoaded = true;
        }, 0);
      }
    };

    transactionsService.getPipelines({
      id: $scope.transactionItem.id,
      success: getPipelinesSuccess
    });
  }).directive('viewTransactionStage', function () {
    return {
      restrict: 'E',
      scope: {
        transactionItem: '=',
        delegate: '='
      },
      controller: 'viewTransactionStageController',
      templateUrl: 'transaction/directives/stage/stage.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('views.transactions').controller('viewTransactionsListController', function ($window, $rootScope, $scope, $timeout, path, stageFormFactory, transactionsService, transactionTransferFactory, transactionFinishFactory, cardActionFactory, permission) {
    $scope.listFilter = $scope.$parent.$parent.listFilter;
    $scope.listObj = $scope.$parent.listObj;
    $scope.isOnQueue = transactionsService.isOnQueue;
    $scope.isFinished = transactionsService.isFinished;
    $scope.expiresProgressThreshold = transactionsService.getExpiresProgressThreshold();

    var redirToPathItem = function redirToPathItem(item) {
      $rootScope.mainController.go(path.get('transaction').withItem(item));
    };

    var goToItem = function goToItem(item, event) {
      var pathItem = path.get('transaction').withItem(item);

      if (event.ctrlKey || event.which === 2) {
        $window.open(pathItem);
      } else if (event.which === 1) {
        redirToPathItem(item);
      }
    };

    $scope.showCardActionsModal = function (item, tabButtonActivated) {
      cardActionFactory.showModal({
        data: cardActionFactory.getNewCardActionsData().update({
          title: item.extraInfo.produtoNome,
          emailFollowup: item.extraInfo.atendimentoFollowUpEmail,
          prospectNome: item.extraInfo.prospectNome,
          phones: item.extraInfo.prospectTelefones,
          emails: item.extraInfo.prospectEmails
        }),
        tabButtonActivated: tabButtonActivated,
        resource: {
          id: item.id,
          resource: 'transactions'
        }
      });
    };

    $scope.transfer = function (item) {
      transactionTransferFactory.show({
        item: item,
        delegate: {
          transferedFromOtherToSameCurrentUser: function transferedFromOtherToSameCurrentUser(transferredItem) {
            redirToPathItem(transferredItem);
          },
          updateItem: function updateItem(transferredItem) {
            transactionsService.updateItem(item, transferredItem);
          },
          removeItemFromUser: function removeItemFromUser() {
            $scope.listObj.removeItem(item);
          }
        }
      });
    };

    $scope.finish = function (action, item) {
      transactionFinishFactory.show({
        item: item,
        action: action,
        delegate: {
          updateItem: function updateItem(finishedItem) {
            transactionsService.updateItem(item, finishedItem);
          }
        }
      });
    };

    $scope.clickItem = function (item, $event) {
      if ($($event.target).closest('[preventClickItem]').length || $($event.target).closest('view-transaction-stage-form').length || angular.element($event.target).hasClass('dropdown-backdrop')) {
        return;
      }

      $($event.target).closest('.card').addClass('active');
      $timeout(function () {
        $event.preventDefault();
        goToItem(item, $event);
      }, 200);
    };

    var setChangeStageElement;

    $scope.setChangeStageElement = function (event) {
      setChangeStageElement = event.target;
    };

    $scope.getContactActionLinks = function (item) {
      return cardActionFactory.getContactLinks({
        prospectNome: item.extraInfo.prospectNome,
        emailClient: item.extraInfo.prospectEmails ? item.extraInfo.prospectEmails[0].prospectEmailValor : null,
        emailFollowup: item.extraInfo.atendimentoFollowUpEmail,
        title: item.extraInfo.produtoNome,
        phoneClient: item.extraInfo.prospectTelefones ? item.extraInfo.prospectTelefones[0].prospectTelefoneFull : null
      });
    };

    $scope.isPipelineOptionDisable = function (option, transactionItem) {
      return !permission.checkPermissions('atd_voltar_fase') && $scope.listObj.stageSelectOptions.indexOf(option) <= $scope.listObj.stageSelectOptions.indexOf(transactionItem.stageItem);
    };

    var _onFormDestroy = function onFormDestroy(transactionItem) {
      transactionItem.stageItem = transactionItem.originalStageItem;
    };

    $scope.changeStage = function (transactionItem) {
      var stageItem = transactionItem.stageItem;

      if (!stageFormFactory.checkPermissionsToastr()) {
        _onFormDestroy(transactionItem);
      } else {
        $timeout(function () {
          stageFormFactory.setTransactionStage({
            element: setChangeStageElement,
            scope: $scope,
            delegate: {
              onFormDestroy: function onFormDestroy() {
                _onFormDestroy(transactionItem);
              },
              success: function success(response) {
                transactionItem.originalStageItem = stageItem;
                transactionsService.updateItem(transactionItem, response.data);
              }
            },
            transactionItem: transactionItem,
            stageItem: transactionItem.stageItem,
            forceDownloadStage: true
          });
        }, 0);
      }
    };

    $scope.getStatusClassName = function (item) {
      return transactionsService.statusesByFieldValue[item.fields.atendimento.atendimentoStatus];
    };

    $scope.getDaysToExpires = function (item) {
      var days = transactionsService.getExpiresTimeInDays(item);
      return days > 99 ? '99+' : days;
    };

    $scope.getExpiresTooltip = function (item) {
      return transactionsService.getExpiresText(item);
    };
  }).directive('viewTransactionsTable', function ($rootScope) {
    if ($rootScope.mainController.device == 'desktop') {
      return {
        restrict: 'E',
        scope: {},
        controller: 'viewTransactionsListController',
        templateUrl: 'transactions/directives/list/table-desktop.html'
      };
    } else {
      return {
        restrict: 'E',
        scope: {},
        controller: 'viewTransactionsListController',
        templateUrl: 'transactions/directives/list/table-mobile.html'
      };
    }
  }).directive('viewTransactionsColumn', function () {
    return {
      restrict: 'E',
      scope: {},
      controller: 'viewTransactionsListController',
      templateUrl: 'transactions/directives/list/column.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('views.transactions').controller('listFilterOptionsController', function ($scope, anaproFormlyFactory) {
    $scope.delegateListFilter = $scope.delegateListFilter || {};
    $scope.listFilter = $scope.$parent.listFilter;
    $scope.listObj = $scope.$parent.listObj;
    $scope.formlyFields = [];
    $scope.formlyFieldsAdvanced = [];
    $scope.listFilter.modelAdvanced = {};
    var advancedFiltersModelRemoved = false;
    var fieldsAdvancedOriginal = [];
    var defaultFilters = ['produtoIdGuid', 'atendimentoPipelineStageIdGuid', 'atendimentoExpiracaoAutomaticaQtdDiasRestantesMax', 'atendimentoInteracaoUsuarioQtdDiasSem'];
    var defaultFiltersRegexp = new RegExp(defaultFilters.join('|'));

    var removeFiltersFromModel = function removeFiltersFromModel(keys) {
      keys.map(function (item) {
        delete $scope.listFilter.model.filters[item];
      });
    };

    $scope.setFilters = function ($event) {
      if ($scope.formFilters.$valid) {
        removeFiltersFromModel(['atendimentoPendencias', 'atendimentoCompromissos']);
        $scope.listFilter.setFilters();
        $().hideParentDropdown($event.target);
      }
    };

    $scope.delegateListFilter.setFilters = $scope.setFilters;

    $scope.resetFilters = function () {
      anaproFormlyFactory.resetModel($scope.formlyFields, $scope.listFilter.model.filters);

      if ($scope.listFilter.advanced) {
        anaproFormlyFactory.resetModel($scope.formlyFieldsAdvanced, $scope.listFilter.model.filters);
      }
    };

    $scope.toggleAdvancedFilters = function () {
      $scope.listFilter.advanced = !$scope.listFilter.advanced;
      toggleAdvancedFilters();
    };

    var toggleAdvancedFilters = function toggleAdvancedFilters() {
      if ($scope.listFilter.advanced) {
        angular.merge($scope.listFilter.model.filters, $scope.listFilter.modelAdvanced);
        $scope.formlyFieldsAdvanced.splice(0);
        createFieldsFromAPI(angular.copy(fieldsAdvancedOriginal), $scope.formlyFieldsAdvanced);
      } else {
        removeAdvancedFiltersFromModel();
      }
    };

    $scope.delegateListFilter.toggleAdvancedFilters = toggleAdvancedFilters;

    var removeAdvancedFiltersFromModel = function removeAdvancedFiltersFromModel() {
      var listToRemove = Object.keys($scope.listFilter.model.filters).filter(function (key) {
        if (!defaultFiltersRegexp.test(key)) {
          if (!advancedFiltersModelRemoved) {
            $scope.listFilter.modelAdvanced[key] = $scope.listFilter.model.filters[key];
          }

          return true;
        }

        return false;
      });
      removeFiltersFromModel(listToRemove);
      advancedFiltersModelRemoved = true;
    };

    var setFields = function setFields() {
      var fieldsDefault = $scope.listObj.data.filters.filter(function (item) {
        return defaultFiltersRegexp.test(item.field);
      });
      var fieldsDefaultAdvanced = $scope.listObj.data.filters.filter(function (item) {
        return !defaultFiltersRegexp.test(item.field);
      });
      createFieldsFromAPI(fieldsDefault, $scope.formlyFields);
      fieldsAdvancedOriginal = angular.copy(fieldsDefaultAdvanced);
    };

    var createFieldsFromAPI = function createFieldsFromAPI(fields, formlyFields) {
      anaproFormlyFactory.createFormlyFieldsFromAPI(fields, formlyFields, {
        merge: {
          atendimentoCodigo: {
            type: 'hidden'
          },
          atendimentoOpcao: {
            type: 'anaproSelectButtons',
            templateOptions: {
              noErrorSpace: true
            }
          },
          atendimentoStatus: {
            type: 'anaproSelectButtons',
            templateOptions: {
              noErrorSpace: true
            }
          },
          atendimentoPipelineStageIdGuid: {
            templateOptions: {
              noErrorSpace: true,
              options: anaproFormlyFactory.groupOptionsByExpression($scope.listObj.data.filters, 'atendimentoPipelineStageIdGuid', /\((.*?)\)/)
            }
          },
          atendimentoInteracaoUsuarioQtdDiasSem: {
            className: 'ipt-days'
          },
          atendimentoExpiracaoAutomaticaQtdDiasRestantesMax: {
            className: 'ipt-days'
          },
          atendimentoPendencias: {
            type: 'hidden'
          },
          atendimentoCompromissos: {
            type: 'hidden'
          },
          atendimentoExpiracaoAutomaticaQtdDiasRestantes: {
            type: 'hidden'
          },
          produtoIdGuid: {
            templateOptions: {
              noErrorSpace: true
            }
          },
          interacaoAtividadeSem: {
            type: 'anaproSelectButtons',
            templateOptions: {
              noErrorSpace: true
            }
          }
        }
      });
    };

    setFields();
    removeAdvancedFiltersFromModel();
  }).directive('listFilterOptions', function () {
    return {
      restrict: 'E',
      scope: {
        delegateListFilter: '='
      },
      templateUrl: 'transactions/directives/list-filter/list-filter-options.html',
      controller: 'listFilterOptionsController'
    };
  });
})();

'use strict';

(function () {
  angular.module('views.transactions').controller('viewTransactionsListFilterController', function ($rootScope, $scope, $timeout, $modal, path, transactionsService, automateNewLeadFactory, addClientFactory, notificationCenterTransactionsAwaiting) {
    $scope.isAutomateNewLeadDisabled = function () {
      return automateNewLeadFactory.isDisabled();
    };

    $scope.getAutomateNewLeadButtonTitle = function () {
      return automateNewLeadFactory.activeOfferMessage();
    };

    var addClientDelegate = {
      reset: function reset() {
        console.log('modalAddClient reset: ');
      },
      itemAddedCurrentUserHasNoAccess: function itemAddedCurrentUserHasNoAccess(item) {
        console.log('temAddedCurrentUserHasNoAccess', item);
      },
      itemAddedToCurrentUser: function itemAddedToCurrentUser(item) {
        $rootScope.mainController.go(path.get('transaction').withItem(item));
      },
      itemAddedToOtherUser: function itemAddedToOtherUser(item) {
        console.log('temAddedToOtherUser', item);
      }
    };
    var transactionStatuses = transactionsService.statuses;

    $scope.showModalAddClient = function () {
      addClientFactory.showModal({
        delegate: addClientDelegate
      });
    };

    $scope.listFilter = $scope.$parent.$parent.listFilter;
    $scope.listObj = $scope.$parent.listObj;

    $scope.sendEmailMarketing = function () {
      console.info('Send email marketing for:', $scope.listObj.selected.items);
    };

    $scope.showTransactionsOnQueueButton = function () {
      return $scope.listFilter.model.filters && $scope.listFilter.model.filters.atendimentoStatus != transactionStatuses.queue && $scope.listFilter.model.filters.atendimentoOpcao == 'meus' && notificationCenterTransactionsAwaiting.getTotalNewClients() > 0;
    };

    $scope.showAttendedTransactionsButton = function () {
      return $scope.listFilter.model.filters && $scope.listFilter.model.filters.atendimentoStatus == transactionStatuses.queue && $scope.listFilter.model.filters.atendimentoOpcao == 'meus';
    };

    $scope.getTotalTransactionsOnQueue = function () {
      return notificationCenterTransactionsAwaiting.getTotalNewClients();
    };

    $scope.showTransactionsOnQueue = function () {
      $rootScope.mainController.go(transactionsService.getTransactionsAwaitingLink());
    };

    $scope.showAttendedTransactions = function () {
      $scope.listFilter.model = {
        q: $scope.listFilter.model.q,
        filters: {
          atendimentoStatus: transactionStatuses.attended
        }
      };
      $scope.listFilter.setFilters();
    };

    $scope.showTransactionsWithOrWithoutTasks = function (field) {
      var filter = {};

      if (!$scope.listFilter.model.filters[field]) {
        filter[field] = $scope.transactionsWithorWithoutTasks[field].value;
      }

      $scope.listFilter.model = {
        q: $scope.listFilter.model.q,
        filters: filter
      };
      $scope.listFilter.setFilters();
    };

    $scope.getNewLead = function () {
      automateNewLeadFactory.get();
    };

    $scope.transactionsWithorWithoutTasks = {
      atendimentoPendencias: {
        value: null,
        total: null
      },
      atendimentoCompromissos: {
        value: null,
        total: null
      }
    };

    $scope.toggleAdvancedFilters = function ($event) {
      $event.stopPropagation();
      $scope.listFilter.advanced = !$scope.listFilter.advanced;
      $scope.delegateListFilter.toggleAdvancedFilters();
    };

    $scope.delegateListFilter = {};

    var setTotalTransactionsWithOrWithoutTasks = function setTotalTransactionsWithOrWithoutTasks() {
      $scope.listObj.data.filters.map(function (item) {
        if ($scope.transactionsWithorWithoutTasks[item.key]) {
          $scope.transactionsWithorWithoutTasks[item.key].total = item.templateOptions.options[0].name;
          $scope.transactionsWithorWithoutTasks[item.key].value = item.templateOptions.options[0].value;
        }
      });
    };

    $timeout(setTotalTransactionsWithOrWithoutTasks);
  }).directive('viewTransactionsListFilter', function () {
    return {
      restrict: 'E',
      scope: {},
      controller: 'viewTransactionsListFilterController',
      templateUrl: 'transactions/directives/list-filter/list-filter.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('views.transactions').controller('ViewTransactionsListFilterExpiresRulerController', function ($scope, $timeout) {
    $scope.listFilter = $scope.$parent.$parent.listFilter;
    $scope.listObj = $scope.$parent.listObj;
    $scope.filterObj;

    var setFilterObj = function setFilterObj() {
      $scope.listObj.data.filters.map(function (item) {
        if (item.key == 'atendimentoExpiracaoAutomaticaQtdDiasRestantes') {
          $scope.filterObj = item;
        }
      });
    };

    $timeout(setFilterObj);

    $scope.setFilter = function (item) {
      $scope.listFilter.model = {
        q: $scope.listFilter.model.q,
        filters: {
          atendimentoExpiracaoAutomaticaQtdDiasRestantes: item.value
        }
      };
      $scope.listFilter.setFilters();
    };

    $scope.isActive = function (item) {
      return $scope.filterObj.initialValue == item.value;
    };
  }).directive('viewTransactionsListFilterExpiresRuler', function () {
    return {
      restrict: 'E',
      scope: {},
      controller: 'ViewTransactionsListFilterExpiresRulerController',
      templateUrl: 'transactions/directives/list-filter-expires-ruler/list-filter-expires-ruler.html'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.notifications-container.dialog.new-chat', []).config(function (notificationsContainerDialogProvider, firebaseCollections) {
    notificationsContainerDialogProvider.putDialogType('newChat', {
      priority: 0,
      limit: 1,
      collectionKey: firebaseCollections.chat,
      directive: 'new-chat',
      sound: 'chat1',
      desktopNotification: {
        icon: '/assets/imgs/icons/notification-new-chat.png'
      }
    });
  }).controller('NotificationsContainerDialogNewChatController', function ($scope, $timeout, audioFactory) {
    var sound;
    var soundTimer;

    var playSound = function playSound() {
      soundTimer = $timeout(function () {
        sound = audioFactory.play('chat2', playSoundResume);
        sound.loop = true;
      }, 2000);
    };

    var playSoundResume = function playSoundResume() {
      if (soundTimer) {
        playSound();
      }
    };

    playSound();

    $scope.open = function () {
      window.open('//' + $scope.dialog.data.Href, 'AnaproChat');
      $scope.remove();
    };

    $scope.onRemoveDialogType = function () {
      if (sound) {
        sound.pause();
        sound.src = '';
        sound = null;
      }

      if (soundTimer) {
        $timeout.cancel(soundTimer);
        soundTimer = null;
      }
    };
  }).directive('dialogNewChat', function () {
    return {
      restrict: 'E',
      templateUrl: 'notifications-container/dialog-container/dialog/new-chat/new-chat.html',
      controller: 'NotificationsContainerDialogNewChatController'
    };
  });
})();

'use strict';

(function () {
  angular.module('directives.notifications-container.dialog.new-lead', []).config(function (notificationsContainerDialogProvider) {
    notificationsContainerDialogProvider.putDialogType('newLead', {
      priority: 1,
      limit: 2,
      collectionKey: 'pendingProcessingTransactionWaitingAttend',
      directive: 'new-lead',
      sound: 'new-lead',
      desktopNotification: {
        icon: '/assets/imgs/icons/notification-new-lead.png'
      }
    });
  }).controller('NotificationsContainerDialogNewLeadController', function ($rootScope, $scope, path, notificationCenterDialogs) {
    var dialogId = $scope.dialog.data.id;
    $scope.newLeadImg = $scope.dialog.data.prospectUrlImagem;

    $scope.open = function () {
      $rootScope.mainController.go(path.get('transaction').withItem({
        id: $scope.dialog.data.atendimentoIdGuid
      }));
      $scope.remove(null, {
        actionOrigin: 'open'
      });
    };

    $scope.onRemoveDialogType = function () {
      notificationCenterDialogs.removeById(dialogId, true);
    };
  }).directive('dialogNewLead', function () {
    return {
      restrict: 'E',
      templateUrl: 'notifications-container/dialog-container/dialog/new-lead/new-lead.html',
      controller: 'NotificationsContainerDialogNewLeadController'
    };
  });
})();

'use strict';

(function () {
  angular.module('factories.error-message.config', []).constant('defaultErrorMessages', {
    offline: {
      title: 'Você aparentemente esta sem acesso a internet.',
      message: 'Verifique sua conexão e tente novamente.'
    },
    success: {
      title: 'Operação realizada com sucesso.',
      message: ''
    },
    forbidden: {
      title: 'Permissão negada.',
      message: 'Você não tem permissão para realizar essa operação.'
    },
    payloadError: {
      title: 'Por favor, verifique os dados enviados e tente novamente',
      message: ''
    },
    serverError: {
      title: 'Desculpe, estamos com dificuldades para realizar essa operação.',
      message: 'Tente novamente mais tarde.'
    }
  });
})();

'use strict';

(function () {
  angular.module('anapro.formly').run(function (formlyConfig) {
    formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';
    formlyConfig.setType([{
      name: 'anaproCheckbox',
      templateUrl: 'formly-templates/checkbox.html',
      extends: 'checkbox'
    }, {
      name: 'anaproEmail',
      extends: 'input',
      defaultOptions: {
        templateOptions: {
          type: 'email'
        }
      }
    }, {
      name: 'anaproMultiCheckbox',
      templateUrl: 'formly-templates/multicheckbox.html',
      extends: 'multiCheckbox',
      wrapper: 'anaproMultiCheckbox'
    }, {
      name: 'maskedInput',
      extends: 'input',
      defaultOptions: {
        ngModelAttrs: {
          mask: {
            attribute: 'mask'
          },
          restrict: {
            attribute: 'restrict'
          },
          clean: {
            attribute: 'clean'
          },
          cpf: {
            attribute: 'ui-br-cpf-mask'
          },
          cnpj: {
            attribute: 'ui-br-cnpj-mask'
          },
          cpfCnpj: {
            attribute: 'ui-br-cpfcnpj-mask'
          }
        },
        templateOptions: {
          type: 'tel',
          // force mobile show numeric keyboard
          restrict: 'reject',
          clean: true
        }
      }
    }, {
      name: 'numberInput',
      extends: 'input',
      controller: function controller($scope) {
        $scope.options.resetModel = function () {
          if ($scope.options.defaultValue === 0) {
            $scope.options.defaultValue = '0';
          }

          $scope.model[$scope.options.key] = $scope.options.defaultValue;
        };
      },
      defaultOptions: {
        ngModelAttrs: {
          minValue: {
            attribute: 'min'
          },
          maxValue: {
            attribute: 'max'
          },
          decimals: {
            attribute: 'ui-number-mask'
          },
          money: {
            attribute: 'ui-money-mask'
          },
          hideSeparator: {
            attribute: 'ui-hide-group-sep'
          }
        },
        templateOptions: {
          type: 'tel' // force mobile show numeric keyboard

        }
      }
    }, {
      name: 'hidden',
      template: '',
      defaultOptions: {
        noFormControl: true,
        hide: true
      }
    }]);
    formlyConfig.setWrapper([{
      name: 'anaproMultiCheckbox',
      templateUrl: 'formly-templates/multicheckbox-wrapper.html'
    }, {
      name: 'anaproSelect',
      types: ['select'],
      templateUrl: 'formly-templates/select-wrapper.html'
    }, {
      name: 'anaproSelectAsync',
      types: ['select-async'],
      templateUrl: 'formly-templates/select-async-wrapper.html'
    }, {
      name: 'anaproRadio',
      types: ['radio'],
      templateUrl: 'formly-templates/radio-wrapper.html'
    }, {
      name: 'extras',
      types: ['input', 'maskedInput', 'numberInput', 'select', 'anaproEmail', 'anaproDate', 'anaproTime', 'anaproDateTime', 'textarea', 'nya-select', 'select-async', 'anaproSelectButtons'],
      templateUrl: 'formly-templates/extras-wrapper.html'
    }, {
      name: 'validation',
      types: ['input', 'maskedInput', 'numberInput', 'select', 'radio', 'anaproEmail', 'anaproDate', 'anaproTime', 'anaproDateTime', 'nya-select', 'select-async', 'anaproSelectButtons'],
      templateUrl: 'formly-templates/error-messages-wrapper.html'
    }]);
  });
})();

'use strict';

(function () {
  angular.module('services.longpolling').constant('longpollingTimer', 2000).run(function (longpollingService, usersService) {
    var init = function init() {
      longpollingService.init();
    };

    if (usersService.isProfileLoaded(init)) {
      init();
    }
  });
  angular.module('services.longpolling.cacheFactory', []).run(function (CacheFactory) {
    CacheFactory('longpolling', {
      storagePrefix: 'AnaproAPP-Caches.',
      storageMode: 'localStorage'
    });
  });
})();

'use strict';

(function () {
  angular.module('services.firebase').constant('firebaseConfig', {
    apiKey: 'AIzaSyAEPm3MNQtwK1dejcNkYDhrLcf4YiSOrpo',
    authDomain: 'anaprobr-e469e.firebaseapp.com',
    databaseURL: 'https://anaprobr-e469e.firebaseio.com',
    projectId: 'anaprobr-e469e',
    storageBucket: 'anaprobr-e469e.appspot.com',
    messagingSenderId: '297244363461'
  }).constant('firebaseCollections', {
    pendingProcessing: 'pendenciaprocessamento',
    systemMessages: 'system-messages',
    chat: 'chatlegacy',
    queuesChannelChatByUser: 'queuesChannelChatByUser',
    queuesChannel: {
      chat: 'queuesChannelChat'
    }
  }).constant('firebaseCollectionsItemId', {
    chat: 'ChatIdGuid'
  }).constant('firebaseBroadcastsNames', {
    pendenciaprocessamento: 'firebaseService.pendenciaprocessamento',
    systemMessages: 'firebaseService.systemMessages',
    chat: 'firebaseService.chat',
    queuesChannelChatByUser: 'firebaseService.queuesChannelChatByUser'
  }).run(function (firebaseConfig, firebaseProvider) {
    firebase.initializeApp(firebaseConfig);
    firebaseProvider.setFirestoreDB();
  });
})();

'use strict';

(function () {
  var view = 'auth';
  var controller = 'ViewAuthController';
  var requireLogin = false;
  var configPath = {
    path: '/login/',
    label: 'Autenticação'
  };
  var route = {
    templateUrl: view + '/' + view + '.html',
    controller: controller,
    requireLogin: requireLogin,
    redirToDefaultWhenLoggedIn: true,
    configPath: configPath
  };
  angular.module('views.' + view).config(function ($routeProvider, $locationProvider, pathProvider) {
    var pathObj = pathProvider.addPath(view, configPath);
    var path = pathObj.path;
    $routeProvider.when(path, route);
  });
})();

'use strict';

(function () {
  var view = 'calendar';
  var controller = 'ViewCalendarController';
  var requireLogin = true;

  var getPageTrack = function getPageTrack(next) {
    if (next.pathParams.hash) {
      return configPath.path + 'filtes/';
    } else if (next.pathParams.q) {
      return configPath.path + next.pathParams.q;
    } else {
      return configPath.path;
    }
  };

  var configPath = {
    path: '/agenda/',
    label: 'Agenda',
    icon: 'calendar',
    getPageTrack: getPageTrack
  };
  var route = {
    templateUrl: view + '/' + view + '.html',
    controller: controller,
    requireLogin: requireLogin,
    configPath: configPath
  };
  angular.module('views.' + view).config(function ($routeProvider, $locationProvider, pathProvider) {
    var pathObj = pathProvider.addPath(view, configPath);
    var path = pathObj.path;
    $routeProvider.when(path + ':q?', route).when(path + 'filters/:hash?', route);
  });
})();

'use strict';

(function () {
  var view = 'clients';
  var controller = 'ViewClientsController';
  var requireLogin = true;
  var permissions = 'view.clients';
  var permissionDescription = 'Carteira de clientes';
  var configPath = {
    path: '/clientes/',
    label: 'Carteira',
    icon: 'contacts-book',
    permissions: permissions,
    permissionDescription: permissionDescription
  };
  var route = {
    templateUrl: view + '/' + view + '.html',
    controller: controller,
    requireLogin: requireLogin,
    configPath: configPath
  };
  angular.module('views.' + view).config(function ($routeProvider, $locationProvider, pathProvider) {
    var pathObj = pathProvider.addPath(view, configPath);
    var path = pathObj.path;
    $routeProvider.when(path, route) // [todo] remove
    .when(path + ':id/', route);
  });
})();

'use strict';

(function () {
  var view = 'home';
  var controller = 'ViewHomeController';
  var requireLogin = true;
  var configPath = {
    path: '/home/',
    label: 'Home',
    icon: 'Anapro-Logo-Marca-3paths'
  };
  var route = {
    templateUrl: view + '/' + view + '.html',
    controller: controller,
    requireLogin: requireLogin,
    configPath: configPath
  };
  angular.module('views.' + view).config(function ($routeProvider, $locationProvider, pathProvider, mainControllerProvider) {
    if (mainControllerProvider.getDevice() == 'mobile') {
      configPath.icon = 'Anapro-Logo-1path';
    }

    var pathObj = pathProvider.addPath(view, configPath);
    var path = pathObj.path; // [todo] remove when /home get ready to be use

    path, route; // [todo] uncomment when /home get ready to be use
    // $routeProvider
    // 	.when(
    // 		path,
    // 		route
    // 	)
    // ;
  });
})();

'use strict';

(function () {
  var view = 'queues-handler-position';
  var controller = 'ViewQueuesHandlerPositionController';
  var requireLogin = true;
  var configPath = {
    path: '/fila-atendimento/',
    label: 'Fila de atendimento',
    icon: 'user-profile',
    withItem: function withItem(item) {
      return configPath.path + item.CampanhaIdGuid + ':' + item.CanalIdGuid;
    }
  };
  var route = {
    templateUrl: view + '/' + view + '.html',
    controller: controller,
    requireLogin: requireLogin,
    configPath: configPath
  };
  angular.module('views.' + view).config(function ($routeProvider, $locationProvider, pathProvider) {
    var pathObj = pathProvider.addPath(view, configPath);
    var path = pathObj.path;
    $routeProvider.when(path + ':id', route);
  });
})();

'use strict';

(function () {
  var view = 'transaction';
  var controller = 'ViewTransactionController';
  var requireLogin = true;
  var configPath = {
    path: '/negocio/',
    label: 'Negócio',
    icon: 'users2',
    withItem: function withItem(item) {
      return configPath.path + item.id;
    }
  };
  var route = {
    templateUrl: view + '/' + view + '.html',
    controller: controller,
    requireLogin: requireLogin,
    configPath: configPath
  };
  angular.module('views.' + view).config(function ($routeProvider, $locationProvider, pathProvider) {
    var pathObj = pathProvider.addPath(view, configPath);
    var path = pathObj.path;
    $routeProvider.when(path + ':id', route);
  });
})();

'use strict';

(function () {
  var view = 'transactions';
  var controller = 'ViewTransactionsController';
  var requireLogin = true;
  var permissions = 'atd_listar_atendimento';

  var getPageTrack = function getPageTrack(next) {
    if (next.pathParams.hash) {
      return configPath.path + 'filtes/';
    } else if (next.pathParams.q) {
      return configPath.path + next.pathParams.q;
    } else {
      return configPath.path;
    }
  };

  var configPath = {
    path: '/negocios/',
    label: 'Clientes',
    icon: 'users2',
    permissions: permissions,
    getPageTrack: getPageTrack
  };
  var route = {
    templateUrl: view + '/' + view + '.html',
    controller: controller,
    requireLogin: requireLogin,
    configPath: configPath
  };
  angular.module('views.' + view).config(function ($routeProvider, $locationProvider, pathProvider) {
    var pathObj = pathProvider.addPath(view, configPath);
    var path = pathObj.path;
    $routeProvider.when(path + ':q?', route).when(path + 'filters/:hash?', route);
  });
})();

'use strict';

(function () {
  var view = 'user-profile';
  var controller = 'ViewUserProfileController';
  var requireLogin = true;
  var configPath = {
    path: '/meus-dados/',
    label: 'Meus dados',
    icon: 'user-profile',
    withItem: function withItem(item) {
      return configPath.path + item.id;
    }
  };
  var route = {
    templateUrl: view + '/' + view + '.html',
    controller: controller,
    requireLogin: requireLogin,
    configPath: configPath
  };
  angular.module('views.' + view).config(function ($routeProvider, $locationProvider, pathProvider) {
    var pathObj = pathProvider.addPath(view, configPath);
    var path = pathObj.path;
    $routeProvider.when(path + ':id?', route);
  });
})();
//# sourceMappingURL=maps/app.min.js.map

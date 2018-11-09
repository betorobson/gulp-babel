
/* eslint-disable */

(function(){

	////////////////////////////////////////////////////////////////////////////////////////
	// Anapro Functions
		window.AF = window.AF || {};
	////////////////////////////////////////////////////////////////////////////////////////

 $(document).on('show','.accordion', function(e){
			 //$('.accordion-heading i').toggleClass(' ');
			 $(e.target).prev('.accordion-heading').addClass('accordion-opened');
	 });

 $(document).on('hide','.accordion', function(e){
	$(this).find('.accordion-heading').not($(e.target)).removeClass('accordion-opened');
				//$('.accordion-heading i').toggleClass('fa-chevron-right fa-chevron-down');
		});

 $(function(){
	$('.carousel').carousel({
		interval: 0
	});

	$('.carousel').on('slid.bs.carousel', function(){
		var carouselAltText = $(this).find('[data-carousel-selected-alt]');
		if(carouselAltText.length > 0){
			carouselAltText.html($(this).find('.item.active img').attr('alt'));
		}
	});

	$('[data-carousel-selected-alt]').each(function(){
		$(this).parents('.carousel').trigger('slid.bs.carousel');
	});

	if($("#txtEditor").Editor){
		$("#txtEditor").Editor();
	}

		 //popover
		$('[rel=popover]').popover({
			html: true,
			trigger: 'hover',
			placement: 'top',
			content: function(){return '<img src="'+$(this).data('img') + '" />' + ' ' + $(this).data('txt');}
		});

		$('[rel=popover]').on('mouseover', function(){
			$('.popover')
				.removeClass('green')
				.removeClass('red')
				.addClass($(this).data('color'));
		});


		////////////////////////////////////////////////////////////////////////////////////////
		// Bootstrap TAB Behavior //
		////////////////////////////////////////////////////////////////////////////////////////
		$(document)
			.delegate(
				'[data-toggle="tab"]',
				'click',
				function(e){
					e.preventDefault();
					$(this).tab('show');
					$(this).closest('.nav-tabs')
						.find('[data-toggle="tab"]').removeClass('active');
					$(this).addClass('active');
				}
			);

		////////////////////////////////////////////////////////////////////////////////////////
		// Bootstrap Weird TAB Behavior //
		// by MCorrea //
		////////////////////////////////////////////////////////////////////////////////////////
		$(document).delegate('[data-keepopen-collapse]','click', function(e){
			if($(this).data('dismiss') == undefined){
				e.stopPropagation();
			}

			var button = $(this);

			if(button.parent().hasClass('active')){
				return;
			}
			var parentId = button.data('parent');

			if(parentId != undefined){
				button.closest(parentId).find('[data-parent="'+ parentId +'"]').each(function(){
					var panelId = $(this).data('target');
					$(this).parent().removeClass('active');
					$(panelId).removeClass('in');
				});

				button.parent().addClass('active');
				$(button.data('target')).addClass('in');
			}
		});
		////////////////////////////////////////////////////////////////////////////////////////

		$('[data-collapsed-text]').on('click', function(){
			var btn = $(this);
			window.setTimeout(function(){
				if(btn.data('expanded-text') == undefined){
					btn.data('expanded-text', btn.text());
				}

				var expandedText = btn.data('expanded-text');
				var collapsedText = btn.data('collapsed-text');
				if(btn.hasClass('collapsed')){
					btn.text(expandedText);
				}else{
					btn.text(collapsedText);
				}
			}, 200);
		});

			var sliders = $('[data-input-slider]');

			if(sliders.slider){
				sliders.slider();
				sliders.on('slide', function(ev){
						var id = $(this).data('input-slider');
						var sufix = $(this).data('slider-value-sufix');

						$('[data-input-slider-min="'+ id +'"]').val(ev.value[0]);
						$('[data-input-slider-max="'+ id +'"]').val(ev.value[1]);

						var valueText = ev.value[0] + sufix + ' - ' + ev.value[1] + sufix;
						$('[data-input-slider-html="'+ id +'"]').html(': ' + valueText);
					});
			}
	});

	$(function(){
			var filtroTriggers = $('[data-filtro-container-trigger]');

			filtroTriggers.on('click', function(){
					var id = $(this).data('filtro-container-trigger');
					var parentId = $(this).closest('[data-filtro]').data('filtro');

					$('[data-filtro="'+ parentId +'"]').find('[data-filtro-container-trigger]').removeClass('active');
					$('[data-filtro="'+ parentId +'"]').find('[data-filtro-container-trigger="'+ id +'"]').addClass('active');

					$('[data-filtro="'+ parentId +'"]').find('[data-filtro-container]').removeClass('in');
					$('[data-filtro="'+ parentId +'"]').find('[data-filtro-container="'+ id +'"]').addClass('in');
				});

			$('[data-filtro]').each(function(){
				$(this).find('[data-filtro-container-trigger]:first').trigger('click');
			});

		//////////////
		// Applied globally on all textareas with the "autoExpand" class

		(function(){

			var textAreaAutoExpand = function(event){

				var minRows = this.getAttribute('data-min-rows')|0, rows;

				this.rows = minRows;
				rows = Math.floor(this.scrollHeight / 20.5);

				$(this).css({
					height: this.scrollHeight + 'px'
				});

			};

			$(document)
				.on('input.autoExpand focus', 'textarea.autoExpand', textAreaAutoExpand)
			;

		})();

		// !!!! DO NOT USE DataTable JQuery Plugin over Angular !!!!
		// if($('.dataTable').DataTable){
		// 	$('.dataTable').DataTable();
		// }

		$('[data-agenda-task]').on('click', function(){
			var agenda = $(this).closest('[data-agenda]');
			var col = $(this).closest('.col');
			var task = $(this).data('agenda-task');

			$(agenda).find('[data-agenda-task]').closest('.col').removeClass('selected');
			$(agenda).find('[data-agenda-task]').closest('.col').css('margin-bottom', "");
			col.addClass('selected');

			agenda.find('[data-agenda-taskview]').removeClass('in');
			agenda.find('[data-agenda-taskview="'+ task +'"]').addClass('in');

			var taskViewHeight = col.find('.task-view').height();
			col.css('margin-bottom', taskViewHeight - 20);
		});

		$('[data-agenda] [data-agenda-task-close]').on('click',function(){
			$(this).closest('.col').removeClass('selected');
			$(this).closest('.col').css('margin-bottom', "");
		});

		////////////////////////////////////////////////////////////////////////////////////////
		// Bootstrap Dropdown //
		////////////////////////////////////////////////////////////////////////////////////////
		// previne o menu de fechar ao clicar dentro
		// $('.dropdown-menu.dropdown-menu-keepopen').on("click.bs.dropdown", function(e){ e.stopPropagation(); });
		// replaced by delegate
			$(document).delegate(
				'.dropdown-menu.dropdown-menu-keepopen',
				'click',
				function(e){
					e.stopPropagation();
				}
			);

			$.fn.hideParentDropdown = function(target){

				var elemet = $(target)
					.closest('.btn-group.open')
					.removeClass('open')
					.find('dropdown-menu');

				return elemet;
			};
		////////////////////////////////////////////////////////////////////////////////////////

		//habilitando navegação no carossel por swipe, apenas para mobile
		$('.carousel.only-mobile .item').on('swipe', function(e){
			var item = $(this);
			var x1 = e.swipestart.coords[0];
			var x2 = e.swipestop.coords[0];

			if(x1 >= x2){
				item.closest('.carousel').find('[data-slide="next"]').trigger('click');
			}
			else{
				item.closest('.carousel').find('[data-slide="prev"]').trigger('click');
			}
		});

		if($('.datepicker').datepicker){
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

	var Chat = function(){
		return {
			Id: '',

			Config: function(){
				$('[data-chat-contatos-open]').on('click', function(){
					var aberto = $(this).data('chat-contatos-open');
					if(aberto == undefined)
						aberto = false;

					if(aberto == true){
						Chat.Contato.Fechar();
					}
					else{
						Chat.Contato.Abrir();
					}
				});

				$('[data-chat-open]').on('click', function(){
					var aberto = $(this).data('chat-open');
					if(aberto == undefined)
						aberto = false;

					if(aberto){
						Chat.Mensagens.Fechar();
					}
					else{
						Chat.Mensagens.Abrir();
					}
				});

				$('[data-chat-finish]').on('click', function(){
					Chat.Finish();
				});

				$('[data-chat-start]').on('click', function(){
					var id = $(this).data('chat-start');
					Chat.Start(id);
				});
			},
			Start: function(id){
				Chat.Finish();

				Chat.Id = id;

				Chat.Contato.Fechar(0);
				Chat.Mensagens.Fechar(0);
				$('[data-chat="' + id + '"]').show();
			},
			Finish: function(){
				$('[data-chat]').hide();
			},
			Mensagens:{
				Abrir : function(time){
					if(time == undefined)
						time = 100;

						$('[data-chat="' + Chat.Id + '"] [data-chat-messages]').show(time, function(){
							$('[data-chat="' + Chat.Id + '"] [data-chat-open]').data('chat-open', true);
							$('[data-chat="' + Chat.Id + '"] [data-chat-open]').addClass('open');
							$('[data-chat="' + Chat.Id + '"] [data-chat-contatos-list]').show(0);
						});
				},
				Fechar : function(time){
					if(time == undefined)
						time = 100;

					$('[data-chat="' + Chat.Id + '"] [data-chat-contatos-list]').hide(0, function(){
						$('[data-chat="' + Chat.Id + '"] [data-chat-messages]').hide(time, function(){
							$('[data-chat="' + Chat.Id + '"] [data-chat-open]').data('chat-open', false);
							$('[data-chat="' + Chat.Id + '"] [data-chat-open]').removeClass('open');
						});
					}, 0);
				}
			},
			Contato:{
				Abrir : function(time){
					if(time == undefined)
						time = 100;

					$('[data-chat="' + Chat.Id + '"] [data-chat-contatos-list]').animate({
						width:'100%'
					}, time, function(){
						$('[data-chat="' + Chat.Id + '"] [data-chat-contatos-open]').data('chat-contatos-open', true);
						$('[data-chat="' + Chat.Id + '"] [data-chat-contatos-open]').addClass('open');
					});
				},
				Fechar : function(time){
					if(time == undefined)
						time = 100;

					$('[data-chat="' + Chat.Id + '"] [data-chat-contatos-list]').animate({
						width:0
					}, time, function(){
						$('[data-chat="' + Chat.Id + '"] [data-chat-contatos-open]').data('chat-contatos-open', false);
						$('[data-chat="' + Chat.Id + '"] [data-chat-contatos-open]').removeClass('open');
					});
				}
			}
		}
	}();

	// [todo] remove this kind of modal behavior which cause too much cpu usage
	var OverContent = function(){
		return {
			Config: function(){
				$('[data-overcontent-button]').on('click', function(){
					$('[data-overcontent]').hide();

					var overcontent = $('[data-overcontent="'+ $(this).data('overcontent-button') +'"]');
					overcontent.find('.overcontent-container').css('height', '0px');
					overcontent.show(function(){
						var overcontentContainer = overcontent.find('.overcontent-container');
						overcontentContainer.animate({
							height: '100%'
						}, 300, function(){
							$('body').css('overflow', 'hidden');
						});
					});
				});

				$('[data-overcontent-close]').on('click', function(){
					var overcontent = $(this).closest('[data-overcontent]');
					overcontent.find('.overcontent-container').animate({
							height: '0px'
						}, 300, function(){
							overcontent.hide();
							$('body').css('overflow', 'auto');
						});
				});
			}
		}
	}();

	var EditField = function(){
		return {
			Config: function(){
				$('[data-edit-form]').hide();
				$('[data-edit-button]').on('click', function(){
					var editContainer = $(this).closest('[data-edit]');
					editContainer.find('[data-edit-view]').hide();
					editContainer.find('[data-edit-form]').show();
				});

				$('[data-edit-confirm]').on('click', function(){
					var editContainer = $(this).closest('[data-edit]');
					editContainer.find('[data-edit-view]').show();
					editContainer.find('[data-edit-form]').hide();

					//TODO implementar persistencia do dado
				});
			}
		}
	}();

	window['Chat'] = Chat;

})()

/* eslint-enable */

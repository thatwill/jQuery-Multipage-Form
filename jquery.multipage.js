(function($) {


		var curpage = 1;
		var id = null;
		var settings = null;
		var pageStore =  new Array();

		jQuery.fn.transitionPage = function(from,to) {
		
			if (settings.transitionFunction) {
				settings.transitionFunction(from,to);
			} else {
				$(from).hide();
				$(to).show();
			}
			$(id + ' fieldset').removeClass('active');
			$(to).addClass('active');		
		};
		
		jQuery.fn.showState = function(page) { 
			
			if (settings.stateFunction) { 
				return settings.stateFunction(id+"_nav .multipage_state",page,settings.pages.length);
			}
			var state = '';
			for (x = 1; x <= settings.pages.length; x++) {
				if(x==page) {
					state = state + settings.activeDot;
				} else {
					state = state + settings.inactiveDot;
				}
			}
			$(id+"_nav .multipage_state").html(state);	
		};

		
		jQuery.fn.gotopage = function(page) {
			$(id + '_nav .multipage_next').html(settings.nextLabel);
			
			if (isNaN(page)) { 
				q = page;
				page = 1;
				$(id+' fieldset').each(function(index) {
					if ('#'+$(this).attr('id')==q) { 
						curpage = page = index+1;
					}
				});
			}

			var np = null;
			var cp = $(id+' fieldset.active');
			// show the appropriate page.
			$(id+' fieldset').each(function(index) {
				index++;
				if (index==page) {		
					np = this;
				}
			});
			
			$(this).transitionPage(cp,np);
			
			$(this).showState(page);

			$(id + '_nav .multipage_next').removeClass('submit');				
			
			// is there a legend tag for this fieldset?
			// if so, pull it out.
			page_title = settings.pages[page-1].title;
			
			if (settings.stayLinkable) { 
				hashtag = '#' + settings.pages[page-1].id;
				document.location.hash = hashtag;
			}
			if (page==1) {
				// set up for first page
				$(id + '_nav .multipage_back').hide();
				$(id + '_nav .multipage_next').show();
				if (settings.pages[page].title) {
					$(id + '_nav .multipage_next').html(settings.nextLabel + ': ' + settings.pages[page].title);
				} else {
					$(id + '_nav .multipage_next').html(settings.nextLabel);
				}

			} else if (page==settings.pages.length) { 
				// set up for last page
				$(id + '_nav .multipage_back').show();
				$(id + '_nav .multipage_next').show();

				if (settings.pages[page-2].title) { 
					$(id + '_nav .multipage_back').html(settings.backLabel + ': ' + settings.pages[page-2].title);
				} else {
					$(id + '_nav .multipage_back').html(settings.backLabel);
				}

				$(id + '_nav .multipage_next').addClass('submit');				
				$(id + '_nav .multipage_next').html(settings.submitLabel);				
				
			} else {
				if (settings.pages[page-2].title) { 
					$(id + '_nav .multipage_back').html(settings.backLabel + ': ' + settings.pages[page-2].title);
				} else {
					$(id + '_nav .multipage_back').html(settings.backLabel);
				}
				if (settings.pages[page].title) {
					$(id + '_nav .multipage_next').html(settings.nextLabel + ': ' + settings.pages[page].title);
				} else {
					$(id + '_nav .multipage_next').html(settings.nextLabel);
				}

				$(id + '_nav .multipage_back').show();
				$(id + '_nav .multipage_next').show();				

			}
			
			$(id + ' fieldset.active input:first').focus();
			curpage=page;
			return false;
			
		};
		
	jQuery.fn.validatePage = function(page) {
            if (settings.validatePageFunction) {
                return settings.validatePageFunction(page);
            } else {
                return true;
            }
        };

		
	jQuery.fn.validateAll = function() { 
		for (x = 1; x <= settings.pages.length; x++) {
			if (!$(this).validatePage(x)) {
				$(this).gotopage(x);
				return false;
			}
		}
		return true;
	};

		
	jQuery.fn.gotofirst = function() {
		curpage = 1;
		$(this).gotopage(curpage);
		return false;
	};

	jQuery.fn.gotolast = function() {
		curpage = settings.pages.length;
		$(this).gotopage(curpage);
		return false;
	};

	jQuery.fn.nextpage = function() {
			// validate the current page
			if ($(this).validatePage(curpage)) { 
				curpage++;
	
				if (curpage > settings.pages.length) {
					// submit!
					$(this).submit();
					 curpage = settings.pages.length;
					 return false;
				}
				$(this).gotopage(curpage);
			}
			return false;
		
	};

	jQuery.fn.disablePage = function(page) {
		page=page-1;
		if (settings.pages[page] !== undefined) {
			settings.pages.splice(page,1); //remove page
			$(this).generateNavigationSection(true);
		}
	};

	jQuery.fn.enablePage = function(page) {
		page=page-1;
		if (settings.pages[page] === undefined) {
			settings.pages.splice(page,0,pageStore[page]); // re-add the page from the pageStore
			$(this).generateNavigationSection(true);
		}
		
	};
	
	jQuery.fn.getPages = function() {
		return settings.pages;
	};
		
	jQuery.fn.prevpage = function() {

		curpage--;

		if (curpage < 1) {
			 curpage = 1;
		}
		$(this).gotopage(curpage);
		return false;
		
	};
	
	jQuery.fn.generateNavigationSection = function(regen) {
		if (settings.generateNavigation) { 
			if (settings.navigationFunction) { 
				settings.navigationFunction($(this).getPages());
			} else {
				
	            var id_name = $(this).attr('id');
	            if (regen) {
	            	$('#'+id_name+'_nav').remove(); //remove existing nav
	            }
	            // insert navigation
	            $('<div class="multipage_nav" id="'+id_name+'_nav"><a href="#" class="multipage_back '+settings.navButtonClasses+'" onclick="return  $(\''+id+'\').prevpage();">Back</a><a href="#"  class="multipage_next '+settings.navButtonClasses+'" onclick="return $(\''+id+'\').nextpage();">Next</a><span class="multipage_state"></span><div class="clearer"></div></div>').insertAfter(this);

	            if (regen) {
	            	$(this).gotopage(curpage); //reinit page state
	        	}
			}
		}
	};
	
	jQuery.fn.multipage = function(options) { 
		settings = jQuery.extend({
				stayLinkable:false,
				submitLabel:'Submit',
				nextLabel:'Next',
				backLabel:'Back',
				hideLegend:false,
				hideSubmit:true,
				generateNavigation:true,
				navButtonClasses:'',
				activeDot:'&nbsp;&#x25CF;',
				inactiveDot:'&nbsp;&middot;'
			},options);

		id = '#' + $(this).attr('id');
		var form = $(this);			
		
		form.addClass('multipage');
		
		form.submit(function(e) {
			if (!$(this).validateAll()) {
				e.preventDefault();
			}
		});
		
		// hide all the pages 
		$(id +' fieldset').hide();
			if (settings.hideSubmit) { 
				$(id+' *[type="submit"]').hide();
			}

			submitVal = $(id+' *[type="submit"]').val();
			if (submitVal && submitVal!='') {
				settings.submitLabel = submitVal;
			}
			
			settings.pages = new Array();
			
			$(this).children('fieldset').each(function(index) { 
				label = $(this).children('legend').html();
				objPage = {number:index+1,title:label,id:$(this).attr('id')};
				settings.pages[index] = objPage;
				pageStore[index] = objPage;
			});

			
			if (settings.hideLegend) { 
				// hide legend tags
				$(id+' fieldset legend').hide();
			}
			
			// show the first page.
			$(id+' fieldset:first').addClass('active');

			$(id+' fieldset:first').show();
									
			$(this).generateNavigationSection();
						
			if (document.location.hash) { 
				$(this).gotopage('#'+document.location.hash.substring(1,document.location.hash.length));
			} else {
				$(this).gotopage(1);			
			}	
			return false;
		
		};
		

})(jQuery);

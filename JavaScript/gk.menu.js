window.addEvent('load', function() {	
    // Classic menu
    if(document.getElement('.gkMainMenu')) {
        // fix for the iOS devices     
        document.getElements('.gkMainMenu ul li span').each(function(el) {
            el.setProperty('onmouseover', '');
        });

        document.getElements('.gkMainMenu ul li a').each(function(el) {
            el.setProperty('onmouseover', '');

            if(el.getParent().hasClass('haschild') && document.getElement('body').getProperty('data-tablet') != null) {
                el.addEvent('click', function(e) {
                    if(el.retrieve("dblclick", 0) === 0) {
                        e.stop();
                        el.store("dblclick", new Date().getTime());
                    } else {
                    	if(el.getParent().getElements('div.childcontent')[0].getStyle('overflow') == 'visible') {
                    		window.location = el.getProperty('href');
                    	}
                        var now = new Date().getTime();
                        if(now - el.retrieve("dblclick", 0) < 500) {
                            window.location = el.getProperty('href');
                        } else {
                            e.stop();
                            el.store("dblclick", new Date().getTime());
                        }
                    }
                });
            }
        });

        var bases = document.getElements('.gkMainMenu');
        
        bases.each(function(base, j) {
	        base.getElements('.childcontent-inner').each(function(submenu, i) {
	        	var cols = submenu.getChildren('.gkcol');
	        	
	        	if(cols.length > 1) {
	        		var max = cols[0].getSize().y;
	        		
	        		for(var i = 0; i < cols.length; i++) {
	        			max = cols[i].getSize().y > max ? cols[i].getSize().y : max;
	        		}
	        		
	        		cols.setStyle('height', max + "px");
	        	}
	        });
	
	        if($GKMenu && ($GKMenu.height || $GKMenu.width)) {     
	            var gk_selector = 'li.haschild';
	            base.getElements(gk_selector).each(function(el){     
	                if(el.getElement('.childcontent')) {
	                    var content = el.getElement('.childcontent');
	                    var prevh = content.getSize().y;
	                    var prevw = content.getSize().x;
	                    // hide the menu till opened
	                    if(content.getParent().getParent().hasClass('level0')) {
	                    	content.setStyle('margin-left', "-999px");
	                    }
	
	                    var fxStart = { 'height' : $GKMenu.height ? 0 : prevh, 'width' : $GKMenu.width ? 0 : prevw, 'opacity' : 0 };
	                    var fxEnd = { 'height' : prevh, 'width' : prevw, 'opacity' : 1 };
	
	                    var fx = new Fx.Morph(content, {
	                        duration: $GKMenu.duration,
	                        link: 'cancel',
	                        onComplete: function() {
	                            if(content.getSize().y == 0){
	                                content.setStyle('overflow', 'hidden');
	                            } else if(content.getSize().y - prevh < 30 && content.getSize().y - prevh >= 0) {
	                                content.setStyle('overflow', 'visible');
	                            }
	                        }
	                    });
	
	                    fx.set(fxStart);
	                    content.setStyles({'left' : 'auto', 'overflow' : 'hidden' });
	
	                    el.addEvents({
	                        'mouseenter': function(){
	                            var content = el.getElement('.childcontent');
								var basicMargin = 0;
								
								content.addClass('active');
	
								// helper variables
	                            var pos = content.getCoordinates();
	                            var winWidth = window.getCoordinates().width;
	                            var winScroll = window.getScroll().x;
	
								// calculations
								var posStart = pos.left;
								var posEnd = pos.left + prevw;
	
								if(el.getParent().hasClass('level0')) {
									content.setStyle('margin-left', basicMargin + "px");
									pos = content.getCoordinates();
									posStart = pos.left;
									posEnd = pos.left + prevw;
	
									if(posStart < 0) {
										content.setStyle('margin-left', content.getStyle('margin-left').toInt() + (-1 * posStart) + 10);
									}
	
									if(posEnd > winWidth + winScroll) {
										var diff = (winWidth + winScroll) - posEnd;
										content.setStyle('margin-left', content.getStyle('margin-left').toInt() + diff - 24);
									}
								} else {
									var diff = (winWidth + winScroll) - posEnd;
	
									if(posEnd > winWidth + winScroll) {
										content.setStyle('margin-left', "-160px");
									}
								}
	
	                            fx.start(fxEnd);
	                        },
	
	                        'mouseleave': function(){
	                            content.setStyle('overflow', 'hidden');
	                            content.removeClass('active');
	                            fx.start(fxStart);
	                        }
	                    });
	                }
	            });
	        }
        });
    }
    
    // Aside menu
    if(document.id('aside-menu')) {
    	var staticToggler = document.id('static-aside-menu-toggler');
    	
    	staticToggler.addEvent('click', function() {
    		gkOpenAsideMenu();
    	});
    	
    	document.id('close-menu').addEvent('click', function() {
    		document.id('close-menu').toggleClass('menu-open');
    		document.id('gkBg').toggleClass('menu-open');
    		document.id('aside-menu').toggleClass('menu-open');
    	});
    }
    // detect android browser
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1 && !window.chrome;
    
    if(isAndroid) {
    	document.body.addClass('android-stock-browser')
    }
    // Android stock browser fix for the aside menu
    if(document.getElement('body').hasClass('android-stock-browser') && document.id('aside-menu')) {
    	document.id('static-aside-menu-toggler').addEvent('click', function() {
    		window.scrollTo(0, 0);
    	});
    	// menu dimensions
    	var asideMenu = document.id('aside-menu');
    	var menuHeight = document.id('aside-menu').getSize().y;
    	//
    	window.addEvent('scroll', function(e) {
    		if(asideMenu.hasClass('menu-open')) {
	    		// get the necessary values and positions
	    		var currentPosition = window.getScroll().y;
	    		var windowHeight = window.getSize().y;

    			// compare the values
	    		if(currentPosition > menuHeight - windowHeight) {
	    			document.id('close-menu').fireEvent('click');
	    		}
    		}
    	});
    }
    
    function gkOpenAsideMenu() {
    	document.id('gkBg').toggleClass('menu-open');
    	document.id('aside-menu').toggleClass('menu-open');
    
    	if(!document.id('close-menu').hasClass('menu-open')) {
    		setTimeout(function() {
    			document.id('close-menu').toggleClass('menu-open');
    		}, 300);
    	} else {
    		document.id('close-menu').removeClass('menu-open');
    	}
    }
}); 
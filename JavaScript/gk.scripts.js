// IE checker
function gkIsIE() {
	var myNav = navigator.userAgent.toLowerCase();
	return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}
// Google maps function
var gkMapInitialize = function() {
  var maps = document.getElements('.gk-map');
  var mapCenters = [];
  var mapAreas = [];
  
  maps.each(function(map, i) {
	  mapCenters[i] = new google.maps.LatLng(0.0, 0.0);
	  
	  if(map.getProperty('data-latitude') && map.getProperty('data-longitude')) {
	  	mapCenters[i] = new google.maps.LatLng(
				  		parseFloat(map.getProperty('data-latitude')), 
				  		parseFloat(map.getProperty('data-longitude'))
				  	);
	  }
	  
	  var mapOptions = {
	    zoom: parseInt(map.getProperty('data-zoom'), 10) || 12,
	    center: mapCenters[i],
	    panControl: map.getProperty('data-ui') == 'yes' ? true : false,
	    zoomControl: map.getProperty('data-ui') == 'yes' ? true : false,
	    scaleControl: map.getProperty('data-ui') == 'yes' ? true : false,
	    disableDefaultUI: map.getProperty('data-ui') == 'yes' ? false : true,
	    mapTypeControl: map.getProperty('data-ui') == 'yes' ? true : false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER
        }
	  };
	
	  mapAreas[i] = new google.maps.Map(map, mapOptions);
	  var link = new Element('a', { 'class': 'gk-map-close' });
	  link.inject(map, 'after');
	  // custom events for the full-screen display
	  var marker = null;
	  map.addEvent('displaybigmap', function() {
	  	marker = new google.maps.Marker({
	  	   position: mapCenters[i],
	  	   map: mapAreas[i],
	  	   animation: google.maps.Animation.DROP
	  	});
	  	
	  	setTimeout(function() {
	  		google.maps.event.trigger(mapAreas[i], 'resize');
	  	}, 300);
	  	
	  	mapAreas[i].setCenter(mapCenters[i]);
	  });
	  
	  if(maps[i].hasClass('static')) {
	  	marker = new google.maps.Marker({
	  	   position: mapCenters[i],
	  	   map: mapAreas[i],
	  	   animation: google.maps.Animation.DROP
	  	});
	  }
	  
	  map.addEvent('hidebigmap', function() {
	  	if(marker) {
	  		marker.setMap(null);
	  	}
	  });
  });
  
  window.addEvent('resize', function() {
  	mapAreas.each(function(map, i) {
  		map.setCenter(mapCenters[i]);
  	});
  });
};
//
var page_loaded = false;
//
window.addEvent('load', function() {
	//
	page_loaded = true;
	// smooth anchor scrolling
	new SmoothScroll(); 
	// style area
	if(document.id('gkStyleArea')){
		document.id('gkStyleArea').getElements('a').each(function(element,i){
			element.addEvent('click',function(e){
	            e.stop();
				changeStyle(i+1);
			});
		});
	}
	// K2 font-size switcher fix
	if(document.id('fontIncrease') && document.getElement('.itemIntroText')) {
		document.id('fontIncrease').addEvent('click', function() {
			document.getElement('.itemIntroText').set('class', 'itemIntroText largerFontSize');
		});
		
		document.id('fontDecrease').addEvent('click', function() {
			document.getElement('.itemIntroText').set('class', 'itemIntroText smallerFontSize');
		});
	}
	// Google Maps loading
	var loadScript = function() {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
	      'callback=gkMapInitialize';
		document.body.appendChild(script);
	};
	
	if(document.getElement('.gk-map')) {
		loadScript();
	}
	// Locate effect
	var locate_buttons = document.getElements('.gk-locate');
	
	locate_buttons.each(function(button, i) {
		var wrapper = button.getParent('.box');
		
		button.addEvent('click', function(e) {
			e.preventDefault();
			
			wrapper.getElement('.header').addClass('hide');
			wrapper.getElement('.gk-over-map').addClass('hide');
			wrapper.addClass('hide');
			
			var map = wrapper.getElement('.gk-map');
			
			setTimeout(function() {
				var coordinates = map.getCoordinates();
				var scroll = window.getScroll();
				var window_size = window.getSize();
				var top_margin = (-1 * (coordinates.top - scroll.y));
				var bottom_margin = (-1 * (window_size.y - (coordinates.top + coordinates.height - scroll.y)));
				
				setTimeout(function() {
					map.setStyle('z-index', '1000000');
					map.setStyles({
						'height': window_size.y + "px",
						'margin-top': top_margin + "px",
						'margin-bottom': bottom_margin + "px"
					});
					
					map.fireEvent('displaybigmap');
					
					setTimeout(function() {
						var close_button = wrapper.getElement('.gk-map-close');
						close_button.addClass('active');
						
						if(!close_button.hasClass('has-events')) {
							close_button.addEvent('click', function(e) {
								e.preventDefault();
								map.setStyles({
									'height': wrapper.getSize().y + "px",
									'margin-top': "0px",
									'margin-bottom': "0px"
								});
								
								close_button.removeClass('active');
								
								setTimeout(function() {
									map.setStyle('z-index', '0');
									map.fireEvent('hidebigmap');
									
									setTimeout(function() {
										wrapper.removeClass('hide');
									}, 50);
									
									setTimeout(function() {
										wrapper.getElement('.header').removeClass('hide');
										wrapper.getElement('.gk-over-map').removeClass('hide');
									}, 300);
								}, 300);
							});
							close_button.addClass('has-events');
						}
					}, 500);
				}, 500);
			}, 0);
		});
	});
	
	// Testimonials
	var testimonials = document.getElements('.gk-testimonials');
	
	testimonials.each(function(wrapper, i) {
		var amount = wrapper.getProperty('data-amount');
		var testimonial_prev = new Element('a', { 'class': 'gk-testimonials-prev' });
		var testimonial_next = new Element('a', { 'class': 'gk-testimonials-next' });
		var testimonial_pagination = new Element('ul', { 'class': 'gk-testimonials-pagination' });
		var quotes = wrapper.getElements('blockquote');
		var current_page = 0;
		var sliding_wrapper = wrapper.getElement('div div');
		
		for(var j = 0; j < amount; j++) {
			testimonial_pagination.innerHTML += '<li' + (j == 0 ? ' class="active"' : '') + '>' + (j+1) + '</li>';
		}
		testimonial_prev.inject(wrapper, 'bottom');
		testimonial_next.inject(wrapper, 'bottom');
		testimonial_pagination.inject(wrapper, 'bottom');
		var pages = testimonial_pagination.getElements('li');
		// hide quotes
		quotes.each(function(quote, i) {
			if(i > 0) {
				quote.addClass('hidden');
			}
		});
		// navigation
		testimonial_prev.addEvent('click', function(e) {
			e.preventDefault();
			
			quotes[current_page].addClass('hidden');
			current_page = (current_page > 0) ? current_page - 1 : pages.length - 1;
			quotes[current_page].removeClass('hidden');
			pages.removeClass('active');
			pages[current_page].addClass('active');
			sliding_wrapper.setStyle('margin-left', -1 * (current_page * 100) + "%")
		});
		
		testimonial_next.addEvent('click', function(e) {
			e.preventDefault();
			
			quotes[current_page].addClass('hidden');
			current_page = (current_page < pages.length - 1) ? current_page + 1 : 0;
			quotes[current_page].removeClass('hidden');
			pages.removeClass('active');
			pages[current_page].addClass('active');
			sliding_wrapper.setStyle('margin-left', -1 * (current_page * 100) + "%");
		});
		
		pages.each(function(page, i) {
			page.addEvent('click', function() {
				quotes[current_page].addClass('hidden');
				current_page = i;
				quotes[current_page].removeClass('hidden');
				pages.removeClass('active');
				pages[current_page].addClass('active');
				sliding_wrapper.setStyle('margin-left', -1 * (current_page * 100) + "%");	
			});
		});
	});
	
	// Form validation
	var contact_forms = document.getElements('.gkContactForm');
	var reservation_forms = document.getElements('.gkReservationForm');
	
	var forms = [
					contact_forms,
					reservation_forms
				];
	
	if(contact_forms || reservation_forms) {
		forms.each(function(set) {
			set.each(function(form) {
				var inputs = form.getElements('.required');
				var submit = form.getElement('.submit');
				
				inputs.each(function(input) {
					input.addEvent('focus', function() {
						if(input.hasClass('invalid-input')) {
							input.removeClass('invalid-input');
						}
					});
				});
				
				submit.addEvent('click', function(e) {
					e.preventDefault();
					
					var valid = true;
					
					inputs.each(function(input) {
						if(input.get('value') == '') {
							valid = false;
							input.addClass('invalid-input');
						}
					});
					
					if(valid) {
						submit.getParent('form').submit();
					}
				});
			});
		});
	}
	
	// Gallery popups
	var photos = document.getElements('.gk-photo');
	
	if(photos) {
		// photos collection
		var collection = [];
		// create overlay elements
		var overlay = new Element('div', { 'class': 'gk-photo-overlay' });
		var overlay_prev = new Element('a', { 'class': 'gk-photo-overlay-prev' });
		var overlay_next = new Element('a', { 'class': 'gk-photo-overlay-next' });
		// put the element
		overlay.inject(document.body, 'bottom');
		// add events
		overlay.addEvent('click', function() {
			var img = overlay.getElement('img');
			if(img) img.dispose();
			overlay.removeClass('active');
			overlay_prev.removeClass('active');
			overlay_next.removeClass('active');
			setTimeout(function() {
				overlay.setStyle('display', 'none');
			}, 300);
		});
		// prepare links
		photos.each(function(photo, j) {
			var link = photo.getElement('a');
			collection.push(link.getProperty('href'));
			link.addEvent('click', function(e) {
				e.preventDefault();
				overlay.setStyle('display', 'block');
				
				setTimeout(function() {
					overlay.addClass('active');
					
					setTimeout(function() {
						overlay_prev.addClass('active');
						overlay_next.addClass('active');
					}, 300);
					
					var img = new Element('img', { 'class': 'loading' });
					img.onload = function() {
						img.removeClass('loading');
					};
					img.setProperty('src', link.getProperty('href'));
					img.inject(overlay, 'top');
				}, 50);
			});
		});
		// if collection is bigger than one photo
		if(collection.length > 1) {
			overlay_prev.inject(overlay, 'bottom');
			overlay_next.inject(overlay, 'bottom');
			
			overlay_prev.addEvent('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				var img = overlay.getElement('img');
				if(!img.hasClass('loading')) {
					img.addClass('loading');
				}
				setTimeout(function() {
					var current_img = img.getProperty('src');
					var id = collection.indexOf(current_img);
					var new_img = collection[(id > 0) ? id - 1 : collection.length - 1];
					img.setProperty('src', new_img);
				}, 300);
			});
			
			overlay_next.addEvent('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				var img = overlay.getElement('img');
				if(!img.hasClass('loading')) {
					img.addClass('loading');
				}
				setTimeout(function() {
					var current_img = img.getProperty('src');
					var id = collection.indexOf(current_img);
					var new_img = collection[(id < collection.length - 1) ? id + 1 : 0];
					img.setProperty('src', new_img);
				}, 300);
			});
		}
	}
});

window.addEvent('domready', function() {
	if(document.id('gkHeaderNav') && !document.id('gkHeaderNav').hasClass('active')) {		
		window.addEvent('scroll', function() {
			var currentPosition = window.getScroll().y;

			if(
				currentPosition >= document.id('gkHeader').getSize().y && 
				!document.id('gkHeaderNav').hasClass('active')
			) {
				document.id('gkHeaderNav').addClass('active');
			} else if(
				currentPosition < document.id('gkHeader').getSize().y && 
				document.id('gkHeaderNav').hasClass('active')
			) {
				document.id('gkHeaderNav').removeClass('active');
			}
		});
	}
	// Scroll effects 
	var frontpage_header = document.id('gkHeader');
	var frontpage_module = document.id('gkHeaderMod');
	
	if(
		document.body.hasClass('frontpage') && 
		frontpage_header && 
		window.getSize().x > 720
	) {
		window.addEvent('scroll', function() {	
			var win_scroll = window.getScroll().y;
			var header_height = frontpage_header.getSize().y;
			
			if(win_scroll < header_height) {
				animate_header(win_scroll, header_height);	
			}
		});
		
		var animate_header = function(win_scroll, header_height) {
			var result = (win_scroll / header_height) * 0.75;
			frontpage_module.setStyle('background', 'rgba(0, 0, 0, ' + (result) + ')');
		};
	}
});

// function to set cookie
function setCookie(c_name, value, expire) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expire);
	document.cookie=c_name+ "=" +escape(value) + ((expire==null) ? "" : ";expires=" + exdate.toUTCString());
}
// Function to change styles
function changeStyle(style){
	var file1 = $GK_TMPL_URL+'/css/style'+style+'.css';
	var file2 = $GK_TMPL_URL+'/css/typography/typography.style'+style+'.css';
	new Asset.css(file1);
	new Asset.css(file2);
	Cookie.write('gk_steakhouse_j25_style', style, { duration:365, path: '/' });
}

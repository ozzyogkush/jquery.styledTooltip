/**
 * jQuery Tooltip Replacement Widget Plugin - StyledToolTip
 * ========================================================
 *
 * This is a widget replacement plugin that generates stylized tooltip popup
 * messages and shows or hides them based on an event that the user specifies.
 * 
 * This version does not support retrieving AJAX content.
 * 
 * Cross-platform Compatibility
 * ----------------------------
 * 
 * * Firefox 4+
 * * Webkit (Google Chrome, Apple's Safari)
 * * Internet Explorer 8+
 * * Opera
 * 
 * Requirements
 * ------------
 * 
 * * jQuery 1.7.0+
 * 
 * Feature Overview
 * ----------------
 * 
 * * Include optional header content
 * * Specify rounded corners
 * * Easily override styles for your own themes
 * * Anchor from 12 points - 3 on each side (top, middle, bottom, left, middle, right)
 * 
 * Usage
 * =====
 *
 * Call the MakeStyledToolTip() function on your selected element(s) with your
 * options, and the elements will be created and ready to go. You can trigger it
 * manually by again calling MakeStyledToolTip() and passing the 'show' command,
 * or hide it by passing the 'hide' command.
 * 
 * ####Required options:
 * * image\_base					location of directory where images are located
 * 
 * ####Exposed methods:
 * * show
 * * hide
 * * enable
 * * disable
 *
 * @example		See example.html
 * @class		StyledToolTip
 * @name		StyledToolTip
 * @version		0.1
 * @author		Derek Rosenzweig <derek.rosenzweig@gmail.com, drosenzweig@riccagroup.com>
 */
(function($) {
	
	/**
	 * The helper class whose objects hold the constructed elements and references for
	 * each individual original element matched by the user's selector.
	 *
	 * @access		public
	 * @since		0.1
	 */
	function StyledToolTip() {
		
		/**
		 * The jQuery extended object containing the original element matched
		 * by the user's selector.
		 *
		 * @access		public
		 * @type		jQuery
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 * @default		null
		 */
		this.tooltip_target_element = null;
		
		/**
		 * The jQuery extended object containing the newly constructed tooltip
		 * element container. This is the element that gets added to, or removed
		 * from, the DOM.
		 *
		 * @access		public
		 * @type		jQuery
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 * @default		null
		 */
		this.styled_tooltip_element = null;
		
		/**
		 * The jQuery extended object containing the arrow <img> element that
		 * points towards the 'tooltip_target_element' element.
		 *
		 * @access		public
		 * @type		jQuery
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 * @default		null
		 */
		this.styled_tooltip_arrow_element = null;
		
		/**
		 * The jQuery extended object containing a <div> element container that
		 * holds this tooltip's header content.
		 *
		 * @access		public
		 * @type		jQuery
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 * @default		null
		 */
		this.styled_tooltip_header_element = null;
		
		/**
		 * The jQuery extended object containing a <div> element container that
		 * holds this tooltip's main content.
		 *
		 * @access		public
		 * @type		jQuery
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 * @default		null
		 */
		this.styled_tooltip_content_element = null;
		
		/**
		 * Contains a list of supported values for the 'gravity' option. Gravity
		 * is the direction the arrow points.
		 *
		 * @access		public
		 * @type		Array
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 * @default		null
		 */
		this.valid_gravity_values = ['n', 'ne', 'nw',
									 's', 'se', 'sw',
									 'e', 'en', 'es',
									 'w', 'wn', 'ws'];
		
		/**
		 * The actual final set of extended options that will be used in creating
		 * the StyledToolTip widget.
		 *
		 * @access		public
		 * @type		Object
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 */
		this.options = {};
		
		//--------------------------------------------------------------------------
		//
		//  Methods
		//
		//--------------------------------------------------------------------------
		
		/**
		 * Initializes the StyledToolTip widget. Generates the elements (arrow,
		 * header, and content), applies classes, and adds event handlers.
		 *
		 * If the required options are not present, throws an exception.
		 *
		 * @access		public
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 *
		 * @param		original_element				jQuery				jQuery extended element to which the tooltip will point
		 * @param		options							Object				The actual final set of extended options that will be used in creating
		 * 																		the replacement StyledToolTip widget.
		 */
		this.initTooltip = function(original_element, options) {
			this.options = options;
			
			this.tooltip_target_element = $(original_element);
			
			//var js_src_loc = $('script[src*=jquery.styledTooltip]').attr('src');
			//this.plugin_directory = js_src_loc.replace(/\/js\/jquery\.styledTooltip\.js/, '/');
			
			this.styled_tooltip_element = $('<div></div>')
				.attr({'data-styled-tooltip':'container'});
			
			if (this.options.class_name != null) {
				this.styled_tooltip_element.addClass(this.options.class_name);
			}
			
			if (this.options.rounded_corners) {
				this.styled_tooltip_element.addClass('rounded');
			}
			
			if ($.inArray(this.options.gravity, this.valid_gravity_values) == -1) {
				this.options.gravity = 'n';
			}
			
			// Add the arrow elements...
			this.addArrow();
			
			// ...add the header, if there is one...
			this.addTooltipHeader();
			
			// ...add the content...
			this.addTooltipContent();
			
			// ...and set up the event handlers.
			this.tooltip_target_element
				.on('click.styledTooltip', $.proxy(this.clickEventHandler, this))
				.on('mouseenter.styledTooltip', $.proxy(this.mouseEnterEventHandler, this))
				.on('mouseleave.styledTooltip', $.proxy(this.mouseLeaveEventHandler, this));
				
			// If the 'auto_show' option is set to true, then show the tooltip widget.
			if (this.options.enabled && this.options.auto_show) {
				this.show();
			}
		}
		
		/**
		 * Generates the arrow <div> element and adds it to the widget.
		 * 
		 * @see			StyledToolTip.styled_tooltip_arrow_element
		 * @access		public
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 */
		this.addArrow = function() {
			var arrow_img = $('<img />');
			var arrow_src = this.options.image_base+'/';
			
			var arrow_attrs = {};
			var arrow_css_vals = {};
			var arrow_element_css_vals = {};
			switch (this.options.gravity) {
				case 'n':
				case 'ne':
				case 'nw':
					arrow_src += 'tooltip-top-point-16x14px.png';
					arrow_attrs.width = 16;
					arrow_attrs.height = 14;
					arrow_css_vals = {width:'16px', height:'14px'};
					arrow_element_css_vals.top = '-14px';
					break;
				case 's':
				case 'se':
				case 'sw':
					arrow_src += 'tooltip-bottom-point-16x14px.png';
					arrow_attrs.width = 16;
					arrow_attrs.height = 14;
					arrow_css_vals = {width:'16px', height:'14px'};
					break;
				case 'wn':
					arrow_src += 'tooltip-left-point-dark-green-14x16px.png';
					arrow_attrs.width = 14;
					arrow_attrs.height = 16;
					arrow_css_vals = {width:'14px', height:'16px'};
					arrow_element_css_vals.left = '-14px';
					break;
				case 'w':
				case 'ws':
					arrow_src += 'tooltip-left-point-14x16px.png';
					arrow_attrs.width = 14;
					arrow_attrs.height = 16;
					arrow_css_vals = {width:'14px', height:'16px'};
					arrow_element_css_vals.left = '-14px';
					break;
				case 'en':
					arrow_src += 'tooltip-right-point-dark-green-14x16px.png';
					arrow_attrs.width = 14;
					arrow_attrs.height = 16;
					arrow_css_vals = {width:'14px', height:'16px'};
					arrow_element_css_vals.right = '-14px';
					break;
				case 'e':
				case 'es':
					arrow_src += 'tooltip-right-point-14x16px.png';
					arrow_attrs.width = 14;
					arrow_attrs.height = 16;
					arrow_css_vals = {width:'14px', height:'16px'};
					arrow_element_css_vals.right = '-14px';
					break;
			}
			arrow_attrs.src = arrow_src;
			arrow_img.attr(arrow_attrs).css(arrow_css_vals);
			
			this.styled_tooltip_arrow_element = $('<div></div>')
				.attr({'data-styled-tooltip':'arrow', 'data-styled-tooltip-gravity':this.options.gravity})
				.css(arrow_element_css_vals)
				.append(arrow_img);
			
			this.styled_tooltip_element.append(this.styled_tooltip_arrow_element);
		}
		
		/**
		 * Generates the header <div> element, populates it with the supplied
		 * content, and adds it to the widget, but only if the supplied header
		 * content is not null.
		 * 
		 * @see			StyledToolTip.styled_tooltip_header_element
		 * @access		public
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 */
		this.addTooltipHeader = function() {
			if (this.options.header_content != null) {
				this.styled_tooltip_header_element = $('<div></div>')
					.attr({'data-styled-tooltip':'header'})
					.append(this.options.header_content);
					
				this.styled_tooltip_element.append(this.styled_tooltip_header_element);
			}
		}
		
		/**
		 * Generates the content <div> element, populates it with the supplied
		 * content, and adds it to the widget, but only if the supplied content
		 * is not null.
		 * 
		 * @see			StyledToolTip.styled_tooltip_content_element
		 * @access		public
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 */
		this.addTooltipContent = function() {
			if (this.options.content != null) {
				this.styled_tooltip_content_element = $('<div></div>')
					.attr({'data-styled-tooltip':'content'})
					.append(this.options.content);
				
				this.styled_tooltip_element.append(this.styled_tooltip_content_element);
			}
		}
		
		/**
		 * Handles resizing the tooltip.
		 * 
		 * @access		public
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 */
		this.sizeTooltip = function() {
			
		}
		
		/**
		 * Handles positioning the tooltip widget relative to the target based
		 * on the gravity direction specified.
		 *
		 * @see			StyledToolTip.tooltip_target_element
		 * @access		public
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 */
		this.positionTooltipRelativeToTarget = function() {
			var target_position = this.tooltip_target_element.offset();
			var target_size = {
				height : this.tooltip_target_element.outerHeight(),
				width : this.tooltip_target_element.outerWidth()
			};
			
			var arrow_img = this.styled_tooltip_arrow_element.find('img');
			var arrow_position = arrow_img.position();
			var arrow_size = {
				height : arrow_img.outerHeight(),
				width : arrow_img.outerWidth()
			};
			
			var tooltip_size = {
				height : this.styled_tooltip_element.outerHeight(),
				width : this.styled_tooltip_element.outerWidth()
			};
			var tooltip_position = {};
			
			// A useful array of computed values
			var target_tip_source_points = {
				horizontal_left : target_position.left,
				horizontal_center : target_position.left + (target_size.width / 2),
				horizontal_right : target_position.left + target_size.width,
				vertical_top : target_position.top,
				vertical_middle : target_position.top + (target_size.height / 2),
				vertical_bottom : target_position.top + target_size.height
			};
			
			// Actually determine where the tooltip should be positioned so that
			// the arrow is pointing to the target.
			switch (this.options.gravity) {
				case 'n':
					// NORTH - centered horizontally, below the target
					tooltip_position.left = target_tip_source_points.horizontal_center
											- (tooltip_size.width / 2);
					tooltip_position.top = target_tip_source_points.vertical_bottom
											+ arrow_size.height
											+ this.options.offset;
					break;
				case 's':
					// SOUTH - centered horizontally, above the target
					tooltip_position.left = target_tip_source_points.horizontal_center
											- (tooltip_size.width/2);
					tooltip_position.top = target_tip_source_points.vertical_top
											- tooltip_size.height
											- arrow_size.height
											+ this.options.offset;
					break;
				case 'w':
					// WEST - centered vertically, to the right of the target
					tooltip_position.left = target_tip_source_points.horizontal_right
											+ arrow_size.width
											+ this.options.offset;
					tooltip_position.top = target_tip_source_points.vertical_middle
											- (tooltip_size.height / 2);
					break;
				case 'e':
					// EAST - centered vertically, to the left of the target
					tooltip_position.left = target_tip_source_points.horizontal_left
											- tooltip_size.width
											- arrow_size.width
											+ this.options.offset;
					tooltip_position.top = target_tip_source_points.vertical_middle
											- (tooltip_size.height / 2);
					break;
				case 'nw':
					// NORTHWEST - centered horizontally but offset by the arrow position, below the target
					tooltip_position.left = target_tip_source_points.horizontal_center
											- (arrow_size.width / 2);
					tooltip_position.top = target_tip_source_points.vertical_bottom
											+ arrow_size.height
											+ this.options.offset;
					break;
				case 'ne':
					// NORTHEAST - centered horizontally but offset by the arrow position, below the target
					tooltip_position.left = target_tip_source_points.horizontal_center
											- tooltip_size.width
											+ (arrow_size.width / 2);
					tooltip_position.top = target_tip_source_points.vertical_bottom
											+ arrow_size.height
											+ this.options.offset;
					break;
				case 'sw':
					// SOUTHWEST - centered horizontally but offset by the arrow position, above the target
					tooltip_position.left = target_tip_source_points.horizontal_center
											- (arrow_size.width / 2);
					tooltip_position.top = target_tip_source_points.vertical_top
											- tooltip_size.height
											- arrow_size.height
											+ this.options.offset;
					break;
				case 'se':
					// SOUTHEAST - centered horizontally but offset by the arrow position, above the target
					tooltip_position.left = target_tip_source_points.horizontal_center
											- tooltip_size.width
											+ (arrow_size.width / 2);
					tooltip_position.top = target_tip_source_points.vertical_top
											- tooltip_size.height
											- (arrow_size.height / 2)
											+ this.options.offset;
					break;
				case 'ws':
					// WEST SOUTH - centered vertically but offset by the arrow position, to the right of the target
					tooltip_position.left = target_tip_source_points.horizontal_right
											+ arrow_size.width
											+ this.options.offset;
					tooltip_position.top = target_tip_source_points.vertical_middle
											- (tooltip_size.height - (arrow_size.height / 2));
					break;
				case 'es':
					// EAST SOUTH - centered vertically but offset by the arrow position, to the left of the target
					tooltip_position.left = target_tip_source_points.horizontal_left
											- tooltip_size.width
											- arrow_size.width
											+ this.options.offset;
					tooltip_position.top = target_tip_source_points.vertical_middle
											- (tooltip_size.height - (arrow_size.height / 2));
					break;
				case 'wn':
					// WEST NORTH - centered vertically but offset by the arrow position, to the right of the target
					tooltip_position.left = target_tip_source_points.horizontal_right
											+ arrow_size.width
											+ this.options.offset;
					tooltip_position.top = target_tip_source_points.vertical_middle
											- (arrow_size.height / 2);
					break;
				case 'en':
					// EAST NORTH - centered vertically but offset by the arrow position, to the left of the target
					tooltip_position.left = target_tip_source_points.horizontal_left
											- tooltip_size.width
											- arrow_size.width
											+ this.options.offset;
					tooltip_position.top = target_tip_source_points.vertical_middle
											- (arrow_size.height / 2);
					break;
			}
			
			if (this.options.debug) {
				console.log('MakeStyledToolTip - Tooltip details:');
				console.log(tooltip_position);
			}
			
			// Apply the new CSS position left/top values to the main widget container element
			this.styled_tooltip_element.css({
				left : tooltip_position.left+'px',
				top : tooltip_position.top+'px'
			});
		}
		
		/**
		 * If the 'styled_tooltip_element' container element is not already 
		 * added to the <body> element as a direct child, then this will
		 * size the tooltip widget, add it as a direct child, and position it
		 * relative to the 'tooltip_target_element' element.
		 * 
		 * @see			StyledToolTip.styled_tooltip_element
		 * @throws		StyledToolTip exception
		 * @access		public
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 */
		this.show = function() {
			if (this.styled_tooltip_element == null) {
				throw "MakeStyledToolTip: cannot show tooltip - tooltip does not exist";
			}
			
			if (! $.contains($('body').get(0), this.styled_tooltip_element.get(0))) {
				this.sizeTooltip();
				$('body').prepend(this.styled_tooltip_element);
				this.tooltip_target_element.attr({'data-styled-tooltip-target':'true'});
				this.positionTooltipRelativeToTarget();
			}
		}
		
		/**
		 * Removes the 'styled_tooltip_element' container element from the
		 * <body> element.
		 * 
		 * @see			StyledToolTip.styled_tooltip_element
		 * @access		public
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 */
		this.hide = function() {
			if (this.styled_tooltip_element != null) {
				this.styled_tooltip_element.remove();
				this.tooltip_target_element.removeAttr('data-styled-tooltip-target');
			}
		}
		
		/**
		 * Enable the widget. Sets the 'enabled' option flag to true, and if the
		 * 'auto_show' option is set to true, we also show the widget.
		 * 
		 * @access		public
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 */
		this.enable = function() {
			this.options.enabled = true;
			if (this.options.auto_show) {
				this.show();
			}
		}
		
		/**
		 * Disable the widget. Sets the 'enabled' option flag to false, and hides
		 * the widget.
		 * 
		 * @access		public
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 */
		this.disable = function() {
			this.options.enabled = false;
			this.hide();
		}
		
		/********* Event handlers *********/
		
		/**
		 * When the user moves the mouse over the target element, and the
		 * trigger event is 'mouseenter', this will show the tooltip widget.
		 *
		 * @access		public
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 *
		 * @param		event				jQuery.Event				jQuery 'mouseenter' event on the 'tooltip_target_element' element
		 */
		this.mouseEnterEventHandler = function(event) {
			if (this.options.trigger == 'mouseenter' && this.options.enabled) {
				this.show();
			}
		}
		
		/**
		 * When the user moves the mouse out of the target element, and the
		 * trigger event is 'mouseenter', this will hide the tooltip widget.
		 *
		 * @access		public
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 *
		 * @param		event				jQuery.Event				jQuery 'mouseleave' event on the 'tooltip_target_element' element
		 */
		this.mouseLeaveEventHandler = function(event) {
			if (this.options.trigger == 'mouseenter' && this.options.enabled) {
				this.hide();
			}
		}
		
		/**
		 * When the user clicks on the target element, and the trigger event
		 * is 'click', this will show or hide the tooltip widget based on
		 * whether it's already added to the DOM.
		 *
		 * @access		public
		 * @memberOf	StyledToolTip
		 * @since		0.1
		 *
		 * @param		event				jQuery.Event				jQuery 'click' event on the 'tooltip_target_element' element
		 */
		this.clickEventHandler = function(event) {
			if (this.options.trigger == 'click' && this.options.enabled) {
				if ($.contains($('body').get(0), this.styled_tooltip_element.get(0))) {
					this.hide();
				}
				else {
					this.show();
				}
			}
		}
	}
	
	/**
     * Constructor. Takes in a set of options or a method name and either
     * generates the tooltip for each element matched by the user's selector,
     * or attempts to trigger the method specified.
     *
     * @access		public
     * @memberOf	MakeStyledToolTip
     * @since		0.1
     * @throws		MakeStyledToolTip exception
     *
     * @param		options_or_method	mixed				An object containing various options, or a string containing a method name.
     * 															Valid method names: 'hide', 'show', 'enable', 'disable'
     *
     * @returns		this				jQuery				The jQuery element(s) being extended gets returned for chaining purposes
     */
	$.fn.MakeStyledToolTip = function(options_or_method) {
		//--------------------------------------------------------------------------
		//
		//  Variables and get/set functions
		//
		//--------------------------------------------------------------------------
		
		/**
		 * Default options for the widget. Overwrite by including individual
		 * options in the 'options' map object when extending the MakeStyledToolTip widget.
		 *
		 * @access		public
		 * @type		Object
		 * @memberOf	MakeStyledToolTip
		 * @since		0.1
		 */
		var default_options = {
			debug : false,						// Flag indicating whether to send debug info to the console. Default false.
			class_name : null,					// An additional CSS class that will be added to the widget. Default null.
			image_base : null,					// The location (relative to the page) of where images for this widget are stored. Default null.
			content : null,						// The HTML or text content that is added to the content container. Default null.
			header_content : null,				// The HTML or text content that is added to the header container. Default null.
			header_class_name : null,			// A class name that gets added to the header content container. Default null.
			gravity : 'n',						// The direction the arrow points. Default 'n'.
			trigger : 'mouseenter',				// The event type that will trigger showing/hiding the widget. Default 'mouseenter'.
			rounded_corners : true,				// Flag indicating whether the widget will have rounded corners (CSS3). Default true.
			offset : 0,							// The signed number of pixels away from the target in the direction of gravity. Default 0.
			enabled : true,						// Flag indicating whether the widget should be enabled. Default true.
			auto_show : false/*,					// Flag indicating whether the widget will automatically show after being created. Default false.
			fade : false*/
		};
		
		/**
		 * The actual final set of extended options that will be used in 
		 * creating the replacement MakeStyledToolTip widget.
		 *
		 * This will be stored on the replacement MakeStyledToolTip widget as 
		 * 'styled_tooltip' data for easy retrieval and use when the 
		 * 'options_or_method' var is a string indicating a function to be run.
		 *
		 * @access		public
		 * @type		Object
		 * @memberOf	MakeStyledToolTip
		 * @since		0.1
		 */
		var options = {};
		
		/********* Initialize the ... or call a specific function *********/
		if (typeof options_or_method == "string") {
			this.each(function(index, original_element) {
				var tooltip = $(original_element).data('styled_tooltip');
				if (tooltip == null) {
					throw "MakeStyledToolTip widget: tried to run operation '"+options_or_method+"' on a non-initialized StyledToolTip";
				}
				
				/* Call a specific function */
				if (options_or_method == 'show') {
					// Attempt to show the tooltip widget
					tooltip.show();
				}
				else if (options_or_method == 'hide') {
					// Attempt to hide the tooltip widget
					tooltip.hide();
				}
				else if (options_or_method == 'enable') {
					// Attempt to enable the tooltip
					tooltip.enable();
				}
				else if (options_or_method == 'disable') {
					// Attempt to disable the tooltip
					tooltip.disable();
				}
				else {
					// Bad method
					throw "MakeStyledToolTip widget: operation "+options_or_method+" does not exist";
				}
			});
		}
		else {
			// First extend the default options with the supplied ones...
			options = $.extend(default_options, options_or_method);
			
			if (options.debug == true) {
				console.log('MakeStyledToolTip - Debug is on. Initializing plugin...');
			}
			
			// ...and check for required options.
			if (options.image_base == null) {
				throw 'MakeStyledToolTip widget: no "image_base" option specified.';
				return this;
			}
			
			/* Initialize each element */
			this.each(function(index, original_element) {
				try {
					var tooltip = new StyledToolTip();
					tooltip.initTooltip(original_element, options);
					$(original_element).data('styled_tooltip', tooltip);
				} catch(exception) {
					if (options.debug == true) {
						console.log('MakeStyledToolTip - error: '+exception);
					}
				}
				
			});
		}
		
		/********* Return the newly extended element(s) for chaining *********/
		return this;
	}
})(jQuery);
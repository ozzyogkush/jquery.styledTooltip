jQuery Tooltip Replacement Widget Plugin - StyledToolTip
========================================================

This is a widget replacement plugin that generates stylized tooltip popup
messages and shows or hides them based on an event that the user specifies.

This version does not support retrieving AJAX content.

Cross-platform Compatibility
----------------------------

* Firefox 4+
* Webkit (Google Chrome, Apple's Safari)
* Internet Explorer 8+
* Opera

Requirements
------------

* jQuery 1.7.0+

Feature Overview
----------------

* Include optional header content
* Specify rounded corners
* Easily override styles for your own themes
* Anchor from 12 points - 3 on each side (top, middle, bottom, left, middle, right)

Usage
=====

Call the MakeStyledToolTip() function on your selected element(s) with your
options, and the elements will be created and ready to go. You can trigger it
manually by again calling MakeStyledToolTip() and passing the 'show' command,
or hide it by passing the 'hide' command.

####Required options:
* image\_base					location of directory where images are located

####Exposed methods:
* show
* hide
* enable
* disable

Example
-------
	<button id="show_all">Show All</button>  <button id="hide_all">Hide All</button>
	
	<div data-gravity="n" data-header="true">North w/header.</div>
	
	<div data-gravity="s" data-header="true">South w/header.</div>
	
	<div data-gravity="e" data-header="true">East w/header.</div>
	
	<div data-gravity="w">West w/out header.</div>
	
	<div data-gravity="nw" data-header="true">North West w/header.</div>
	
	<div data-gravity="ne" data-header="true">North East w/header.</div>
	
	<div data-gravity="sw" data-header="true">South West w/header.</div>
	
	<div data-gravity="se" data-header="true">South East w/header.</div>
	
	<div data-gravity="ws">West South w/out header.</div>
	
	<div data-gravity="es" data-header="true">East South w/header.</div>
	
	<div data-gravity="wn">West North w/out header.</div>
	
	<div data-gravity="en" data-header="true">East North w/header.</div>
	
	<script type='text/javascript'>
		$(document).ready(function() {
			$('div[data-gravity]').each(function(ti, div) {
				$(this).MakeStyledToolTip({
					debug : true,
					class_name : 'test-class',
					image_base : 'images',
					gravity:$(this).attr('data-gravity'),
					content : $('<div></div>').html($(this).html()),
					header_content : $(this).attr('data-header') != null ? $('<div></div>').html('HEADER') : null,
					trigger : 'click',
					rounded_corners : (ti % 2 == 1)
				});
			});
			
			$('button#show_all')
				.on('click', function() {
				$('div[data-gravity]').MakeStyledToolTip('show');
			});
			
			$('button#hide_all')
				.on('click', function() {
				$('div[data-gravity]').MakeStyledToolTip('hide');
			});
		});
	</script>
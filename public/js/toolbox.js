/**
 * Toolbox
 *
 * Misc helpers, utils, compat shims etc
 */
;(function(){
'use strict';

	window.Toolbox = {

		input: ('ontouchstart' in window) ? {
			CLICK: 'touchend',
			START: 'touchstart',
			END: 'touchend',
			MOVE: 'touchmove'
		} : {
			CLICK: 'click',
			START: 'mousedown',
			END: 'mouseup',
			MOVE: 'mousemove'
		},
		
		/**
		 * Simple Ajax helper
		 * @param  {object} options
		 */
		ajax: function(options){
			var defaults = {
				url: null,
				method: 'GET',
				success: function(){},
				error: function(){}
			},
			request;

			options = window.Toolbox.object.merge(defaults, options);

			request = new XMLHttpRequest();

			request.onreadystatechange = function(){
				if (request.readyState === 4){
					if (request.status === 200){
						options.success( JSON.parse(request.responseText) );
					}else{
						options.error();
					}
				}
			};

			request.open(options.method, options.url, true);
			request.send();
		},

		object: {
			/**
			 * Merge to objects
			 * @param  {object} a
			 * @param  {object} b
			 * @return {object}  Merged objects, b on top of a
			 */
			merge: function(a, b){
				var i, merged = window.Toolbox.object.clone(a);

				for (i in b){
					if (b.hasOwnProperty(i)){
						merged[i] = b[i];
					}
				}

				return merged;
			},
			/**
			 * Clone
			 * @param  {object} o
			 * @return {object}
			 */
			clone: function(o){
				var i, clone = {};

				for (i in o){
					if (o.hasOwnProperty(i)){
						if (typeof o[i] === 'object' && o[i] !== null){
							clone[i] = window.Toolbox.object.clone(o[i]);
						}else{
							clone[i] = o[i];
						}
					}
				}

				return clone;
			}
		},

		class: {
			has: function(el, className){
				if (el.className !== undefined){
					var rx = new RegExp(' ?' + className + ' ?');
					return rx.test(el.className);
				}
				return false;
			},
			add: function(el, className){
				if (el.className !== undefined){
					window.Toolbox.class.remove(el, className);
					el.className += ' ' + className;
				}
			},
			remove: function(el, className){
				if (el.className !== undefined){
					var rx = new RegExp(' ?' + className + ' ?', 'g');
					el.className = el.className.replace(rx, '');
				}
			}
		}
	};

})();
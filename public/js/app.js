/**
 * App script to create and handle menu
 */

/* global Toolbox */
;(function(){
'use strict';

	var nav = document.querySelector('nav'),
		overlay = document.querySelector('.overlay');


	function buildMenu(data, className){
		var i, ul, li, a;

		ul = document.createElement('ul');

		for (i in data){
			li = document.createElement('li');
			a = document.createElement('a');

			a.innerHTML = data[i].label;
			a.href = data[i].url;

			li.appendChild(a);

			if (data[i].items && data[i].items.length){
				li.appendChild( buildMenu(data[i].items) );
			}

			ul.appendChild(li);
		}

		return ul;
	}

	function loadMenuData(){
		Toolbox.ajax({
			url: '/api/nav.json',
			success: function(data){
				console.log(data);
				nav.appendChild( buildMenu(data.items, 'main-menu') );
			},
			error: function(){
				console.error('Whoops, something went wrong');
			}
		});
	}

	function closeMenus(){
		var i, items = nav.querySelectorAll('li');

		for (i in items){
			closeMenuItem(items[i]);
		}
		Toolbox.class.remove(document.body, 'menu-open');
	}

	function closeMenuItem(item){
		Toolbox.class.remove(item, 'open');
		Toolbox.class.remove(document.body, 'menu-open');
	}

	function openMenuItem(item){
		Toolbox.class.add(item, 'open');
		Toolbox.class.add(document.body, 'menu-open');
	}

	function toggleMenuItem(item){
		if (Toolbox.class.has(item, 'open')){
			closeMenuItem(item);
		}else{
			openMenuItem(item);
		}
	}

	function toggleHamburger(){
		if (Toolbox.class.has(document.body, 'hamburger-open')){
			Toolbox.class.remove(document.body, 'hamburger-open');
		}else{
			Toolbox.class.add(document.body, 'hamburger-open');
		}
	}

	function overlayClicked(e){
		if (Toolbox.class.has(document.body, 'hamburger-open')){
			toggleHamburger();
		}else{
			closeMenus();
		}
	}

	function menuItemClicked(e){
		var item = e.target,
			wasClosed = !Toolbox.class.has(item.parentNode, 'open'),
			hasSubmenu = item.parentNode.nodeName === 'LI' && item.parentNode.querySelector('ul');

		if (Toolbox.class.has(item, 'toggle-hamburger')){
			toggleHamburger();
			return false;
		}

		closeMenus();

		if (hasSubmenu){
			e.preventDefault();
			if (wasClosed){
				openMenuItem(item.parentNode);
			}
		}else{
			// let event propagate normally and/or link do its thing
		}
	}

	function addEventListeners(){
		nav.addEventListener(Toolbox.input.CLICK, menuItemClicked, true);
		overlay.addEventListener(Toolbox.input.CLICK, overlayClicked, true);
	}

	(function init(){
		loadMenuData();
		addEventListeners();
	})();

})();
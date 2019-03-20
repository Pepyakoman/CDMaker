const fs = require ('fs');
const url = require ('url');
const path = require ('path');
const {shell} = require ('electron');

let mainMenu = document.querySelector ('.b-menu');
let result = document.querySelector ('.b-result');

let regExp = /^\d+_(.*)/;

let menuMake = dir => {

	let dirContent;

	try {
		dirContent = fs.readdirSync (dir);
	} catch (e) {
		return '';
	}
	
	let fragment = document.createDocumentFragment();

	dirContent.map (item => {
		let expStr = regExp.exec (item);

		if (!expStr) return;

		let div = document.createElement ('div');
		div.classList.add ('b-menu__item');

		let link = dir + '/' + item;

		let a = document.createElement ('a');
		a.classList.add ('b-menu__item__anchor');
		a.href = link;
		a.textContent = expStr[1].replace (/_/g, ' ');

		div.append (a);
		div.append (menuMake (link));

		fragment.append (div);
	})

	return fragment;
}

let makeContent = content => {
	let dirContent;
	let container = document.createElement('div');

	try {
		dirContent = fs.readdirSync (content);
	} catch (e) {
		return '';
	}

	dirContent.map (item => {

		if (regExp.exec (item)) return;

		if (/main.txt|description.txt/.exec (item)) {
			
			let description = document.createElement ('div');
			description.textContent = fs.readFileSync (content + '/' + item, 'UTF-8');
			description.classList.add ('b-result__description');

			container.prepend (description);

		} else if (/.jpg|.jpeg|.png/.exec (item)) {

			let img = document.createElement ('img');
			img.src = content + '/' + item;
			img.classList.add ('b-result__img');

			container.append (img);

		} else {
			let a = document.createElement ('a');
			a.href = content + '/' + item;
			a.textContent = item;
			a.classList.add ('b-result__anchor');

			container.append (a);
		}
	})

	result.firstChild.replaceWith (container);
}

let follow = event => {
	event.preventDefault();

	let target;

	if (event.target.classList.contains ('b-menu__item__anchor')) {
		target = event.target;

	} else {
		target = event.target.querySelector ('.b-menu__item__anchor');
	}

	makeContent (target.getAttribute ('href'));
}

let openFile = event => {

	event.preventDefault();

	let target = event.target.closest ('.b-result__anchor');
	if (!target) return;

	shell.openItem (decodeURIComponent (path.normalize (url.parse (target.href).pathname).slice (1)));
}

mainMenu.append (menuMake ('../content'));
mainMenu.addEventListener ('click', follow);

result.addEventListener ('click', openFile);

makeContent ('../content');
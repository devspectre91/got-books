const url = `https://www.anapioficeandfire.com/api/books`;
let booksData = [];
let xhr = fetch(url);
let root = document.querySelector('.book-grid');
let modal = document.querySelector('.modal');
root.addEventListener('click', handleClick);
modal.addEventListener('click', handleClick);
let loader = document.getElementById('loader');
let modLoader = document.getElementById('mod-loader');
let modList = document.querySelector('.mod-list');

xhr.then((data) => {
	return data.json();
})
	.then((booksData) => {
		console.log(booksData);
		loader.style.display = 'none';
		buildUI(booksData);
	})
	.catch((error) => {
		loader.style.display = 'none';
		root.innerHTML = `<h2>Bad request: ${error} &#10060;</h2>`;
		root.classList.add('error');
		console.log(`Error ocurred! ${error}`);
	});

function buildUI(data) {
	booksData = data;
	root.innerHTML = '';
	booksData.forEach((e, i) => {
		let div = document.createElement('div');
		div.classList.add('box');
		let h2 = document.createElement('h2');
		h2.innerText = e.name;
		let h3 = document.createElement('h3');
		h3.innerText = e.authors[0];
		let a = document.createElement('a');
		a.innerText = `Show Characters (${e.characters.length})`;
		a.classList.add('anchor');
		a.setAttribute('id', i);
		div.append(h2, h3, a);
		root.append(div);
	});
}

function handleClick(e) {
	if (e.target.classList.value === 'anchor') {
		modal.style.display = 'block';
		modLoader.style.display = 'block';

		modList.innerHTML = '';
		let xhr = fetch(url);
		xhr.then((data) => {
			return data.json();
		})
			.then((booksData) => {
				return booksData[e.target.id];
				// console.log(booksData);
				// modLoader.style.display = 'none';
				// buildModal(booksData, e.target.id);
			})
			.then((book) => {
				return book.characters;
			})
			.then((characterArray) => {
				// console.log(characterArray);
				// return characterArray.map((characterUrl) => {
				// 	return fetch(characterUrl);
				// });
				let newArray = characterArray.map((character) => {
					return fetch(character).then((response) => response.json());
				});
				Promise.all(newArray).then((values) => {
					buildModal(values);
					//console.log(values);
				});
			})
			// .then((x) => {
			// 	Promise.all(x).then((values) => {
			// 		console.log(values);
			// 	});
			// })

			.catch((error) => {
				modLoader.style.display = 'none';
				modList.innerHTML = `<h2>Bad request: ${error} &#10060;</h2>`;
				modList.classList.add('error');
				console.log(`Error ocurred! ${error}`);
			});
	} else if (e.target.id == 'close') {
		modal.style.display = 'none';
	}
}

function buildModal(characterData) {
	modLoader.style.display = 'none';

	characterData.forEach((character) => {
		let li = document.createElement('li');
		li.innerText = `${character.name}: ${character.aliases.join(' ')}`;
		modList.append(li);
	});
}

// searchParams
let idProduct = new URL(window.location.href).searchParams.get('id')

// *** Connextion API
// fetch('http://localhost:3000/api/products')
fetch('https://kanap-backend-6zh7.onrender.com/api/products')
	.then((response) => response.json())
	.then((data) => {
		// *** Trouver l'objet correspondant à l'ID : object._id vient de l'API && idProduct vient du searchParams
		let findObject = () => {
			return data.find((object) => object._id === idProduct)
		}

		let myObject = findObject()

		// *** Ajoute les valeurs dans le DOM
		let injectHtml = () => {
			// Sélecteurs
			let productName = document.getElementsByTagName('title')
			let image = document.querySelector('.item__img')
			let title = document.querySelector('#title')
			let price = document.querySelector('#price')
			let description = document.querySelector('#description')
			let colors = document.querySelector('#colors')

			// Affectations
			productName[0].innerHTML = myObject.name
			image.innerHTML = `<img src="${myObject.imageUrl}" alt="${myObject.altTxt}">`
			title.innerHTML = myObject.name
			price.innerHTML = myObject.price
			description.innerHTML = myObject.description
			for (let i in myObject.colors) {
				colors.insertAdjacentHTML(
					'beforeend',
					`<option value="${myObject.colors[i]}">${myObject.colors[i]}</option>`
				)
			}
		}

		injectHtml()
	})

// *** Création du produit
let createProduct = () => {
	let quantity = document.querySelector('#quantity')

	// Crée l'objet dans le localStorage
	// Lecture du localStorage
	let saveProductLocalStorage = JSON.parse(localStorage.getItem('product'))

	let optionProduct = {
		_id: idProduct,
		qty: quantity.value,
		colors: colors.value,
	}

	// *** Ajoute un produit sélectionné dans le localStorage
	let addProductLocalStorage = () => {
		saveProductLocalStorage.push(optionProduct)
		localStorage.setItem('product', JSON.stringify(saveProductLocalStorage))
		notifAdd()
	}

	// *** Modifie un produit sélectionné dans le localStorage
	let modifyProductLocalStorage = (index) => {
		saveProductLocalStorage[index].qty = parseInt(
			saveProductLocalStorage[index].qty
		)
		optionProduct.qty = parseInt(optionProduct.qty)

		// Ne rajoute pas la quantité si le local storage est déjà à 100
		let sumDomLs = optionProduct.qty + saveProductLocalStorage[index].qty

		if (sumDomLs > 100) {
			console.log('Limite à 100')
			notifHundread()
		} else {
			saveProductLocalStorage[index].qty += optionProduct.qty
			localStorage.setItem('product', JSON.stringify(saveProductLocalStorage))
			console.log('Addition')
			notifAdd()
		}
	}

	// *** Notifications
	let notification = document.querySelector('.item__content__addButton')

	let deleteNotif = () => {
		let deleteNotif = document.querySelector('#notif')
		setTimeout(function () {
			deleteNotif.remove()
		}, 2000)
	}

	let notifAdd = () => {
		notification.insertAdjacentHTML(
			'afterend',
			`<span id ="notif" style="text-align: center; font-weight: bold;"><br>L'article a bien été ajouté</span>`
		)
		deleteNotif()
	}

	let notifHundread = () => {
		notification.insertAdjacentHTML(
			'afterend',
			`<span id ="notif" style="text-align: center; font-weight: bold;"><br>Votre total de cette article excéde 100</span>`
		)
		deleteNotif()
	}

	let notifError = () => {
		if (optionProduct.colors == '') {
			notification.insertAdjacentHTML(
				'afterend',
				`<span id ="notif" style="text-align: center; font-weight: bold;"><br>Merci de choisir une couleur</span>`
			)
			deleteNotif()
		}
		if (optionProduct.qty <= 0) {
			notification.insertAdjacentHTML(
				'afterend',
				`<span id ="notif" style="text-align: center; font-weight: bold;"><br>Merci de choisir une quantité</span>`
			)
			deleteNotif()
		} else if (optionProduct.qty > 100) {
			notification.insertAdjacentHTML(
				'afterend',
				`<span id ="notif" style="text-align: center; font-weight: bold;"><br>Merci de rentrer un nombre inférieur à 100</span>`
			)
			deleteNotif()
		}
	}

	// SI la couleur est non renseignée OU que la quantité est inférieur ou égal à 0 OU supérieur à 100 : ne rien faire
	if (
		optionProduct.colors == '' ||
		optionProduct.qty <= 0 ||
		optionProduct.qty > 100
	) {
		notifError()
		console.log('Ne rien faire')
	} else {
		// SI pas de produit dans le localStorage, crée le tableau et ajoute le produit
		if (!saveProductLocalStorage) {
			saveProductLocalStorage = []
			addProductLocalStorage()
			console.log('Crée le tableau avec le premier produit')
			cart()
		}
		// Trouve l'index dans le localStorage qui a la même couleur & la même ID que la sélection actuelle
		else {
			let index = saveProductLocalStorage.findIndex(
				(e) => e.colors === optionProduct.colors && e._id === optionProduct._id
			)
			// SI le produit existe déjà, modifie la quantité
			if (index !== -1) {
				modifyProductLocalStorage(index)
				cart()
			}
			// SINON ajoute le produit
			else {
				addProductLocalStorage()
				console.log('Ajoute le produit')
				cart()
			}
		}
	}
}

let sendCart = document.querySelector('#addToCart')
sendCart.addEventListener('click', (event) => {
	createProduct()
})

// *** Rajouter la quantité totale à côté du panier (nav bar)
let cart = () => {
	let panier = document
		.getElementsByTagName('nav')[0]
		.getElementsByTagName('li')[1]
	let saveProductLocalStorage = JSON.parse(localStorage.getItem('product'))
	let sum = 0

	for (let q in saveProductLocalStorage) {
		let loop = parseInt(saveProductLocalStorage[q].qty)
		sum += loop
	}

	panier.innerHTML = `Panier <span id="test" style='color: red;'>${sum}</span>`
}

cart()

// *** Sécurité : si ID différent de l'API, on est redirigé à l'accueil
// fetch('http://localhost:3000/api/products')
fetch('https://kanap-backend-6zh7.onrender.com/api/products')
	.then((response) => response.json())
	.then((data) => {
		if (
			idProduct == data[0]._id ||
			idProduct == data[1]._id ||
			idProduct == data[2]._id ||
			idProduct == data[3]._id ||
			idProduct == data[4]._id ||
			idProduct == data[5]._id ||
			idProduct == data[6]._id ||
			idProduct == data[7]._id
		) {
			return
		} else {
			window.location.href = 'index.html'
		}
	})

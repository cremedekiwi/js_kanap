// fetch('http://localhost:3000/api/products')
fetch('https://kanap-backend-6zh7.onrender.com/api/products')
	.then((response) => response.json())
	.then((data) => {
		// *** Affiche tout les produits
		// Fais une boucle pour afficher chaque produit contenu dans l'API
		let showAllProduct = () => {
			let items = document.getElementById('items')

			for (let p in data) {
				items.innerHTML += `
					<a href="./product.html?id=${data[p]._id}">
						<article>
							<img src="${data[p].imageUrl}" alt="${data[p].altTxt}">
							<h3 class="productName">${data[p].name}</h3>
							<p class="productDescription">${data[p].description}</p>
						</article>
					</a>`
			}
		}

		showAllProduct()
	}).catch((error) => {
		console.log('La connexion à l\'API a échoué')
		console.log(error)
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

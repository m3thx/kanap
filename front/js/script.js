// Récupération des données de l'API
fetch("http://localhost:3000/api/products")
.then(function (response){
    return response.json();
})
.then(function(array){
    let displayProduct = '';
    for(let produit of array){
        console.log(produit)
        // Construire l'affichage des produits
        displayProduct += `
        <a href="./product.html?id=${produit._id}">
            <article>
              <img src="${produit.imageUrl}" alt="${produit.altTxt}">
              <h3 class="productName">${produit.name}</h3>
              <p class="productDescription">${produit.description}</p>
            </article>
        </a>
        `
    }
    // Modification du DOM
    let items = document.getElementById('items');
    items.innerHTML = displayProduct;
});


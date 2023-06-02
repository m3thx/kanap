document.addEventListener("DOMContentLoaded", function () {

    const paramId = new URLSearchParams(window.location.search);
    const idProduit = paramId.get('id');
    console.log(idProduit)



    // Récuperation données API
    fetch(`http://localhost:3000/api/products/${idProduit}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (valeur) {
            console.log(valeur)
            let image = document.querySelector('.item__img')
            image.innerHTML = `<img src="${valeur.imageUrl}" alt="${valeur.altTxt}">`
            let title = document.querySelector('#title');
            title.innerHTML = valeur.name;
            let price = document.querySelector('#price');
            price.innerHTML = valeur.price;
            let description = document.querySelector('#description');
            description.innerHTML = valeur.description;

            // Affiche les couleurs avec une boucle
            const arrayColors = valeur.colors;
            for (const color in arrayColors) {
                const option = document.createElement('option');
                document.querySelector("#colors")
                    .appendChild(option)
                    .setAttribute('value', `${valeur.colors[color]}`);
                option.innerHTML = valeur.colors[color];
            }
        })

    let itemCart = {};
    const buttonCart = document.querySelector('#addToCart')
    const itemsNumber = document.querySelector('#quantity')
    const itemColor = document.querySelector('#colors')
    let itemsCart = []
    
    // Ajout au panier
    function addingToCart() {
        itemCart.id = idProduit;
        itemCart.color = itemColor.value
        itemCart.quantity = itemsNumber.value
    }

    //Test présence panier
    function isInCart() {
        if ((JSON.parse(localStorage.getItem('items') === null))) {
            itemsCart.push(itemCart)
            localStorage.setItem('items', JSON.stringify(itemsCart))
            console.log(itemsCart)
        } else {
            itemsCart = JSON.parse(localStorage.getItem('items'))
            let item = itemsCart.find(item => item.id === itemCart.id && item.color === itemCart.color);
            if (item !== undefined) {
                let value = parseInt(itemCart.quantity) + parseInt(item.quantity);
                if (value <= 100) {
                    item.quantity = value
                    localStorage.setItem('items', JSON.stringify(itemsCart))
                } else {
                    alert('Nombre maximum d\'articles atteint')
                }
            } else {
                itemsCart.push(itemCart)
                localStorage.setItem('items', JSON.stringify(itemsCart))
                
                
            }
        }
    }
    //Message d'ajout au panier
    function msgAddToCart() {
        buttonCart.innerHTML = 'Produit ajouté au panier'
        setTimeout(() => {
            buttonCart.innerHTML = 'Ajouter au panier'
        }, 3000)
    }

    //Message d'erreur couleur
    function msgColor() {
        buttonCart.innerHTML = 'Veuillez choisir une couleur'
        buttonCart.style.boxShadow = 'rgb(255, 0, 0, 90%) 0 0 22px 6px'
        setTimeout(() => {
            buttonCart.innerHTML = 'Ajouter au panier'
            buttonCart.style.boxShadow = 'rgb(42 18 206 / 90%) 0 0 22px 6px'
        }, 3000)
    }
    
    //Message d'erreur quantité
    function msgQuantity() {
        buttonCart.innerHTML = 'Veuillez choisir un nombre d\'article(s)'
        buttonCart.style.boxShadow = 'rgb(255, 0, 0, 90%) 0 0 22px 6px'
        setTimeout(() => {
            buttonCart.innerHTML = 'Ajouter au panier'
            buttonCart.style.boxShadow = 'rgb(42 18 206 / 90%) 0 0 22px 6px'
        }, 3000)
    }

    // Alert si aucune sélection + stockage 
    function testAddingToCart() {
        if (itemColor.value === '') {
            msgColor()
        } else if (itemsNumber.value === '0') {
            msgQuantity()
        } else {
            addingToCart()
            isInCart()
            msgAddToCart()
        }
        // console.log(localStorage.length);
    }
    buttonCart.onclick = testAddingToCart
})

// 1 etape : récupérer le panier
// 2 etape : récuperer les prix
// récuperer les id dans un nouveau tableau
// fetch api pour récuperer les éléments
//3 étape : 
//correspandance entre l'id du panier et l'id de l'api
// calcul
// afffichage des valeurs

// Déclaration des variables globales
const sectionCart = document.querySelector("#cart")
let itemsStorage = JSON.parse(localStorage.getItem('items'))
let displayProduct = ''
let products;
let productsList = []
let totalPrice = 0
let totalQuantity = 0
let contact = {}

//Affichage message panier vide ou lancement de la génération de la page
if (itemsStorage === null) {
    let cartEmpty = document.querySelector('#cartAndFormContainer');
    cartEmpty.innerHTML = '<h1>Votre panier est vide</h1>';
} else {
    cart()
}

//Appel des différentes fonctions
async function cart() {
    await getProducts()
    await jointList()
    displayArray()
    deleteItem()
    testContact()
    submitOrder()
}

//Récupération de la listes des produits via API
async function getProducts() {
    await fetch("http://localhost:3000/api/products")
        .then((response) => response.json())
        .then((data) => products = data)
        .catch((error) => console.log("Erreur"))
}

//Création tableau comprenant toutes les données (localStorage + API)
async function jointList() {
    let result = []
    let i = 0
    for (let i in itemsStorage) {
        for (let j in products) {
            if (products[j]._id === itemsStorage[i].id) {
                result = { id: itemsStorage[i].id, color: itemsStorage[i].color, quantity: itemsStorage[i].quantity, imageUrl: products[j].imageUrl, name: products[j].name, price: products[j].price }
                productsList.push(result);
            }
        }
    }
}

// Calcul des quantités et du prix total
function calcul() {
    totalPrice = 0
    totalQuantity = 0
    productsList.forEach(product => {
        totalPrice += product.quantity * product.price
    })
    productsList.forEach(product => {
        totalQuantity += parseInt(product.quantity)
    })
    document.querySelector('#totalQuantity').innerText = totalQuantity
    document.querySelector('#totalPrice').innerText = totalPrice
}

// Modification des quantités
function modification() {
    let modifyButton = document.querySelectorAll('.itemQuantity')
    modifyButton.forEach(button => {
        button.addEventListener('change', function () {
            // récupère la quantité de l'élément modifié
            let newQuantity = button.closest('input').valueAsNumber //mais qu'elle solution miracle
            console.log(newQuantity)
            // récupère l'id de l'article modifié dans le tableau
            let dataId = button.closest('.cart__item').getAttribute('data-id')
            // récupère la couleur de l'article modifié dans le tableau
            let dataColor = button.closest('.cart__item').getAttribute('data-color')
            // recherche l'élément modififé dans le tableau itemsStorage avec son id et sa couleur et remplace la quantité
            let iStorage = itemsStorage.findIndex(i => i.id === dataId && i.color === dataColor)
            itemsStorage[iStorage].quantity = JSON.stringify(newQuantity)
            // recherche l'élément modififé dans le tableau productsList avec son id et sa couleur et remplace la quantité
            let iProductsList = productsList.findIndex(i => i.id === dataId && i.color === dataColor)
            productsList[iProductsList].quantity = JSON.stringify(newQuantity)
            // enregistre les données modifiées dans le localStorage
            localStorage.setItem('items', JSON.stringify(itemsStorage))
            // console.log(itemsStorage)
            calcul()
        })
    })
}

//Suppression d'un article
function deleteItem() {
    let deleteButton = document.querySelectorAll('.deleteItem')
    deleteButton.forEach(button => {
        button.addEventListener('click', function () {
            // récupère l'id de l'article supprimé dans le tableau
            let dataId = button.closest('.cart__item').getAttribute('data-id')
            // récupère la couleur de l'article supprimé dans le tableau
            let dataColor = button.closest('.cart__item').getAttribute('data-color')
            // filtre le tableau itemsStorage en renvoyant tous les autres éléments 
            let iStorage = itemsStorage.filter(item => !(item.color === dataColor) || !(item.id === dataId))
            itemsStorage = iStorage
            // filtre le tableau productsList en renvoyant tous les autres éléments 
            let iProductsList = productsList.filter(item => !(item.color === dataColor) || !(item.id === dataId))
            productsList = iProductsList
            // sélectionne l'élément article, affiche article supprimé dans le tableau et effece le tout au bout de 2 secondes
            let article = button.closest('article')
            article.innerHTML = 'Article supprimé'
            setTimeout(() => {
                article.remove()
            }, 2000)
            // enregistre les données filtrées dans le localStorage
            localStorage.setItem('items', JSON.stringify(itemsStorage))
            calcul()
        })
    })
}


//Affichage tableau
async function displayArray() {
    productsList.forEach((product) => {
        // Construire l'affichage des produits
        displayProduct += `
                            <article class="cart__item" data-id=${product.id} data-color=${product.color}>
                                <div class="cart__item__img">
                                <img src="${product.imageUrl}" alt="Photographie d'un canapé">
                                </div>
                                <div class="cart__item__content">
                                <div class="cart__item__content__description">
                                    <h2>${product.name}</h2>
                                    <p>${product.color}</p>
                                    <p>${product.price} €</p>
                                </div>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                    </div>
                                </div>
                                </div>
                            </article>`;

        let arrayCart = document.querySelector('#cart__items');
        arrayCart.innerHTML = displayProduct;
    })
    calcul()
    modification()
}

// Variables gloables pour la gestion du formulaire
const firstName = document.querySelector('#firstName')
const lastName = document.querySelector('#lastName')
const address = document.querySelector('#address')
const city = document.querySelector('#city')
const email = document.querySelector('#email')
const buttonOrder = document.querySelector('#order')

// Test regex des entrées du formulaires
function testContact() {
    const regName = /[^a-zA-Z\s-éèùêôûç]/g;
    const regAddress = /[^0-9a-zA-Z\s]/g;
    const regEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    firstName.addEventListener('input', function () {
        if (firstName.value.match(regName) === null) {
            document.querySelector('#firstNameErrorMsg').innerText = ''
            valide(firstName)
        } else {
            document.querySelector('#firstNameErrorMsg').innerText = 'Prénom invalide'
            invalide(firstName)
        }
    })
    lastName.addEventListener('input', function () {
        if (lastName.value.match(regName) === null) {
            document.querySelector('#lastNameErrorMsg').innerText = ''
            valide(lastName)
        } else {
            document.querySelector('#lastNameErrorMsg').innerText = 'Nom invalide'
            invalide(lastName)
        }
    })
    address.addEventListener('input', function () {
        if (address.value.match(regAddress) === null) {
            document.querySelector('#addressErrorMsg').innerText = ''
            valide(address)
        } else {
            document.querySelector('#addressErrorMsg').innerText = 'Adresse invalide';
            invalide(address)
        }
    })
    city.addEventListener('input', function () {
        if (city.value.match(regName) === null) {
            document.querySelector('#cityErrorMsg').innerText = ''
            valide(city)
        } else {
            document.querySelector('#cityErrorMsg').innerText = 'Ville invalide'
            invalide(city)
        }
    })
    email.addEventListener('input', function () {
        if (email.value.match(regEmail) === null) {
            document.querySelector('#emailErrorMsg').innerText = 'Email invalide'
            invalide(email)
        } else {
            document.querySelector('#emailErrorMsg').innerText = ''
            valide(email)
        }
    })

}

// Accentue les messsages d'erreur du formulaire
function invalide(nameForm) {
    errorNAme = nameForm.id + 'ErrorMsg'
    let errorMsg
    errorMsg = document.getElementById(errorNAme)
    errorMsg.style.color = "red";
    errorMsg.style.paddingTop = "5px";
    errorMsg.style.fontWeight = "500";
}

// Efface la couleur après correction d'un message d'erreur dans le formulaire
function valide(nameForm) {
    errorNAme = nameForm.id + 'ErrorMsg'
    let errorMsg
    errorMsg = document.getElementById(errorNAme)
    errorMsg.style.color = "";
}

// let change = document.querySelector('#order').setAttribute('type', 'button') // A supprimer

// Création d'un tableau contact avec les infos du formulaire
function fillContact() {
    contact.firstName = firstName.value
    contact.lastName = lastName.value
    contact.address = address.value
    contact.city = city.value
    contact.email = email.value
}

// Test  non vide du formulaire
function validationContact() {
    if (firstName.value === ''
        || lastName.value === ''
        || address.value === ''
        || city.value === ''
        || email.value === ''
    ) {
        buttonOrder.value = 'Formulaire imcomplet !'
        buttonOrder.style.boxShadow = 'rgb(255, 0, 0, 90%) 0 0 22px 6px'
        setTimeout(() => {
            buttonOrder.value = 'Commander !'
            buttonOrder.style.boxShadow = 'rgb(42 18 206 / 90%) 0 0 22px 6px'
        }, 2000)
    } else if (document.querySelector('#firstNameErrorMsg').style.color === 'red' ||
        document.querySelector('#lastNameErrorMsg').style.color === 'red' ||
        document.querySelector('#addressErrorMsg').style.color === 'red' ||
        document.querySelector('#cityErrorMsg').style.color === 'red' ||
        document.querySelector('#emailErrorMsg').style.color === 'red') {
        buttonOrder.value = 'Formulaire incorrect !'
        buttonOrder.style.boxShadow = 'rgb(255, 0, 0, 90%) 0 0 22px 6px'
        setTimeout(() => {
            buttonOrder.value = 'Commander !'
            buttonOrder.style.boxShadow = 'rgb(42 18 206 / 90%) 0 0 22px 6px'
        }, 2000)
    } else {
        fillContact()
        return true
    }
}

// Envoi de la commande à l'API
function postOrder() {
    let products = []
    productsList.forEach((product) => products.push(product.id))
    console.log(products)
    const orderPost = {
        contact,
        products
    }
    console.log(products)
    console.log(orderPost)
    console.log(JSON.stringify(orderPost))

    fetch("http://localhost:3000/api/products/order", {
        method: 'Post',
        body: JSON.stringify(orderPost),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })

        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            document.location.href = "confirmation.html?id=" + data.orderId
        })

}

// Processus d'envoi de la commande à l'API
function submitOrder() {
    buttonOrder.addEventListener('click', function (e) {
        e.preventDefault();
        // validationContact()
        if (validationContact()) {
            postOrder()
        } else {
            console.log(validationContact())
            console.log('Erreur')
        }
    })
}









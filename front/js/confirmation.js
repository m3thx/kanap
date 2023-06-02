// Récupération de l'id présent dans l'url et affichage sur la page

const id= new URLSearchParams(window.location.search);
console.log(id)
const orderId = id.get('id');
console.log(orderId)

document.querySelector('#orderId').innerHTML = orderId
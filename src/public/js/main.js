const socket = io();


const form = document.getElementById("realTimeProductsForm")
form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const title = document.getElementById("formTitle").value
    const description = document.getElementById("formDescription").value
    const price = document.getElementById("formPrice").value
    const thumbnail = document.getElementById("formThumbnail").value
    const code = document.getElementById("formCode").value
    const stock = document.getElementById("formStock").value
    const category = document.getElementById("formCategory").value
    const product = {title,description,price,thumbnail,code,stock,category}    
    socket.emit("addProduct", product) 
})

socket.on("mensajeProductoAgregado",mensaje=>{
    console.log(mensaje)
})

socket.on("getProducts", products =>{

    document.getElementById("productsCard").innerHTML=""

    products.forEach(product => {
        document.getElementById("productsCard").innerHTML+=  
        `
        <div class="card col-sm-2 cardProduct">
        <img class="card-img-top imagenCardProducts" src="${product.thumbnail}" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description} </p>
            <p class="card-text">Precio: ${product.price} </p>       
            <p class="card-text">Stock: ${product.stock} </p>   
            <p class="card-text">Code: ${product.code} </p>                                               
            <a id="botonProducto${product.id}" class="btn btn-primary">Eliminar</a>
        </div>
        `
    });


    products.forEach(product=>{
        document.getElementById(`botonProducto${product.id}`).addEventListener("click",(e)=>{
            socket.emit("deleteProduct", product.id) 
            socket.on("mensajeProductoEliminado",mensaje=>{
                console.log(mensaje) //Para mostrarle al cliente el mensaje
            })
        })
    })
})

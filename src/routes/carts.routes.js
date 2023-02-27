import { Router } from 'express'
import CartManager from '../controllers/CartManager.js'

const routerCart = Router()
const manager = new CartManager('src/models/carts.json');

routerCart.post("/", async (req, res) => {
    if (!manager.checkArchivo()) {
        await manager.crearArchivo();
    }
    try {
        res.send(await manager.crearCarritoVacio())
    } catch {
        res.send("Error en el archivo")
    }

});

routerCart.get("/", async (req, res) => {
    try {
        res.send(await manager.getAllCarts())
    } catch {
        res.send("Error en el archivo")
    }

});

routerCart.get("/:cid", async (req, res) => {
    try {
        const respuesta = await manager.getAllCartProducts(parseInt(req.params.cid))
        res.send(respuesta)
    } catch {
        res.send("Error en el archivo")
    }

});

routerCart.post("/:cid/product/:pid", async (req, res) => {
    try {
        let respuesta = await manager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid), 1) //1 porque dice la diapositiva que de a 1 se agregan por ahora
        res.send(respuesta)
    } catch {
        res.send("Error en alguno de los archivos")
    }

});

routerCart.delete("/:cid/product/:pid", async (req, res) => {
    try {
        let respuesta = await manager.deleteProductById(parseInt(req.params.cid), parseInt(req.params.pid), 1) //1 porque dice la diapositiva que de a 1 se agregan por ahora
        res.send(respuesta)
    } catch {
        res.send("Error en alguno de los archivos")
    }

});


export default routerCart
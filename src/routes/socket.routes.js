import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js"

const routerSocket = Router()
const productManager = new ProductManager('src/models/products.json');

routerSocket.get('/realtimeproducts', async(req,res) => {
    
    const products = await productManager.getAllProducts()

    res.render("realTimeProducts", { 
        titulo: "Desafio 4 Real Time Products",
        products: products
    })
  })
  

routerSocket.get('/', async(req,res) => {
  const productos = await productManager.getAllProducts()
      res.render("index", { 
      titulo: "STAEM",
      products: productos
    })
})



export default routerSocket;
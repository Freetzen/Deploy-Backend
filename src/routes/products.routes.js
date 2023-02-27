import { Router } from "express";
const routerProduct = Router();
import ProductManager from "../controllers/ProductManager.js"
const manager = new ProductManager('src/models/products.json');



routerProduct.get("/", async (req, res) => {

    try{
        const products = await manager.getAllProducts();
        if (products.length>0){
            let { limit } = req.query;
            let data;
            if (!limit) {
                data = products;
            } else {
                data = products.slice(0, parseInt(limit));
            }
            res.send(data);
        }else{
            res.send("No hay productos en el archivo")
        }
    }catch(error){
        res.send("Probablemente no exista el archivo")
    }


});

routerProduct.get("/:pid", async (req, res) => {
    try{
        const product = await manager.getProductById(parseInt(req.params.pid));
        JSON.stringify(product)
        if (product){
            // res.send(JSON.stringify(product)) //En caso de quererlo en formato string
            res.send(product)
        }else{
            res.send("No se encontró el producto")
        }
    }catch{
        res.send("Probablemente el archivo no exista")
    }

});

routerProduct.post('/', async(req,res)=>{
    if (!manager.checkArchivo()){
        await manager.crearArchivo(); 
    }
    try{
        res.send(await manager.addProduct(req.body))
    }catch{
        res.send("Ha ocurrido un error en el archivo")
    }

})

routerProduct.put("/:pid", async (req, res) => {
    try{
        let respuesta = await manager.updateProduct({id:parseInt(req.params.pid),title:req.body.title,description:req.body.description,price:req.body.price,thumbnail:req.body.thumbnail,code:req.body.code,stock:req.body.stock,status:req.body.status,category:req.body.category})
        res.send(respuesta)
    }catch{
        res.send("Error en el archivo")
    }


});
routerProduct.delete("/:pid", async(req,res)=>{
    try{
        let respuesta = await manager.deleteProductById(parseInt(req.params.pid))
        res.send(respuesta)
    }catch{
        res.send("Error en el archivo")
    }
});


export default routerProduct
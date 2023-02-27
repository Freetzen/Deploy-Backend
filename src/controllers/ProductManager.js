import fs from "fs"; 
const ruta = "../models/products.json"; 


class Producto {
    constructor(title, description, price, thumbnail, code, stock, status, category) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.status = status;
        this.category = category;
    }

}

const producto1 = new Producto("Pubg", "accion", 600, ["./img/p2.jpg"], "PB2", 20, true, "accion");
const producto2 = new Producto("Counter Strike 2", "accion", 900, ["./img/cs2.jpg"], "CS2", 180, true, "accion");
const producto3 = new Producto("Resident Evil 8", "terror", 1000, ["./img/re8.jpg"], "RE8", 100, true, "terror");
const producto4 = new Producto("Destiny 3", "accion", 1400, ["./img/destiny3.png"], "D3", 200, true, "accion");

class ProductManager { 
    constructor(path) { 
        this.path = path; 
    }

    checkArchivo = ()=>{
        return fs.existsSync(this.path)       
    }

    crearArchivo = async () => {
        await fs.promises.writeFile(this.path, "[]")
    }

    addProduct = async (newProduct) => {
        let i=0;
        let cantidadCampos=8;
        for (const campo in newProduct){
            i++
        }
        if (i==cantidadCampos){
            if (newProduct.status===true && newProduct.category.length>0 && newProduct.title.length > 0 && newProduct.description.length > 0 && toString(newProduct.price).length > 0  && newProduct.code.length > 0 && toString(newProduct.stock).length > 0) {
                let contenido = await fs.promises.readFile(this.path, "utf-8");
                let arrayProductos = JSON.parse(contenido);
                if (arrayProductos.filter(product => product.code == newProduct.code).length > 0) {
                    return "Ya existe el producto";
                }
                else 
                {
                    let contenido = await fs.promises.readFile(this.path, "utf-8");
                    let aux = JSON.parse(contenido);
                    if (aux.length>0){
                        const idAutoincremental = aux[aux.length-1].id+1; //Esto para que sea incremental dependiendo del ultimo elemento
                        aux.push({ id: idAutoincremental, ...newProduct });
                        await fs.promises.writeFile(this.path, JSON.stringify(aux));
                        return "Producto Agregado"
                    }
                    else{
                        const idAutoincremental = 1;
                        aux.push({ id: idAutoincremental, ...newProduct });
                        await fs.promises.writeFile(this.path, JSON.stringify(aux));
                        return "Producto agregado"
                    }
    
                }
            } else {
                return "No puede tener campos vacios"
            }
        }else{
            return `Falta o sobra al menos 1 campo (deben ser ${cantidadCampos})`
        }
       
    }

    getProductById= async(id)=> {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')  
        let aux = JSON.parse(contenido)
        if(aux.some(product=> product.id === id)) 
        {
            let pos = aux.findIndex(product => product.id === id)
            return aux[pos];
        }else{
            return null
        }        
    }

    deleteProductById= async(id)=> {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')
        let aux = JSON.parse(contenido)
        if(aux.some(product=> product.id === id)) 
        {
            const arraySinElIdSeleccionado = aux.filter(product => product.id != id);
            await fs.promises.writeFile(this.path, JSON.stringify(arraySinElIdSeleccionado))
            return "Producto eliminado exitosamente";           
        }else{
            return "No se encontró el producto que desea eliminar"
        }        
    }

    getAllProducts= async()=> {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')  
        let aux = JSON.parse(contenido)
        return aux;   
    }
    updateProduct = async ({ id, title, description, price, thumbnail, code, stock, status, category }) => {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')
        let aux = JSON.parse(contenido)
        if (aux.some(product => product.id === id)) {
            let pos = aux.findIndex(product => product.id === id)
            if (title != undefined) {
                if (title.length > 0) {
                    aux[pos].title = title;
                }
            }
            if (description != undefined) {
                if (description.length > 0) {
                    aux[pos].description = description;
                }
            }
            if (price != undefined) {
                if (price.length > 0) {
                    aux[pos].price = parseFloat(price);
                }
            }
            if (thumbnail != undefined) {
                if (thumbnail.length > 0) {
                    aux[pos].thumbnail = thumbnail;
                }
            }
            if (aux.some(prod => prod.code == code)) {
                return "No puede poner un codigo que ya existe"
            } else if (code != undefined) {
                if (code.length > 0) {
                    aux[pos].code = code;
                }
            }
            if (stock != undefined) {
                if (stock.length > 0) {
                    aux[pos].stock = parseInt(stock);
                }
            }
            if (status != undefined) {
                if (status == false) {
                    aux[pos].status = false;
                } else {
                    aux[pos].status = true;
                }
            }
            if (category != undefined) {
                if (category.length > 0) {
                    aux[pos].category = category;
                }
            }

            await fs.promises.writeFile(this.path, JSON.stringify(aux))
            return "Producto actualizado exitosamente";
        } else {
            return "Producto no encontrado para actualizar"
        }

    }

    cargarArchivo = async () => {
        //tests
        await this.crearArchivo(); //Es para que si no tiene el array vacio al inicio se lo ponga así evitamos errores, y para asegurarnos que existe el archivo
        await this.addProduct(producto1);
        await this.addProduct(producto2);
        await this.addProduct(producto3);
        await this.addProduct(producto4);

    }
}



export default ProductManager 
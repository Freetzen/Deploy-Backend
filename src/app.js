import express from 'express';
import routerProduct from './routes/products.routes.js';
import routerCart from "./routes/carts.routes.js";
import { __dirname } from './path.js';
import multer from 'multer';
import {engine} from 'express-handlebars';
import * as path from 'path';
import { Server } from 'socket.io';
import { Socket } from 'dgram';
import routerSocket from "./routes/socket.routes.js";
import { info } from "console";
import ProductManager from './controllers/ProductManager.js';

const productManager = new ProductManager('src/models/products.json');


//MULTER
//const upload = multer({dest:'src/public/images/imgUsers'}) //Destino para alojar imágenes cargadas por el usuario. (FORMA BÁSICA)
const storage = multer.diskStorage({ //multer.diskStorage, es un método para definir como guardar las imágenes
    destination: (req,file,cb)=>{ //Primer atributo es destination.
        cb(null,'src/public/images/imgUsers') //cb es una función para manejar la información de multer (callback)
    },
    filename: (req,file,cb)=>{ //filename es el atributo para decirle como guardamos la imagen, en este caso, con el nombre original
        cb(null, `${file.originalname}`)
    }
});

const upload = multer({storage:storage}); //Constante upload y enviamos por parametro la constante storage
const app = express();
const PORT = 8080;

const server = app.listen(PORT, () => { 
    console.log(`Server on port localhost:${PORT}`)
});

//Nuevo servidor Socket.io
const io = new Server(server);

io.on("connection", async(socket)=>{
    console.log("Cliente conectado")
  
    socket.on("addProduct", async info =>{ //El socket "on" es cuando se recibe información del lado del cliente
      const newProduct = {...info, status:true };
      var mensajeAgregar = await productManager.addProduct(newProduct); //Agregar un producto y guarda el mensaje en un variable para mandarlo al usuario y mostrarlo al servidor
      socket.emit("mensajeProductoAgregado",mensajeAgregar)
      console.log(mensajeAgregar)
    })
    socket.on("deleteProduct", async id=>{
      var mensajeBorrar = await productManager.deleteProductById(id)
      socket.emit("mensajeProductoEliminado",mensajeBorrar)
      console.log(mensajeBorrar) //Para mostrar al servidor el mensaje
    })
    socket.emit("getProducts",  await productManager.getAllProducts()); //Envia los productos del carrito al cliente
  })


//Middleware
app.use(express.json()); //Permite trabajar con JSON
app.use(express.urlencoded({extended:true})); //Permite trabajar con url extendidos
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views')); //mismo que __dirname + './views'
io.on('connection', (socket)=>{ //io.on es cuando se establece la conexión(me conecton con el cliente)
    console.log('Cliente conectado')

    socket.on('mensaje', info =>{ //Recibo información del cliente
        console.log(info)
    })

    socket.emit('mensaje-general', 'Hola desde mensaje general') //.emit envia info a los clientes conectados
    socket.broadcast.emit('mensaje-socket-propio', 'Hola desde mensaje socket io') //Envío un mensaje a todos los clientes conectados menos al que está conectado al socket actual
});


//Routes
app.use('/', express.static(__dirname + '/public')); //Definir carpeta publica.
app.use('/api/products', routerProduct); //Crear ruta para productos, llamando a routerProduct
app.use('/api/carts', routerCart); //Crear ruta para productos, llamando a routerCart
app.use('/api/products', routerProduct)
app.use('/', routerSocket)

app.post('/upload',upload.single('product'),(req,res)=>{ //Ruta para cargar un solo archivo con .single
    console.log(req.body)
    console.log(req.file) //Ver contenido (información) de la imágen
    res.send('imagen cargada')
});

//Handlebars
/* app.get('/', (req,res)=>{

    const user = {
        nombre: 'Fede',
        apellido: 'Ruiz Gei',
        edad: 15
    }

    res.render('home', { //Renderizar el contenido
        title: 'Ecommerce',
        mensaje: 'Fede',
        user,
        have18: user.edad >= 18  //Handlebars solo usa booleanos
    })
}); */
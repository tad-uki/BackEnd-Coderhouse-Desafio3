import express from "express";
import {ProductManager} from "./components/ProductManager.js";

const productManagerFiles = new ProductManager("./files/products.json")
const port = 8080
const app = express()

app.use(express.json());
app.listen(port, ()=>console.log("Server Working"))

const products = await productManagerFiles.getProducts()

app.get("/products", async(req, res)=>{
    try {
        const limitQuery = req.query.limit
        if(limitQuery){
            const limitProducts = await products.filter((p)=> p.id <= limitQuery)
            res.send(limitProducts)
        }
        else{
            res.send(products)
        }
    } catch (error) {
        res.send(error)
    }
})

app.get("/products/:id", async(req, res)=>{
    try {
        const idParam = parseInt(req.params.id)
        const paramProduct = await products.find((p) => p.id === idParam)
        if(paramProduct){
            res.send(paramProduct)
        }
        else{
            res.send("El producto no existe")
        }
    } catch (error) {
        res.send(error)
    }
})
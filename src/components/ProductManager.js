import fs from "fs";

class ProductManager{
    constructor(pathFile){
        this.path = pathFile
    };

    async getProducts(){
        try {
            const JsonProds = await fs.promises.readFile(this.path, "utf-8")
            const products = await JSON.parse(JsonProds)
            return await products;
        } catch (error) {
            throw new Error(error)
        }
    };

    async addProduct(newProd){
        try {
            const products = await this.getProducts()
            let check = products.some((product) => product.code === newProd.code);
            if(!newProd.title || !newProd.description || !newProd.price || !newProd.thumbnail || !newProd.code || !newProd.stock ){
                console.log("Por favor completar los detalles del producto");
            }
            else if(check){
                console.log("Este producto ya se encuentra en la lista");
            }
            else{
                let listLength = products.length;
                if(listLength === 0){
                    newProd.id = 1
                }
                else{
                    newProd.id =products[listLength - 1].id + 1;
                }
                products.push(newProd);
                await fs.promises.writeFile(this.path, JSON.stringify(products))
            };    
        } catch (error) {
            throw new Error(error)
        }
        
    }
        

    async getProductById(id){
        try {
            const productsList = await this.getProducts()
            let product = productsList.find((p) => p.id === id);
            if(!product){
                throw new Error("El producto no existe")
            }
            else{
                return product;
            };
        } catch (error) {
            throw new Error("No fue posible conseguir el producto")
        }
    };

    async updateProduct(prodId, updatedProd){
        const productsList = await this.getProducts();
        let oldProd = productsList.map(p => p.id).indexOf(prodId)
        productsList[oldProd] = {...productsList[oldProd], ...updatedProd};
        await fs.promises.writeFile(this.path, JSON.stringify(productsList));
    };

    async deleteProduct(prodId){
        const productsList = await this.getProducts();
        let prod = productsList.map(p => p.id).indexOf(prodId);
        productsList.splice(prod, 1)
        await fs.promises.writeFile(this.path, JSON.stringify(productsList));
    }
};

export {ProductManager}

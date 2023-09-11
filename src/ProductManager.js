// agregamos file system al proyecto
import fs from "fs";

// clase constructora de productos
class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // método para traer los productos del archivo
  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const products = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(products);
      } else {
        return [];
      }
    } catch (error) {
      return error;
    }
  }

  // método para agregar productos
  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      const products = await this.getProducts();
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        return console.log("error: All fields are required");
      } else if (products.some((product) => product.code === code.trim())) {
        return console.log("error: Product code already exists");
      } else {
        const product = {
          id: products.length ? products[products.length - 1].code + 1 : 1,
          title: title.trim(),
          description: description.trim(),
          price: price,
          thumbnail: thumbnail.trim(),
          code: code.trim(),
          stock: stock,
        };
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products));
      }
    } catch (error) {
      return error;
    }
  }

  // método para obtener un producto por su id
  async getProductById(id) {
    try {
      const products = await this.getProducts();
      return (
        products.find((product) => product.id == id) || {
          error: "Product Not Found",
        }
      );
    } catch (error) {
      return error;
    }
  }

  // método para actualizar información del producto por su id
  async updateProductById(id, data) {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex((product) => product.id == id);
      if (productIndex === -1) {
        return { error: "Product Not Found" };
      }

      //validación de que no se pueda modificar el id del producto
      if (data.id && data.id !== id) {
        throw new Error("Updating the product ID is not allowed");
      }

      const updatedProduct = { ...products[productIndex], ...data };
      products[productIndex] = updatedProduct;
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return updatedProduct;
    } catch (error) {
      return error;
    }
  }

  // método para eliminar un producto por su id
  async deleteProductById(id) {
    try {
      const products = await this.getProducts();
      const newProductsArray = products.filter((product) => product.id != id);
      await fs.promises.writeFile(this.path, JSON.stringify(newProductsArray));
    } catch (error) {
      return error;
    }
  }
}

// TESTING
// async function test() {
//   const productManager = new ProductManager("./products.json");

//   // Agregar productos con códigos únicos
//   await productManager.addProduct(
//     "Macbook Pro 2020",
//     "Laptop Apple Macbook Pro 2020",
//     200,
//     "Sin imagen",
//     "MP2020",
//     25
//   );

//   await productManager.addProduct(
//     "Macbook Air 2021",
//     "Laptop Apple Macbook Air 2021",
//     150,
//     "Sin imagen",
//     "MA2021",
//     10
//   );

//   await productManager.addProduct(
//     "iPad Pro 2021",
//     "Tablet Apple iPad Pro 2021",
//     150,
//     "Sin imagen",
//     "IP2021",
//     28
//   );

//   await productManager.addProduct(
//     "iPhone 12 Pro Max",
//     "Smartphone Apple iPhone 12 Pro Max",
//     250,
//     "Sin imagen",
//     "IP12PM",
//     10
//   );

//   await productManager.addProduct(
//     "Mac Studio 2023",
//     "PC Apple Mac Studio 2023",
//     300,
//     "Sin imagen",
//     "MS2023",
//     5
//   );
// }

// test();

// exportamos la clase
export const productManager = new ProductManager("productsAPI.json");

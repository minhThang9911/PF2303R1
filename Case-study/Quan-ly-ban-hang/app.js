// product: name, price, id,image
//app:products[], addProduct, editProduct, UpdateProduct, deleteProduct

class Product {
    constructor(id, name, price, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
    }
}

class App {
    updateProduct;
    constructor(productsInit = []) {
        this.products = productsInit;
    }

    addProduct(product) {
        return this.products.push(product);
    }

    deleteProduct(
        id // xoa product
    ) {
        let index = this.findIndex(id);
        if (index >= 0) {
            this.products.splice(index, 1); // xoa bat đàu từ vị trí index
            // 1 phần tử
        }
    }

    editProduct(
        id // tra ve product co id
    ) {
        let productEditIndex = this.findIndex(id);
        if (productEditIndex >= 0) {
            this.updateProduct = id;
            let productEdit = this.products[productEditIndex];
            let productNameEl = document.querySelector("#productName");
            let productPriceEl = document.querySelector("#productPrice");
            productNameEl.value = productEdit.name;
            productPriceEl.value = productEdit.price;
        }
    }

    updateProduct(
        id,
        productUpdate // update product
    ) {}

    findIndex(
        id // vi tri trong mang
    ) {
        return this.products.findIndex(function (productItem) {
            // doi tuong product
            // console.log("product", productItem);
            return productItem.id == id;
        });
    }

    renderProducts() {
        let productList = document.querySelector("#productList");
        let productHtml = "";

        for (let key in this.products) {
            let item = this.products[key];
            productHtml += `<tr>
            <td>${item.id}</td>
            <td><img src="${item.image}" width="100px" alt=""></td>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>
                <button class="edit" data-id="${item.id}">Edit</button>
                <button class="delete" data-id="${item.id}">Delete</button>
            </td>
        </tr>`;
        }
        productList.innerHTML = productHtml;
        let thisOfApp = this;
        let btnEdits = document.querySelectorAll(".edit");
        btnEdits.forEach(function (productItem) {
            productItem.addEventListener("click", function () {
                let id = productItem.getAttribute("data-id");
                thisOfApp.editProduct(id);
            });
        });
    }

    createProduct() {
        // lay input
        let productNameEl = document.querySelector("#productName");
        let productPriceEl = document.querySelector("#productPrice");
        // console.log(Number(this.products[this.products.length - 1].id) + 1)
        let idCreate = +this.products[this.products.length - 1].id + 1;

        let productNew = new Product(
            idCreate,
            productNameEl.value,
            productPriceEl.value,
            imageLink
        );
        this.addProduct(productNew);
        this.renderProducts();
        productNameEl.value = "";
        productPriceEl.value = "";
    }

    handleUpdate() {
        if (this.updateProduct) {
            let productEditIndex = this.findIndex(this.updateProduct);
            if (productEditIndex >= 0) {
                let productUpdateNew = this.products[productEditIndex];
                let productNameEl = document.querySelector("#productName");
                let productPriceEl = document.querySelector("#productPrice");
                productUpdateNew.name = productNameEl.value;
                productUpdateNew.price = productPriceEl.value;

                this.products[productEditIndex] = productUpdateNew;
                this.renderProducts();
                //reset input and update id
                productNameEl.value = "";
                productPriceEl.value = "";
                this.updateProduct = "";
                // a[1] =0
                // a[1] = 20
            }
        } else {
            console.log("not");
        }
    }
}

let imageLink =
    "https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/Products/Images/7077/282959/dong-ho-befit-b4-thumbnn-600x600.jpg";
let product = new Product("1", "IPhone", 1000, imageLink);
let product2 = new Product(3, "IPhone2", 1000, imageLink);
let app = new App();
let createProductBtn = document.querySelector("#createProduct");

createProductBtn.addEventListener("click", function () {
    console.log(this);
    app.createProduct();
});

let updateProductBtn = document.querySelector("#updateProduct");

updateProductBtn.addEventListener("click", function () {
    app.handleUpdate();
});

app.addProduct(product);
app.addProduct(product2);

app.renderProducts();
console.log(app);

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
let productList = [];

const saveProductList = () =>
    localStorage.setItem("productList", JSON.stringify(productList));
function addTabButtonListener(btnId, title, divClass) {
    $(btnId).onclick = () => {
        $$(".content .active").forEach((e) => {
            e.classList.remove("active");
        });
        $(".content h2").innerText = title;
        $(`.content .${divClass}`).classList.add("active");
        if (btnId === "#tab-product-edit") {
            renderProducList();
        }
    };
}
addTabButtonListener("#tab-product-list", "Danh mục sản phẩm", "produc-detail");
addTabButtonListener("#tab-product-edit", "Sửa đổi sản phẩm", "product-list");
addTabButtonListener(
    "#tab-product-add",
    "Thêm sản phẩm mới",
    "product-add-new"
);

const handleImageChange = (inputFile, imgElement) => {
    const file = inputFile.files[0];
    if (file.type.match(/image.*/)) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imgElement.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

$("#product-img-file").onchange = (e) => {
    handleImageChange(e.target, $("#product-img"));
};

$("#save-product").onclick = () => {
    let name = $("#product-name").value;
    let price = $("#product-price").value;
    let info = $("#product-info").value;
    let productImg = $("#product-img").src;
    if (name && price && info && productImg) {
        const newProduct = {
            id: +productList[productList.length-1].id +1,
            name,
            price,
            info,
            productImg,
        };
        productList.push(newProduct);
    }
    saveProductList();

    alert("Sản phẩm đã lưu!!");
};
const getIndexOfRow = (child) =>
    [...$(".product-list #product-table").children].indexOf(
        child.parentElement
    );

const deleteProduct = (child) => {
    const index = getIndexOfRow(child);
    productList.splice(index, 1);
    $(".product-list #product-table").removeChild(
        $(".product-list #product-table").children[index]
    );
    updateCount()
    saveProductList()
};

const editProduct = (child) => {
    const row = child.parentElement;
    row.querySelectorAll(".product-item").forEach((item) => {
        item.removeAttribute("disabled");
    });
    row.querySelector(".btn-edit").style.display = "none";
    row.querySelector(".btn-save").style.display = "block";
    const fileInput = row.querySelector("#edit-img");
    const imgElement = row.querySelector(".product-item-img");
    if (typeof fileInput.onchange !== "function") {
        fileInput.onchange = (e) => {
            handleImageChange(e.target, imgElement);
        };
    }
};

const saveProduct = (child) => {
    const row = child.parentElement;
    row.querySelector(".btn-edit").style.display = "block";
    row.querySelector(".btn-save").style.display = "none";
    const editedProductInfo = row.querySelectorAll(".product-item");
    editedProductInfo.forEach((item) => {
        item.setAttribute("disabled", "");
    });
    const editedProduct = {
        id: editedProductInfo[0].value,
        name: editedProductInfo[2].value,
        price: editedProductInfo[3].value,
        info: editedProductInfo[4].value,
        productImg: row.querySelector(".product-item-img").src,
    };
    const index = getIndexOfRow(child);
    productList[index] = editedProduct;
    saveProductList();
};

const updateCount = () => {
    $("#product-count").innerText = productList.length + " Sản phẩm";
};
const renderOneRow = (index) => {
    let row = document.createElement("div");
    row.className = "row";
    row.setAttribute("data", index);
    row.innerHTML = `
        <input type="text" class="product-item" disabled value="${productList[index].id}"
        onfocus="this.select()">
    <label for="edit-img"><img src="${productList[index].productImg}" alt="${productList[index].name}" class="product-item-img" /></label> 
    <input id="edit-img" type="file" class="product-item" hidden disabled>
    <input type="text" class="product-item" disabled value="${productList[index].name}"
        onfocus="this.select()">
    <input type="text" class="product-item" disabled value="${productList[index].price}"
        onfocus="this.select()">
        <input type="text" class="product-item" disabled value="${productList[index].info}"
        onfocus="this.select()">
    <input type="button" class="btn btn-edit" value="Edit"
        onclick="editProduct(this)">
    <input type="button" class="btn btn-save" value="Save"
        onclick="saveProduct(this)">
    <input type="button" class="btn btn-delete" value="Delete"
        onclick="deleteProduct(this)"> `;
    $("#product-table").appendChild(row);
};
// editProduct(getIndexOfRow(this))
function renderProducList() {
    productList = JSON.parse(localStorage.getItem("productList")) || [];
    $("#product-table").innerHTML = "";
    if (productList.length > 0) {
        for (index in productList) {
            renderOneRow(index);
        }
    }
    updateCount();
}
renderProducList();

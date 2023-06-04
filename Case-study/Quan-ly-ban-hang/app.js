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
            renderEditProducList();
        }
        if (btnId === "#tab-product-list") {
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

$("#product-img-url-btn").onclick = (e) => {
    const img = new Image();
    const imageUrl = $("#product-img-url").value;
    img.onload = () => {
        $("#product-img").src = imageUrl;
    };
    img.onerror = () => {
        alert("Hình ảnh không tồn tại");
    };
    img.src = imageUrl;
    console.log("check img");
};

$("#save-product").onclick = () => {
    const name = $("#product-name").value;
    const price = $("#product-price").value;
    const info = $("#product-info").value;
    const productImg = $("#product-img").src;
    if (name && price && info && productImg) {
        const newProduct = {
            id: +productList[productList.length - 1].id + 1,
            name,
            price,
            info,
            productImg,
        };
        productList.push(newProduct);
    }
    saveProductList();
    $("#product-name").value = "";
    $("#product-price").value = "";
    $("#product-info").value = "";
    $("#product-img").src = "./img/placeholder.png";
    $("#product-img-url").value = "";
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
    updateCount();
    saveProductList();
};

const editProduct = (child) => {
    const row = child.parentElement;
    row.querySelectorAll(".product-item").forEach((item) => {
        item.removeAttribute("disabled");
    });
    row.querySelector(".btn-edit").style.display = "none";
    row.querySelector(".btn-save").style.display = "block";
};

const changeImage = (child) =>{
    handleImageChange(child, child.parentElement.querySelector(".product-item-img"));
}

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
    $("#product-count").innerText ='Tổng cộng: '+ productList.length + " Sản phẩm";
};
const renderOneRow = (index) => {
    let row = document.createElement("div");
    row.className = "row";
    row.setAttribute("data", index);
    row.innerHTML = `
        <input type="text" class="product-item" disabled value="${productList[index].id}"
        onfocus="this.select()">
    <label for="edit-img-${index}"><img src="${productList[index].productImg}" alt="${productList[index].name}" class="product-item-img" /></label> 
    <input id="edit-img-${index}" type="file" class="product-item" hidden disabled onchange = "changeImage(this)">
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
const renderEditProducList = () => {
    productList = JSON.parse(localStorage.getItem("productList")) || [];
    $("#product-table").innerHTML = "";
    if (productList.length > 0) {
        for (index in productList) {
            renderOneRow(index);
        }
    }
    updateCount();
};
renderEditProducList();

const renderOneCol = (productItem) => {
    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `<div class="inner">    
            <img src="${productItem.productImg}" alt="${productItem.name}"/>
            <div>
            <h4>${productItem.name}</h4>
            <h5>${productItem.price}</h5>
            <p>${productItem.info}</p>
            </div> </div>`;
    return col;
};

const renderProducList = () => {
    $(".content .produc-detail").innerHTML = "";
    if (productList.length > 0) {
        let row = document.createElement("div");
        row.className = "row";
        $(".content .produc-detail").appendChild(row);
        let index = 0;
        const intervalId = setInterval(() => {
            if (index % 5 == 0) {
                row = document.createElement("div");
                row.className = "row";
                $(".content .produc-detail").appendChild(row);
            }
            row.appendChild(renderOneCol(productList[index]));
            index++;
            if (index == productList.length) {
                clearInterval(intervalId);
            }
        }, 250);
    }
};
renderProducList();

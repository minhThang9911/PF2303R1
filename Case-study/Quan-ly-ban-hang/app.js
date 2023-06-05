const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

class Product {
	constructor(id, name, price, info, productImg) {
		this.id = id;
		this.name = name;
		this.price = price;
		this.info = info;
		this.productImg = productImg;
	}
}

class ProductManager {
	productList = [];
	constructor() {
		this.productList =
			JSON.parse(localStorage.getItem("productList")) || [];
	}
	saveToStorage = () => {
		localStorage.setItem("productList", JSON.stringify(this.productList));
	};
	replace = (index, product) => {
		this.productList[index] = product;
	};
	delete = index => {
		this.productList.splice(index, 1);
	};
	add = product => {
		this.productList.push(product);
	};
	getProductList = () => this.productList;
	getProductCount = () => this.productList.length;
	get = index => this.productList[index];
}

const productManager = new ProductManager();

const addTabButtonListener = (btnId, title, divClass) => {
	$(btnId).onclick = () => {
		$$(".content .active").forEach(e => {
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
};
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
		reader.onload = e => {
			imgElement.src = e.target.result;
		};
		reader.readAsDataURL(file);
	}
};

$("#product-img-file").onchange = e => {
	handleImageChange(e.target, $("#product-img"));
};

$("#product-img-url-btn").onclick = e => {
	const img = new Image();
	const imageUrl = $("#product-img-url").value;
	img.onload = () => {
		$("#product-img").src = imageUrl;
	};
	img.onerror = () => {
		alert("Hình ảnh không tồn tại");
	};
	img.src = imageUrl;
};

$("#save-product").onclick = () => {
	const name = $("#product-name").value;
	const price = $("#product-price").value;
	const info = $("#product-info").value;
	const productImg = $("#product-img").src;
	if (name && price && info && productImg) {
        let newId = 0
        if(productManager.getProductCount() !=0) {
            newId = +productManager.get(productManager.getProductCount() - 1).id + 1
        }
		const newProduct = new Product(
			newId,
			name,
			price,
			info,
			productImg
		);
		productManager.add(newProduct);
	}
	productManager.saveToStorage();
	$("#product-name").value = "";
	$("#product-price").value = "";
	$("#product-info").value = "";
	$("#product-img").src = "./img/placeholder.png";
	$("#product-img-url").value = "";
	alert("Sản phẩm đã lưu!!");
};
const getIndexOfRow = child =>
	[...$(".product-list #product-table").children].indexOf(
		child.parentElement
	);

const deleteProduct = child => {
	const index = getIndexOfRow(child);
	productManager.delete(index);
	$(".product-list #product-table").removeChild(
		$(".product-list #product-table").children[index]
	);
	updateCount();
	productManager.saveToStorage();
};

const editProduct = child => {
	const row = child.parentElement;
	row.querySelectorAll(".product-item").forEach(item => {
		item.removeAttribute("disabled");
	});
	row.querySelector(".btn-edit").style.display = "none";
	row.querySelector(".btn-save").style.display = "block";
};

const changeImage = child => {
	handleImageChange(
		child,
		child.parentElement.querySelector(".product-item-img")
	);
};

const saveProduct = child => {
	const row = child.parentElement;
	row.querySelector(".btn-edit").style.display = "block";
	row.querySelector(".btn-save").style.display = "none";
	const editedProductInfo = row.querySelectorAll(".product-item");
	editedProductInfo.forEach(item => {
		item.setAttribute("disabled", "");
	});
	const editedProduct = new Product(
		editedProductInfo[0].value,
		editedProductInfo[2].value,
		editedProductInfo[3].value,
		editedProductInfo[4].value,
		row.querySelector(".product-item-img").src
	);
	const index = getIndexOfRow(child);
	productManager.replace(index, editedProduct);
	productManager.saveToStorage();
};

const updateCount = () => {
	$("#product-count").innerText =
		"Tổng cộng: " + productManager.getProductCount() + " Sản phẩm";
};
const renderOneRow = index => {
	const row = document.createElement("div");
	row.className = "row";
	row.setAttribute("data", index);
	const product = productManager.get(index);
	row.innerHTML = `
        <input type="text" class="product-item" disabled value="${product.id}"
        onfocus="this.select()">
    <label for="edit-img-${index}"><img src="${product.productImg}" alt="${product.name}" class="product-item-img" /></label> 
    <input id="edit-img-${index}" type="file" class="product-item" hidden disabled onchange = "changeImage(this)">
    <input type="text" class="product-item" disabled value="${product.name}"
        onfocus="this.select()">
    <input type="text" class="product-item" disabled value="${product.price}"
        onfocus="this.select()">
        <input type="text" class="product-item" disabled value="${product.info}"
        onfocus="this.select()">
    <input type="button" class="btn btn-edit" value="Edit"
        onclick="editProduct(this)">
    <input type="button" class="btn btn-save" value="Save"
        onclick="saveProduct(this)">
    <input type="button" class="btn btn-delete" value="Delete"
        onclick="deleteProduct(this)"> `;
	$("#product-table").appendChild(row);
};
const renderEditProducList = () => {
	$("#product-table").innerHTML = "";
	if (productManager.getProductCount() > 0) {
		for (index in productManager.getProductList()) {
			renderOneRow(index);
		}
	}
	updateCount();
};
renderEditProducList();

const renderOneCol = productItem => {
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
	if (productManager.getProductCount() > 0) {
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
			row.appendChild(renderOneCol(productManager.get(index)));
			index++;
			if (index == productManager.getProductCount()) {
				clearInterval(intervalId);
			}
		}, 250);
	}
};
renderProducList();
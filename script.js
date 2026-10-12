
const model = document.getElementById("productModel");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productDescription = document.getElementById("productDescription");
const specType = document.getElementById("specType");
const statusMessage = document.getElementById("statusMessage");
const resetButton = document.getElementById("resetButton");

const productButtons = document.querySelectorAll(".product-button");

const defaultCamera = {
  orbit: "0deg 75deg 105%",
  fieldOfView: "30deg",
  target: "auto"
};

let selectedModel = "models/putih.glb";
let requestVersion = 0;

const products = {
  "models/putih.glb": {
    name: "Gelas Minum Putih",
    price: "Rp25.000",
    type: "Gelas biasa",
    alt: "Model 3D gelas minum putih biasa",
    description:
      "Gelas minum berwarna putih dengan desain sederhana untuk menemani aktivitas sehari-hari. Cocok digunakan untuk air putih, jus, dan berbagai minuman lainnya. Desainnya praktis untuk penggunaan di rumah maupun kantor."
  },

  "models/putih2.glb": {
    name: "Gelas Kopi Putih",
    price: "Rp30.000",
    type: "Gelas kopi",
    alt: "Model 3D gelas kopi putih",
    description:
      "Gelas kopi putih bergaya cangkir yang cocok untuk menikmati kopi, teh, atau minuman hangat lainnya. Desainnya memberikan kesan sederhana dan nyaman untuk waktu santai maupun menemani aktivitas kerja."
  }
};

// Memilih produk
productButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const file = button.dataset.model;
    const product = products[file];

    if (!product) {
      statusMessage.textContent = "Data produk tidak ditemukan.";
      return;
    }

    if (selectedModel === file && model.src) {
      resetCamera();
      return;
    }

    selectedModel = file;
    requestVersion++;

    productButtons.forEach((item) => {
      const active = item === button;

      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    productName.textContent = product.name;
    productPrice.textContent = product.price;
    productDescription.textContent = product.description;
    model.alt = product.alt;
    specType.textContent = product.type;

    statusMessage.textContent = `Memuat ${product.name}...`;

    resetCamera();

    // Mengganti model dengan file di folder models
    model.src = file;
  });
});

// Model berhasil dimuat
model.addEventListener("load", () => {
  const product = products[selectedModel];

  if (product) {
    statusMessage.textContent =
      `${product.name} berhasil dimuat. Geser model untuk melihat detailnya.`;
  }
});

// Model gagal dimuat
model.addEventListener("error", () => {
  statusMessage.textContent =
    `Model gagal dimuat. Periksa file ${selectedModel} di folder models.`;
});

// Reset kamera tanpa mengganti produk
function resetCamera() {
  model.cameraOrbit = defaultCamera.orbit;
  model.fieldOfView = defaultCamera.fieldOfView;
  model.cameraTarget = defaultCamera.target;
}

resetButton.addEventListener("click", () => {
  resetCamera();

  const product = products[selectedModel];

  statusMessage.textContent = product
    ? `Tampilan ${product.name} telah direset.`
    : "Tampilan telah direset.";
});

// Status awal
model.addEventListener("loadstart", () => {
  const product = products[selectedModel];

  if (product) {
    statusMessage.textContent = `Memuat ${product.name}...`;
  }
});

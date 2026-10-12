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


/* =====================================
   PEMILIHAN PRODUK
===================================== */

productButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const file = button.dataset.model;
    const product = products[file];

    if (!product) {
      statusMessage.textContent =
        "Data produk tidak ditemukan.";
      return;
    }

    selectedModel = file;

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

    statusMessage.textContent =
      `Memuat ${product.name}...`;

    resetCamera();

    // Mengatur sumber model hanya jika produknya berubah.
    if (model.getAttribute("src") !== file) {
      model.setAttribute("src", file);
    } else if (model.loaded) {
      statusMessage.textContent =
        `${product.name} berhasil dimuat.`;
    }
  });
});


/* =====================================
   STATUS MODEL 3D
===================================== */

model.addEventListener("load", () => {
  const product = products[selectedModel];

  if (product) {
    statusMessage.textContent =
      `${product.name} berhasil dimuat. Geser model untuk melihat detailnya.`;
  }
});

model.addEventListener("error", () => {
  statusMessage.textContent =
    `Model gagal dimuat. Periksa file ${selectedModel} di folder models.`;
});

model.addEventListener("loadstart", () => {
  const product = products[selectedModel];

  if (product) {
    statusMessage.textContent =
      `Memuat ${product.name}...`;
  }
});


/* =====================================
   RESET TAMPILAN KAMERA
===================================== */

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


/* =====================================
   MUSIK LATAR GLASSIFY
===================================== */

const backgroundMusic =
  document.getElementById("backgroundMusic");

const musicToggle =
  document.getElementById("musicToggle");

const musicIcon =
  document.getElementById("musicIcon");

const musicLabel =
  document.getElementById("musicLabel");

// Volume awal musik: 25%.
backgroundMusic.volume = 0.25;


// Memperbarui tampilan tombol musik.
function updateMusicButton(isPlaying) {
  musicIcon.textContent = isPlaying ? "♫" : "♪";

  musicLabel.textContent = isPlaying
    ? "Matikan Musik"
    : "Putar Musik";

  musicToggle.setAttribute(
    "aria-pressed",
    String(isPlaying)
  );

  musicToggle.setAttribute(
    "aria-label",
    isPlaying
      ? "Matikan musik latar"
      : "Putar musik latar"
  );
}


// Mencoba memutar musik secara otomatis.
async function tryAutoplayMusic() {
  try {
    await backgroundMusic.play();
    updateMusicButton(true);
  } catch (error) {
    // Browser memblokir autoplay atau audio gagal dimuat.
    // Pengguna masih dapat menekan tombol musik.
    updateMusicButton(false);
  }
}


// Tombol untuk memutar dan menghentikan musik.
musicToggle.addEventListener("click", async () => {
  if (backgroundMusic.paused) {
    try {
      await backgroundMusic.play();
      updateMusicButton(true);
    } catch (error) {
      updateMusicButton(false);

      console.error(
        "Musik tidak dapat diputar. Periksa file audio/background.mp3.",
        error
      );
    }
  } else {
    backgroundMusic.pause();
    updateMusicButton(false);
  }
});


// Menjaga status tombol tetap sesuai dengan kondisi audio.
backgroundMusic.addEventListener("play", () => {
  updateMusicButton(true);
});

backgroundMusic.addEventListener("pause", () => {
  updateMusicButton(false);
});

backgroundMusic.addEventListener("error", () => {
  updateMusicButton(false);

  console.error(
    "File audio gagal dimuat. Periksa folder audio dan nama file."
  );
});


// Jalankan percobaan autoplay setelah dokumen siap.
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    tryAutoplayMusic,
    { once: true }
  );
} else {
  tryAutoplayMusic();
}

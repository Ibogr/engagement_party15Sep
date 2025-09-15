const uploadBtn = document.getElementById("uploadBtn");
const cameraInput = document.getElementById("cameraInput");
const gallery_section = document.getElementById("gallery-section");

const cloudName = "dcmpdoyey";
const uploadPreset = "gallery";

uploadBtn.addEventListener("click", () => {
  cameraInput.click(); // Kamerayı aç
});

cameraInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 1. Cloudinary'e YÜKLE
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "gallery");
  formData.append("folder", "gallery");

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    console.log("data", data);

    // 2. Sayfada Göster (yeni yüklenen fotoğrafı)
    addImageToGallery(data.secure_url);

    console.log("Yüklendi:", data.secure_url); // Opsiyonel: kontrol için
  } catch (error) {
    console.error("Yükleme başarısız:", error);
  }
});

// Sayfa açılır açılmaz Cloudinary’den fotoğrafları getirip göster
async function loadGallery() {
  try {
    // Render URL’in
    const res = await fetch("/gallery");

    console.log(".res.", res, "res");
    if (!res.ok) throw new Error("Backend'den veri alınamadı");

    const images = await res.json();
    console.log("Backend’den gelen resimler:", images);

    for (let i = 0; i < images.length; i++) {
      addImageToGallery(images[i]);
      console.log(images[i]);
    }
  } catch (error) {
    console.error("Galeriyi yüklerken hata:", error);
    gallery_section.textContent = "Fotoğraflar yüklenemedi: " + error;
  }
}

// Fotoğrafı galeriye ekleyen fonksiyon (kod tekrarını önler)
function addImageToGallery(ur) {
  const img = document.createElement("img");
  console.log(img);
  img.src = ur;
  img.style.width = "300px";
  img.style.height = "auto";

  img.style.margin = "10px";
  gallery_section.appendChild(img);
}

// Sayfa yüklendiğinde galeriyi yükle
document.addEventListener("DOMContentLoaded", loadGallery);

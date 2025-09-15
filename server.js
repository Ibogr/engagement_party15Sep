import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(cors());

// Cloudinary ayarları
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Statik frontend dosyaları
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// Galeri endpointi
app.get("/gallery", async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression("folder:gallery")
      .sort_by("created_at", "desc")
      .max_results(30)
      .execute();

    const imageUrls = result.resources.map((img) => img.secure_url);
    res.json(imageUrls);
  } catch (error) {
    console.error("Cloudinary API hatası:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// Ana sayfa
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});

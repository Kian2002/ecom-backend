const express = require("express");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const API_KEY = process.env.API_KEY;

router.get("/games", async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://api.rawg.io/api/games?key=${API_KEY}&page_size=20&fields=id,name,background_image`
    );

    const games = data.results.map((game) => {
      const image = game.background_image;
      const imageId = game.id;

      cloudinary.uploader.upload(image, {
        overwrite: true,
        public_id: imageId,
        transformation: [
          { width: 500, quality: "100", fetch_format: "auto" },
          { dpr: "auto", crop: "fit" },
        ],
      });

      const secure_url = cloudinary.url(imageId, {
        secure: true,
      });

      return {
        id: game.id,
        name: game.name,
        background_image: secure_url.toString(),
        price: Math.floor(Math.random() * 100),
        platforms: game.platforms,
        genres: game.genres,
        short_screenshots: game.short_screenshots,
      };
    });

    res.send(Array.from(games));
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;

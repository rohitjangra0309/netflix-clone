const express = require("express");
const router = express.Router();
const movieController = require("../Controllers/Movies");

router.get("/getMovies", movieController.getMovies);
router.post("/addToFavorites", movieController.addToFavorites);
router.post("/getFavorites", movieController.getFavorites);
router.post("/deleteFavorite", movieController.deleteFavorite);

module.exports = router;

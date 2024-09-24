const User = require("../Models/User");
const axios = require("axios");
const Movie = require("../Models/Movie");

const getMovies = async (req, res) => {
  const { title } = req.query; 
  try {
    const options = {
      method: "GET",
      url: "https://imdb8.p.rapidapi.com/title/find",
      params: { q: title || "action" }, 
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "imdb8.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    res.status(200).json(response.data.results);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch movies", error: error.message });
  }
};

const addToFavorites = async (req, res) => {
  const { userId, title, image } = req.body;

  try {
    let movie = await Movie.findOne({ title: title });

    if (!movie) {
      movie = new Movie({
        title,
        image,
      });
      await movie.save(); 
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.favourites.includes(movie._id)) {
      user.favourites.push(movie._id); 
      await user.save(); 
      return res.status(200).json({ message: "Added to favorites" });
    } else {
      return res.status(400).json({ message: "Already in favorites" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding to favorites", error });
  }
};

const getFavorites = async (req, res) => {
  const { userId } = req.body;  
  try {
    const user = await User.findById(userId).populate("favourites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "Favorites fetched successfully",
      favourites: user.favourites,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching favorites", error });
  }
};


const deleteFavorite = async (req, res) => {
  const { userId, movieId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const movieIndex = user.favourites.indexOf(movieId);
    if (movieIndex === -1) {
      return res.status(400).json({ message: "Movie not found in favorites" });
    }
    user.favourites.splice(movieIndex, 1);
    await user.save();
    return res.status(200).json({ message: "Movie removed from favorites" });
  } catch (error) {
    return res.status(500).json({ message: "Error removing favorite", error });
  }
};


module.exports = { getMovies, addToFavorites, getFavorites, deleteFavorite };

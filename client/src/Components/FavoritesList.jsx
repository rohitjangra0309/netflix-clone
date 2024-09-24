import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
const baseApiUrl = import.meta.env.VITE_BASE_URL;


const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId'); // Get userId from localStorage
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(`${baseApiUrl}/getFavorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),  // Send userId in the request body
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch favorites');
      }

      setFavorites(data.favourites); // Update favorites state
      setLoading(false); // Stop loading after fetching
    } catch (error) {
      setError(error.message); // Set error message
      setLoading(false); // Stop loading
    }
  };

  const removeFavorite = async (movieId) => {
    try {
      const response = await fetch(`${baseApiUrl}/deleteFavorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, movieId }),  // Send userId and movieId in request body
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove favorite');
      }

      // Update the state to remove the movie from the list
      setFavorites(favorites.filter((movie) => movie._id !== movieId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFavorites(); // Fetch favorites if userId exists
    } else {
      setLoading(false);
      setError("User is not logged in"); // Show error if user is not logged in
    }
  }, [userId]);

  if (loading) {
    return <div className="text-white text-center">Loading favorites...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (favorites.length === 0) {
    return <div className="text-white text-center">No favorites yet</div>;
  }

  return (
    <div className="bg-[#141414] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Your Favorite Movies</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {favorites.map((movie) =>
            movie.image && ( // Only render if image is available
              <div key={movie._id} className="relative group overflow-hidden rounded-lg bg-gray-800">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-opacity duration-300 ease-in-out flex items-center justify-center">
                  <h3 className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {movie.title}
                  </h3>
                </div>
                <button
                  onClick={() => removeFavorite(movie._id)} // Remove from favorites
                  className="absolute bottom-2 right-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesList;

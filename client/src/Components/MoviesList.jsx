import React, { useEffect, useState } from "react";
const baseApiUrl = import.meta.env.VITE_BASE_URL;

const MoviesList = ({ searchTerm }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  // Fetch movies from your Express API
  const fetchMovies = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(`${baseApiUrl}/getMovies?title=${searchTerm}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMovies(data); // Assuming the data is an array of movie objects
    } catch (error) {
      setError(error.message); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const addToFavorites = async (movie) => {
    if (!userId) {
      alert("Please log in to add to favorites");
      return;
    }

    const favoriteData = {
      userId,              // Send the userId from localStorage
      title: movie.title,   // Send the movie title
      image: movie.image.url // Send the image URL
    };

    try {
      const response = await fetch(`${baseApiUrl}/addToFavorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(favoriteData),
      });

      const result = await response.json();

      if (response.status === 200) {
        alert(result.message); // "Added to favorites" or "Already in favorites"
      } else if (response.status === 400 || response.status === 404) {
        alert(result.message); // User not found or already in favorites
      } else {
        alert("An unexpected error occurred");
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [searchTerm]);

  if (loading) {
    return <div className="text-white text-center">Loading movies...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="bg-[#141414] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">
          {searchTerm[0].toUpperCase() + searchTerm.slice(1) + " Movies"}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {movies.map((movie) =>
            movie.image && ( // Only render if image is available
              <div key={movie.id} className="relative group overflow-hidden rounded-lg bg-gray-800">
                <img
                  src={movie.image.url}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-opacity duration-300 ease-in-out flex items-center justify-center">
                  <h3 className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {movie.title}
                  </h3>
                </div>
                <button
                  onClick={() => addToFavorites(movie)}
                  className="absolute bottom-0 left-0 w-full py-2 bg-red-600 text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  Add to Favorites
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviesList;

import React, { useState, useRef, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import MoviesList from './MoviesList';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('Spiderman');
  const [activeSearchTerm, setActiveSearchTerm] = useState('Spiderman'); // Active search term passed to MoviesList
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveSearchTerm(searchTerm);  // Set active search term
    onSearch(searchTerm);             // Call the parent-provided search function
    setShowSearch(false);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSearch(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isLoggedIn = !!userId; // Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Clear the userId from local storage
    localStorage.removeItem('token');   // Optionally clear the token
    navigate('/login');                 // Navigate to the login page
  };

  return (
    <>
      <nav className="bg-black text-white p-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <a href="/" className="hover:text-red-500">Netflix-Clone</a>
        </div>
        <div className="flex items-center space-x-4">
          {showSearch ? (
            <form ref={searchRef} onSubmit={handleSearch} className="flex items-center relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search movies..."
                className="p-2 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 w-64"
              />
              <button type="submit" className="absolute right-0 top-0 bottom-0 bg-red-600 rounded-md px-4 hover:bg-red-700 transition duration-200">
                Search
              </button>
              <button type="button" onClick={() => setShowSearch(false)} className="ml-2 text-red-500 hover:text-red-400">
                ✖️
              </button>
            </form>
          ) : (
            <button onClick={() => setShowSearch(true)} className="text-white hover:text-red-500">
              <FaSearch size={24} />
            </button>
          )}
          {isLoggedIn && (
            <a href="/favorites" className="hover:text-red-500">Favorites</a>
          )}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="hover:text-red-500">
              Logout
            </button>
          ) : (
            <a href="/login" className="hover:text-red-500">Login</a>
          )}
        </div>
      </nav>
      <MoviesList searchTerm={activeSearchTerm} />
    </>
  );
};

export default Navbar;

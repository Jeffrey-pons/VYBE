const fetchNowPlayingMovies = async (latitude, longitude) => {
    const apiKey = 'a2553a32d1234c8b4d5829f82be8fb62'; 
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&region=FR&language=fr-FR`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.results) {
        const nearbyMovies = data.results.filter(movie => {
            return isNearby(latitude, longitude, movie);
        })
        console.log("Films à proximité:", nearbyMovies);
        setMovies(nearbyMovies)
      } else {
        console.log("Aucun film trouvé.");
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API:", error);
    }
  };
  
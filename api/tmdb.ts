const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const TMDB_ENDPOINT = process.env.EXPO_PUBLIC_TMDB_URL;
const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter?data=[out:json];(node[%22amenity%22=%22cinema%22](around:5000,{lat},{lon}););out;';

export const getNowPlayingMoviesTmdb = async () => {
    try {
        const response = await fetch(`${TMDB_ENDPOINT}?api_key=${TMDB_API_KEY}&language=fr`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data.results || []; 
    } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
        throw new Error('Erreur lors de la récupération des films');
    }
};

export const getCinemasAroundPositionOverpass = async (lat: number, lon: number) => {
    try {
      const endpoint = OVERPASS_ENDPOINT.replace('{lat}', lat.toString()).replace('{lon}', lon.toString());
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      return data.elements || []; 
    } catch (error) {
      console.error('Erreur lors de la récupération des cinémas:', error);
      throw new Error('Erreur lors de la récupération des cinémas');
    }
  };

export const getEventsTmdb = async (lat: number, lon: number) => {
    try {
        const movies = await getNowPlayingMoviesTmdb();

        const cinemas = await getCinemasAroundPositionOverpass(lat, lon);

        return {
            movies,
            cinemas,
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des films et cinémas:', error);
        throw new Error('Erreur lors de la récupération des films et cinémas');
    }
};
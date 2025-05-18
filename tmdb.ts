const TMDB_API_KEY = 'f1397c64f8122628ae99a34d1d8059be';

export async function fetchTopMovies() {
    const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
    const data = await res.json();
    return data.results.slice(0, 10);
}

export async function fetchTrendingMovies() {
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}&language=en-US`);
    const data = await res.json();
    return data.results.slice(0, 10);
}
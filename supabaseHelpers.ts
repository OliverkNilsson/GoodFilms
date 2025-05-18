import { supabase } from "supabase";

export async function handleAddToMyMovies(userId: string, movie: any, rating: number, comment: string) {
    const existing = await supabase.from("user_movies").select("id").eq("user_id", userId).eq("movie_id", movie.id).single();

    if (existing.data) throw new Error("You already have this movie in your list.");

    const { error } = await supabase.from("user_movies").insert([
        {
            user_id: userId,
            movie_id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            rating,
            comment,
        },
    ]);

    if (error) {
        console.error("Insert error:", error);
        throw new Error("Could not add: " + (error.message || JSON.stringify(error)));
    }

    const { error: postError } = await supabase.from("movie_posts").insert([
        {
            user_id: userId,
            movie_title: movie.title,
            poster_path: movie.poster_path,
            rating,
            comment,
        },
    ]);

    if (postError) {
        throw new Error("Could not add: " + postError.message);
    }
}

export async function handleUpdateMovie(movieId: number, userId: string, newRating: number, newComment: string) {
    const { error } = await supabase
        .from("user_movies")
        .update({
            rating: newRating,
            comment: newComment,
        })
        .eq("user_id", userId)
        .eq("movie_id", movieId);

    if (error) {
        throw new Error("Could not edit movie: " + error.message);
    }
}

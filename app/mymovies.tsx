import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Pressable, Modal, TextInput, Button, Alert } from "react-native";
import { supabase } from "../supabase";
import { handleUpdateMovie } from "@/supabaseHelpers";
import AppBar from "../components/AppBar";
import SlidingMenu from "../components/SlidingMenu";

export default function MyMoviesScreen() {
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
    const [newRating, setNewRating] = useState("");
    const [newComment, setNewComment] = useState("");

    const user = supabase.auth.user();

    useEffect(() => {
        const fetchMyMovies = async () => {
            const { data, error } = await supabase.from("user_movies").select("*").eq("user_id", user?.id);

            if (error) {
                console.error("Fel vid hämtning:", error);
            } else {
                setMovies(data || []);
            }
            setLoading(false);
        };

        fetchMyMovies();
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.poster} />
            <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.rating}>{item.rating}/10</Text>
                <Text style={styles.comment}>{item.comment}</Text>
                <Text style={styles.addedDate}>Added: {new Date(item.created_at).toLocaleDateString("sv-SE")}</Text>
            </View>
            <Pressable
                onPress={() => {
                    setSelectedMovie(item);
                    setNewRating(item.rating.toString());
                    setNewComment(item.comment);
                    setEditModalVisible(true);
                }}
                style={styles.editButton}
            >
                <Text style={styles.editText}>✐</Text>
            </Pressable>
        </View>
    );

    return (
        <View style={styles.container}>
            <AppBar onMenuPress={() => setMenuVisible(true)} />
            <Text style={styles.topTitle}>My films</Text>
            <Text style={styles.countText}>Du har sett totalt {movies.length} filmer</Text>
            <SlidingMenu visible={menuVisible} onClose={() => setMenuVisible(false)} onNavigate={() => {}} />

            <Modal visible={editModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit film</Text>
                        <TextInput placeholder="Your rating (0-10)" keyboardType="numeric" value={newRating} onChangeText={setNewRating} style={styles.input} />
                        <TextInput placeholder="Add a comment" value={newComment} onChangeText={setNewComment} style={[styles.input, { height: 80 }]} multiline />
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Button title="Cancel" color="#aaa" onPress={() => setEditModalVisible(false)} />
                            <Button
                                title="Add"
                                color="#700B97"
                                onPress={async () => {
                                    try {
                                        const user = supabase.auth.user();
                                        if (!user) return Alert.alert("Inte inloggad");

                                        await handleUpdateMovie(selectedMovie.movie_id, user.id, Number(newRating), newComment);
                                        Alert.alert("Uppdaterad!");
                                        setEditModalVisible(false);
                                    } catch (err: any) {
                                        Alert.alert("Fel", err.message);
                                    }
                                }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {loading ? <ActivityIndicator size="large" color="#700B97" style={{ marginTop: 50 }} /> : <FlatList data={movies} renderItem={renderItem} keyExtractor={(item) => item.movie_id.toString()} contentContainerStyle={{ padding: 16 }} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: "#121212",
    },
    topTitle: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#fff",
        marginLeft: 30,
        marginBottom: 12,
    },
    countText: {
        color: "#fff",
        fontSize: 18,
        marginLeft: 30,
        marginBottom: 12,
    },
    card: {
        flexDirection: "row",
        marginBottom: 16,
        backgroundColor: "#1e1e1e",
        borderRadius: 10,
        overflow: "hidden",
    },
    poster: {
        width: 100,
        height: 150,
    },
    info: {
        flex: 1,
        padding: 10,
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 6,
    },
    rating: {
        fontSize: 16,
        color: "#FFD700",
        marginBottom: 4,
    },
    comment: {
        color: "#ccc",
    },
    addedDate: {
        marginTop: 6,
        color: "#aaa",
        fontSize: 12,
    },
    editButton: {
        marginRight: 10,
        marginTop: 10,
        backgroundColor: "#700B97",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: "flex-start",
    },
    editText: {
        color: "#fff",
        fontWeight: "bold",
    },
    modalBackdrop: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
});

import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, Pressable, Alert, Modal, Button } from "react-native";
import { fetchTopMovies, fetchTrendingMovies } from "../tmdb";
import { router } from "expo-router";
import AppBar from "../components/AppBar";
import SlidingMenu from "../components/SlidingMenu";
import { handleAddToMyMovies } from "../supabaseHelpers";
import { supabase } from "../supabase";

export default function HomeScreen() {
    const [movies, setMovies] = useState<any[]>([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"trending" | "top">("trending");

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<any>(null);
    const [rating, setRating] = useState("");
    const [comment, setComment] = useState("");

    const TMDB_API_KEY = "f1397c64f8122628ae99a34d1d8059be";

    useEffect(() => {
        const loadMovies = async () => {
            if (searchTerm.trim().length > 0) {
                const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchTerm)}&api_key=${TMDB_API_KEY}&language=en-US`);
                const data = await res.json();
                setMovies(data.results || []);
            } else if (activeTab === "trending") {
                const data = await fetchTrendingMovies();
                setMovies(data);
            } else {
                const data = await fetchTopMovies();
                setMovies(data);
            }
        };

        loadMovies();
    }, [activeTab, searchTerm]);

    const handleNavigate = (route: string) => {
        setMenuVisible(false);
        router.push(route as any);
    };

    const onPressAdd = (movie: any) => {
        setSelectedMovie(movie);
        setRating("");
        setComment("");
        setModalVisible(true);
    };

    const onSubmitMovie = async () => {
        try {
            const user = supabase.auth.user();

            if (!user) {
                Alert.alert("Inte inloggad", "Du måste vara inloggad för att spara filmer.");
                return;
            }

            const parsedRating = parseFloat(rating);
            if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 10) {
                Alert.alert("Felaktigt betyg", "Ange ett betyg mellan 0 och 10.");
                return;
            }

            await handleAddToMyMovies(user.id, selectedMovie, parsedRating, comment);
            Alert.alert("Filmen sparad", `"${selectedMovie.title}" har lagts till i din lista.`);
            setModalVisible(false);
        } catch (err: any) {
            Alert.alert("Fel", err.message);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.card}>
            <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.poster} />
            <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.rating}>{item.vote_average.toFixed(1)}/10</Text>
            </View>
            <Pressable style={styles.addButton} onPress={() => onPressAdd(item)}>
                <Text style={styles.addText}>+</Text>
            </Pressable>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <AppBar onMenuPress={() => setMenuVisible(true)} />
            <SlidingMenu visible={menuVisible} onClose={() => setMenuVisible(false)} onNavigate={handleNavigate} />

            <View style={styles.topControls}>
                <TextInput value={searchTerm} onChangeText={setSearchTerm} placeholder="Search movies..." placeholderTextColor="#888" style={styles.search} />

                <View style={styles.tabButtons}>
                    <Pressable onPress={() => setActiveTab("trending")} style={[styles.tabButton, activeTab === "trending" && styles.tabActive]}>
                        <Text style={styles.tabText}>Trending</Text>
                    </Pressable>
                    <Pressable onPress={() => setActiveTab("top")} style={[styles.tabButton, activeTab === "top" && styles.tabActive]}>
                        <Text style={styles.tabText}>Top Rated</Text>
                    </Pressable>
                </View>
            </View>

            <FlatList data={movies} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} contentContainerStyle={styles.listContent} />

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add to My Films</Text>
                        <TextInput placeholder="Your rating (0-10)" keyboardType="numeric" value={rating} onChangeText={setRating} style={styles.input} />
                        <TextInput placeholder="Add a comment" value={comment} onChangeText={setComment} style={[styles.input, { height: 80 }]} multiline />
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Button title="Cancel" color="#aaa" onPress={() => setModalVisible(false)} />
                            <Button title="Add" color="#700B97" onPress={onSubmitMovie} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: "#121212",
    },
    topControls: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    search: {
        backgroundColor: "#1e1e1e",
        color: "#fff",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 12,
    },
    tabButtons: {
        flexDirection: "row",
    },
    tabButton: {
        flex: 1,
        backgroundColor: "black",
        paddingVertical: 10,
        marginHorizontal: 4,
        borderRadius: 8,
        alignItems: "center",
    },
    tabActive: {
        backgroundColor: "#700B97",
    },
    tabText: {
        color: "#fff",
        fontWeight: "600",
    },
    listContent: {
        paddingBottom: 60,
        paddingHorizontal: 16,
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
        padding: 10,
        flex: 1,
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
    addButton: {
        marginRight: 10,
        marginTop: 10,
        backgroundColor: "#700B97",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: "flex-start",
    },
    addText: {
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
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
    },
});

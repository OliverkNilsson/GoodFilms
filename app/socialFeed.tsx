import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from "react-native";
import { supabase } from "../supabase";
import AppBar from "../components/AppBar";
import SlidingMenu from "../components/SlidingMenu";

export default function SocialFeedScreen() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from("movie_posts")
                .select(
                    `
                    id,
                    created_at,
                    rating,
                    comment,
                    movie_title,
                    poster_path,
                    profiles (
                        username
                    )
                `
                )
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Kunde inte hämta inlägg:", error);
            } else {
                setPosts(data || []);
            }

            setLoading(false);
        };

        fetchPosts();
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.poster} />
            <View style={styles.info}>
                <Text style={styles.userLine}>
                    <Text style={styles.postTitle}>{item.profiles?.username || "Unknown"}</Text>
                    <Text style={styles.secondTitle}> just watched {item.movie_title}</Text>
                </Text>
                <Text style={styles.rating}>Rating: {item.rating}/10</Text>
                <Text style={styles.comment}>Comment: {item.comment}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <AppBar onMenuPress={() => setMenuVisible(true)} />
            <SlidingMenu visible={menuVisible} onClose={() => setMenuVisible(false)} onNavigate={() => {}} />
            <Text style={styles.header}>Community Feed</Text>
            {loading ? <ActivityIndicator size="large" color="#700B97" style={{ marginTop: 40 }} /> : <FlatList data={posts} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} contentContainerStyle={{ padding: 16 }} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: "#121212",
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        marginLeft: 20,
        marginBottom: 12,
    },
    card: {
        flexDirection: "row",
        marginBottom: 16,
        backgroundColor: "#1e1e1e",
        borderRadius: 10,
        overflow: "hidden",
    },
    postTitle: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 20,
    },
    secondTitle: {
        color: "#fff",
        fontStyle: "italic",
        fontSize: 15,
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
    userLine: {
        fontSize: 16,
        marginBottom: 6,
    },
    rating: {
        fontSize: 14,
        color: "#FFD700",
        marginBottom: 4,
    },
    comment: {
        color: "#ccc",
    },
});

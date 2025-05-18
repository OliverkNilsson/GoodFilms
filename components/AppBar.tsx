import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function AppBar({ onMenuPress }: { onMenuPress: () => void }) {
    return (
        <View style={styles.container}>
            <Pressable onPress={onMenuPress} style={styles.menuButton}>
                <Ionicons name="menu" size={28} color="white" />
            </Pressable>
            <Text style={styles.title}>GoodFilms</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        backgroundColor: "#121212",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginLeft: 12,
    },
    menuButton: {
        padding: 6,
    },
});

import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useRef } from "react";
import { supabase } from "../supabase";
import { router } from "expo-router";

export default function SlidingMenu({ visible, onClose, onNavigate }: { visible: boolean; onClose: () => void; onNavigate: (route: string) => void }) {
    const translateX = useRef(new Animated.Value(-250)).current;

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: visible ? 0 : -250,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    const handleLogout = async () => {
        onClose();
        await supabase.auth.signOut();
        router.replace("/login" as any);
    };

    return (
        <Animated.View style={[styles.menu, { transform: [{ translateX }] }]}>
            <View style={styles.content}>
                <Pressable onPress={onClose} style={styles.menuItem}>
                    <Text style={styles.menuText}>✖</Text>
                </Pressable>

                <Pressable onPress={() => router.push("/")} style={styles.menuItem}>
                    <Text style={styles.menuText}>🔎 Discover</Text>
                </Pressable>

                <Pressable onPress={() => router.push("/socialFeed")} style={styles.menuItem}>
                    <Text style={styles.menuText}>👥 Community feed</Text>
                </Pressable>

                <Pressable onPress={() => onNavigate("/mymovies")} style={styles.menuItem}>
                    <Text style={styles.menuText}>🎥 My Films</Text>
                </Pressable>
            </View>

            <Pressable onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Log out</Text>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    menu: {
        position: "absolute",
        top: 60,
        left: 0,
        width: 250,
        height: "100%",
        backgroundColor: "#121212",
        zIndex: 100,
        paddingTop: 20,
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 80, // plats för logga ut
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 20,
    },
    menuItem: {
        paddingVertical: 18,
    },
    menuText: {
        color: "#f0f0f0",
        fontSize: 22,
    },
    logoutButton: {
        position: "absolute",
        bottom: 24,
        left: 16,
        right: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
    },
    logoutText: {
        color: "#f0f0f0",
        fontSize: 16,
        fontWeight: "600",
    },
});

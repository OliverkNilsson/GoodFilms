import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { supabase } from "../supabase";
import { router } from "expo-router";

const COLORS = {
    background: "#000000",
    primary: "#3E065F",
    accent: "#700B97",
    highlight: "#8E05C2",
    text: "#ffffff",
    inputBg: "#1e1e1e",
};

export default function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const handleRegister = async () => {
        const { user, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            Alert.alert("Error with registration", error.message);
        } else if (user) {
            const { error: profileError } = await supabase.from("profiles").insert([{ id: user.id, username }]);

            if (profileError) {
                Alert.alert("Registered but profile error", profileError.message);
            } else {
                Alert.alert("Registration success", "You can now log in.");
                router.replace("/login" as any);
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create account</Text>

            <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Username" placeholderTextColor="#aaa" />

            <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="E-post" keyboardType="email-address" placeholderTextColor="#aaa" />

            <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" placeholderTextColor="#aaa" />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => router.replace("/login")}>
                <Text style={styles.buttonText}>Back to log in</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: COLORS.highlight,
        marginBottom: 32,
        textAlign: "center",
    },
    input: {
        backgroundColor: COLORS.inputBg,
        color: COLORS.text,
        padding: 14,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
    },
    button: {
        backgroundColor: COLORS.accent,
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 12,
    },
    secondaryButton: {
        backgroundColor: COLORS.accent,
    },
    buttonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: "600",
    },
});

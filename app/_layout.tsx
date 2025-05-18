import { Session } from "@supabase/supabase-js";
import { Slot, router, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { supabase } from "../supabase";

export default function Layout() {
    const [session, setSession] = useState<Session | null | undefined>(undefined);
    const segments = useSegments();

    useEffect(() => {
        const session = supabase.auth.session();
        setSession(session);

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            listener?.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (session === undefined) return;
        const inAuthGroup = segments[0] === "login" || segments[0] === "register";

        if (!session && !inAuthGroup) {
            router.replace("/login" as any);
        }

        if (session && inAuthGroup) {
            router.replace("/" as any);
        }
    }, [session, segments]);

    if (session === undefined) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return <Slot />;
}

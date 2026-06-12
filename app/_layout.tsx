import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import useTaskStore from '../src/store/useTaskStore';
import useAuthStore from '../src/store/useAuthStore';

// Exercício 3: GluestackUIProvider envolve toda a navegação
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

export default function RootLayout() {
    const taskHydrated = useTaskStore((s) => s._hydrated);
    const authHydrated = useAuthStore((s) => s._hydrated);
    const token = useAuthStore((s) => s.token);
    const router = useRouter();
    const segments = useSegments();

    const hydrated = taskHydrated && authHydrated;

    useEffect(() => {
        if (!hydrated) return;

        const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup';

        if (!token && !inAuthGroup) {
            router.replace('/login');
        } else if (token && inAuthGroup) {
            router.replace('/(tabs)');
        }
    }, [hydrated, token, segments]);

    if (!hydrated) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <GluestackUIProvider config={config}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="signup" options={{ headerShown: false }} />
                <Stack.Screen
                    name="task/[id]"
                    options={{ title: 'Detalhes da Tarefa', headerBackTitle: 'Voltar' }}
                />
            </Stack>
            <StatusBar style="auto" />
        </GluestackUIProvider>
    );
}

import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { globalStyles } from '../../src/styles/global';
import useTaskStore from '../../src/store/useTaskStore';
import useAuthStore from '../../src/store/useAuthStore';

export default function SettingsScreen() {
    const { tasks, deleteAllTasks } = useTaskStore();
    const { email, logout } = useAuthStore();
    const router = useRouter();
    const completedCount = tasks.filter(t => t.completed).length;
    const pendingCount = tasks.filter(t => !t.completed).length;

    const handleLogout = () => {
        logout();
        router.replace('/login');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>Estatísticas</Text>
            <View style={styles.card}>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Total de tarefas</Text>
                    <Text style={styles.statValue}>{tasks.length}</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Concluídas</Text>
                    <Text style={[styles.statValue, { color: '#4caf50' }]}>{completedCount}</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Pendentes</Text>
                    <Text style={[styles.statValue, { color: '#ff9800' }]}>{pendingCount}</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Sobre</Text>
            <View style={styles.card}>
                <Text style={styles.aboutText}>Gerenciador de Tarefas</Text>
                <Text style={styles.aboutSubText}>Expo + Zustand + Expo Router</Text>
                <Text style={styles.versionText}>v1.0.0</Text>
            </View>

            <Text style={styles.sectionTitle}>Conta</Text>
            <View style={styles.card}>
                {!!email && <Text style={styles.emailText}>{email}</Text>}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Sair</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyles.backgroundColor,
    },
    content: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 24,
        marginBottom: 8,
        marginLeft: 4,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    statLabel: {
        fontSize: 16,
        color: '#333',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    aboutText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    aboutSubText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    versionText: {
        fontSize: 12,
        color: '#aaa',
    },
    emailText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 12,
    },
    logoutButton: {
        backgroundColor: '#000',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

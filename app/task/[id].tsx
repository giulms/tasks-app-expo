import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import useTaskStore from '../../src/store/useTaskStore';

export default function TaskDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const task = useTaskStore(state => state.tasks.find(t => t._id === id));
    const setEditingTask = useTaskStore(state => state.setEditingTask);

    if (!task) {
        return (
            <View style={styles.notFoundContainer}>
                <Text style={styles.notFoundText}>Tarefa não encontrada.</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

    const handleEdit = () => {
        setEditingTask(task);
        router.back();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.card}>
                <Text style={styles.taskTitle}>{task.text}</Text>

                <View style={styles.badgeRow}>
                    <View style={[styles.badge, task.completed ? styles.badgeCompleted : styles.badgePending]}>
                        <Text style={styles.badgeText}>
                            {task.completed ? '✅ Concluída' : '📋 Pendente'}
                        </Text>
                    </View>
                </View>

                {task.dueDate && (
                    <View style={styles.detailRow}>
                        <Feather name="calendar" size={16} color={isOverdue ? '#e53935' : '#43a047'} />
                        <Text style={[styles.detailText, isOverdue ? styles.textOverdue : styles.textOnTime]}>
                            Data limite: {new Date(task.dueDate).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                            })}
                            {isOverdue ? '  (Atrasada)' : ''}
                        </Text>
                    </View>
                )}

                <View style={styles.detailRow}>
                    <Feather name="hash" size={16} color="#888" />
                    <Text style={styles.detailTextMuted}>ID: {task._id}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Feather name="edit-2" size={18} color="#fff" />
                <Text style={styles.editButtonText}>Editar Tarefa</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 16,
    },
    taskTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
    },
    badgeRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    badge: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    badgeCompleted: {
        backgroundColor: '#e8f5e9',
    },
    badgePending: {
        backgroundColor: '#fff8e1',
    },
    badgeText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    detailText: {
        fontSize: 15,
        fontWeight: '500',
    },
    detailTextMuted: {
        fontSize: 13,
        color: '#aaa',
    },
    textOverdue: {
        color: '#e53935',
    },
    textOnTime: {
        color: '#43a047',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#000',
        paddingVertical: 14,
        borderRadius: 10,
        elevation: 2,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    notFoundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    notFoundText: {
        fontSize: 18,
        color: '#666',
    },
    backButton: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        backgroundColor: '#000',
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
